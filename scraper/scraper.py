#!/usr/bin/env python


import logging
import urllib

import pyrebase
from bs4 import BeautifulSoup
import requests
import datetime
import time
import pytz


def setupLogger():
    logger = logging.getLogger('scraper')
    logger.setLevel(logging.DEBUG)
    # fh = logging.FileHandler('scraper.log')
    # fh.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    # fh.setFormatter(formatter)
    ch.setFormatter(formatter)
    # logger.addHandler(fh)
    logger.addHandler(ch)

    return logger;


class FireBaseWriter:

    def __init__(self, logger):
        self.logger = logger
        self.config = {
            "apiKey": "AIzaSyBFCCIDh2U6K6hHoP4fHlz-pUbSH_85xRo",
            "authDomain": "mtbapp-4204e.firebaseapp.com",
            "databaseURL": "https://mtbapp-4204e.firebaseio.com",
            "storageBucket": "mtbapp-4204e.appspot.com",
            # "serviceAccount": "./mtbapp-4204e-986fb0c75199.json"
        }
        self.firebase = pyrebase.initialize_app(self.config)
        auth = self.firebase.auth()
        self.user = auth.sign_in_with_email_and_password("test@mtbapp.be", "t3st@MTB@PP")
        self.db = self.firebase.database()

    def add(self, ride):
        self.logger.info('Writing ride %s to firebase database' % ride)
        results = self.db.child("rides").push(ride, self.user['idToken'])

    def rideExists(self, ride):
        self.logger.info('Checking if ride %s exists' % ride['location'])
        exists = False;


        locationRides = list()
        locationRides = self.db.child('rides').order_by_child('location').equal_to(
            ride['location']).get(
            self.user['idToken']).each()

        locationRides = locationRides + self.db.child('rides').order_by_child('location').equal_to(
            ride['location'].replace('-', ' ')).get(
            self.user['idToken']).each()

        for hit in locationRides:
            value = hit.val()
            if value['date'] == ride['date'] and ( self.fieldEquals('street', value['address'], ride['address']) or self.fieldEquals('location', value['address'], ride['address'])):
                exists = True

        if exists:
            self.logger.info('Ride %s already exists in the database' % ride['location'])
        else:
            self.logger.info('Ride %s does not exists in the database' % ride['location'])
        return exists;


    def fieldEquals(self, field, itemA, itemB):
        return (field in itemA and field in itemB) and (itemA[field] in itemB[field] or itemB[field] in itemA[field])

    def clear(self):
        self.logger.info('Clearing rides database')
        self.db.child("rides").remove(self.user['idToken'])


class GeoCoder:

    def __init__(self):
        self.token = 'pk.eyJ1IjoiYnJhbWphbnNzZW4iLCJhIjoiY2prZTBvdmxnMWtuczNrbnZ5dnJobzN6NSJ9.T3w_c9JDKgmQKBNEZR2YPQ';
        self.url = 'https://api.mapbox.com'
        self.deltaBbox = 0.1

    def GeoCodeReverse(self, params, poi):

        types = 'address,place'

        if poi:
            types = 'poi,' + types

        response = requests.get(
            '%s/geocoding/v5/mapbox.places/%s.json?autocomplete=true&language=NL&types=%s&country=BE,'
            'NL&limit=1&access_token=%s' % (
                self.url, ','.join(params).replace('/', '%2F'), types, self.token)).json()

        location = dict()
        if response['features'] and len(response['features']) > 0:
            location['center'] = response['features'][0]['center']
            if 'bbox' in response['features'][0]:
                location['bbox'] = response['features'][0]['bbox']
            else:
                location['bbox'] = [response['features'][0]['center'][0] - self.deltaBbox,
                                    response['features'][0]['center'][1] - self.deltaBbox,
                                    response['features'][0]['center'][0] + self.deltaBbox,
                                    response['features'][0]['center'][1] + self.deltaBbox]

        else:
            location['bbox'] = ''
            location['center'] = ''

        return location


