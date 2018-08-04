#!/usr/bin/env python


import logging

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
    #fh.setFormatter(formatter)
    ch.setFormatter(formatter)
    #logger.addHandler(fh)
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

    def clear(self):
        self.logger.info('Clearing rides database')
        self.db.child("rides").remove(self.user['idToken'])


class MTBYouScraper:

    def __init__(self, logger, db):
        self.db = db
        self.baseurl = 'http://www.mtb-you.be'
        self.url = '%s/default.asp?contentid=421' % self.baseurl
        self.logger = logger

    def scrape(self):
        self.scrapeCalendar()

    def scrapeCalendar(self):
        self.logger.info('Scraping %s' % self.url)
        accomodations = self.accomodations();
        soup = BeautifulSoup(requests.get(self.url).content, 'html.parser')
        pageRides = soup.find_all('tr', attrs={'class': ['tr1', 'tr2']})
        for ride in pageRides:
            print("----------")
            rideDetails = ride.find_all('td', attrs={'class', 'kalender_detail'})

            ride = dict()
            ride['date'] = pytz.timezone('UTC').localize(datetime.datetime.strptime(rideDetails[1].text, '%d/%m/%Y')).strftime('%s')
            ride['location'] = rideDetails[2].text
            ride['distance'] = rideDetails[3].text
            ride['time'] = rideDetails[4].text

            rideUrl = '%s%s' % (self.baseurl, rideDetails[2].find('a').get('href'))
            rideSoup = BeautifulSoup(requests.get(rideUrl).content, 'html.parser')

            rideInfoBlocks = rideSoup.find_all('table', attrs={'class', 'kalender_overzicht2'})

            ride['source'] = rideUrl
            ride['address'] = ''
            for part in rideInfoBlocks[0].find('span', attrs={'class', 'titelke'}).parent.contents:
                if not str(part.encode('utf-8')).startswith('<'):
                    ride['address'] += part + '<br/>'

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




logger = setupLogger();

db = FireBaseWriter(logger)

db.clear()
scraper = MTBYouScraper(logger, db)
scraper.scrape()