class MTBYouScraper:

    def __init__(self, logger, db):
        self.db = db
        self.baseurl = 'http://www.mtb-you.be'
        self.url = '%s/default.asp?contentid=421' % self.baseurl
        self.logger = logger
        self.geocoder = GeoCoder()

    def scrape(self):
        self.scrapeCalendar()

    def scrapeCalendar(self):

        accomodations = self.accomodations()
        startDate = datetime.datetime.now()
        endDate = datetime.datetime(startDate.year, startDate.month + 1, startDate.day)
        currDate = startDate

        while currDate < endDate:
            url = '%s&datum=%s' % (self.url, currDate.strftime('%Y-%m-%d'))
            self.logger.info('Scraping %s' % url)
            soup = BeautifulSoup(requests.get(url).content, 'html.parser')
            pageRides = soup.find_all('tr', attrs={'class': ['tr1', 'tr2']})
            for ride in pageRides:
                rideDetails = ride.find_all('td', attrs={'class', 'kalender_detail'})

                ride = dict()
                ride['date'] = long(pytz.timezone('UTC').localize(
                    datetime.datetime.strptime(rideDetails[1].text, '%d/%m/%Y')).strftime('%s'))
                ride['location'] = str(rideDetails[2].text.encode('utf-8')).lower()
                ride['distance'] = rideDetails[3].text
                ride['time'] = rideDetails[4].text

                currDate = datetime.datetime.strptime(rideDetails[1].text, '%d/%m/%Y')

                rideUrl = '%s%s' % (self.baseurl, rideDetails[2].find('a').get('href'))
                rideSoup = BeautifulSoup(requests.get(rideUrl).content, 'html.parser')

                rideInfoBlocks = rideSoup.find_all('table', attrs={'class', 'kalender_overzicht2'})

                ride['source'] = rideUrl

                nextAddress = ''
                ride['address'] = dict()
                for part in rideInfoBlocks[0].find('span', attrs={'class', 'titelke'}).parent.contents:

                    if 'Locatie' in str(part.encode('utf-8')):
                        nextAddress = 'location'
                    elif 'Adres' in str(part.encode('utf-8')):
                        nextAddress = 'street'
                    elif 'Gemeente' in str(part.encode('utf-8')):
                        nextAddress = 'city'

                    if not str(part.encode('utf-8')).startswith('<'):
                        ride['address'][nextAddress] = str(part.encode('utf-8')).lower()

                params = list()
                poi = False
                if 'street' in ride['address']:
                    params.append(ride['address']['street'])
                elif 'location' in ride['address']:
                    params.append(ride['address']['location'])
                    poi = True

                if 'city' in ride['address']:
                    params.append(ride['address']['city'])

                ride['geolocation'] = self.geocoder.GeoCodeReverse(params, poi)

                nextPrice = False
                for part in rideInfoBlocks[1].find('span', attrs={'class', 'titelke'}).parent.contents:
                    if 'Prijs' in str(part.encode('utf-8')):
                        nextPrice = True

                    if nextPrice and not str(part.encode('utf-8')).startswith('<'):
                        nextPrice = False
                        ride['price'] = str(part.encode('utf-8'))

                ride['accommodation'] = dict()
                for part in rideInfoBlocks[4].find_all('img'):
                    key = accomodations[part['title']]
                    if key:
                        ride['accommodation'][key] = ('True' in part['src'])

                self.logger.info('Details %s' % ride)

                if not self.db.rideExists(ride):
                    self.db.add(ride)

    def accomodations(self):
        accomodations = dict()
        accomodations['Bewaakte fietsenstalling'] = 'bikecorner_guarded'
        accomodations['Wasgelegenheid'] = 'wash'
        accomodations['Douches'] = 'showers'
        accomodations['Douches (+kleedk)'] = 'showers'
        accomodations['Afspuitstand'] = 'bike_clean'
        accomodations['Huur mountainbike'] = 'bike_rent'
        accomodations['Kids toer'] = 'kids_tour'
        return accomodations


class MTBBEScraper:

    def __init__(self, logger, db):
        self.db = db
        self.baseurl = 'https://www.mountainbike.be'
        self.url = '%s/toertochten-overzicht' % self.baseurl
        self.logger = logger
        self.geocoder = GeoCoder()

    def scrape(self):
        self.scrapeCalendar()

    def scrapeCalendar(self):

        accomodations = self.accomodations()
        startDate = datetime.datetime.now()
        endDate = datetime.datetime(startDate.year, startDate.month + 1, startDate.day)
        currDate = startDate

        # while currDate < endDate:
        #url = '%s&datum=%s' % (self.url, currDate.strftime('%Y-%m-%d'))
        url = self.url
        self.logger.info('Scraping %s' % url)
        soup = BeautifulSoup(requests.get(url).content, 'html.parser')
        rideTable = soup.find_all('div', attrs={'class': ['pad-l-tny', 'pad-r-tny']})
        dateRides = rideTable[1].find_all('div', attrs={
            'class': ['row', 'collapse', 'border-solid', 'border-bottom', 'border-iron', 'font-steel', 'pad-b-tny']})

        for dateElem in dateRides:
            date = dateElem.find('div', attrs={'class': ['small-2', 'column']})
            rides = dateElem.find_all('a')

            for rideElem in rides:
                rideDetails = rideElem.find_all('div', attrs={'class', 'column'})

                ride = dict()

                # @TODO: Check if the date is not in the next year

                ride['date'] = long(pytz.timezone('UTC').localize(
                    datetime.datetime.strptime(str(date.text).strip().split(' ')[1] + '/' + str(currDate.year), '%d/%m/%Y')).strftime('%s'))
                ride['location'] = str(rideDetails[2].text.encode('utf-8')).strip().lower()
                ride['distance'] = str(rideDetails[3].text).strip()
                ride['time'] = str(rideDetails[4].text).strip()

                currDate = datetime.datetime.strptime(str(date.text).strip().split(' ')[1] + '/' + str(currDate.year), '%d/%m/%Y')

                rideUrl = '%s%s' % (self.baseurl, rideElem.get('href'))
                rideSoup = BeautifulSoup(requests.get(rideUrl).content, 'html.parser')

                ride['source'] = rideUrl
                ride['address'] = dict()

                divBlocks = rideSoup.find_all('div', attrs={'class': ['mrg-r-small', 'pad-t-tny']})

                locationBlock = divBlocks[4]
                for index, line in enumerate(locationBlock.text.split('\n')[4:-1]):
                    value = str(line.encode('utf-8')).strip().lower()
                    if index == 0 and value:
                        ride['address']['location'] = value
                    elif index == 1 and value:
                        ride['address']['street'] = value
                    elif index == 2 and value:
                        ride['address']['city'] = value


                params = list()
                poi = False
                if 'street' in ride['address']:
                    params.append(ride['address']['street'])
                elif 'location' in ride['address']:
                    params.append(ride['address']['location'])
                    poi = True

                if 'city' in ride['address']:
                    params.append(ride['address']['city']);

                ride['geolocation'] = self.geocoder.GeoCodeReverse(params, poi)


                priceElems =  divBlocks[6].text.strip().split('\n')

                if  len(priceElems) > 2:
                    ride['price'] = divBlocks[6].text.strip().split('\n')[2].strip()
                else:
                    ride['price'] = ''



                ride['accommodation'] = dict()
                for part in divBlocks[-2].find_all('li'):
                    key = accomodations[str(part.text).strip()]
                    if key:
                        ride['accommodation'][key] = ('check' in part.find('img')['src'])

                self.logger.info('Details %s' % ride)

                if not self.db.rideExists(ride):
                    self.db.add(ride)

    def accomodations(self):
        accomodations = dict()
        accomodations['Bewaakte fietsstand'] = 'bikecorner_guarded'
        accomodations['Man / Vrouw apart'] = 'gender_seperate'
        accomodations['Douches'] = 'showers'
        accomodations['Kleedkamers'] = 'showers'
        accomodations['Afspuitstand'] = 'bike_clean'
        accomodations['Fietsverhuur'] = 'bike_rent'
        accomodations['Bevoorrading'] = 'ride_stop'
        return accomodations


logger = setupLogger();

db = FireBaseWriter(logger)

db.clear()

scraper = MTBBEScraper(logger, db)
scraper.scrape()

scraper = MTBYouScraper(logger, db)
scraper.scrape()

