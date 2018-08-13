import {database} from "../config/firebase.config";
import {MAPBOX_KEY, MAPBOX_URL} from "../config/mapbox.config";
import Moment from "moment";
import { Constants, Location, Permissions } from 'expo';

export const LOAD_DATA_START = 'LOAD_DATA_START';
export const LOAD_DATA_ERROR = 'LOAD_DATA_ERROR';
export const LOAD_DATA_DONE = 'LOAD_DATA_DONE';
export const TOGGLE_SEARCH = 'TOGGLE_SEARCH';
export const SET_FILTER = 'SET_FILTER';


 export function getRideData(refresh) {
     let promises = [];
    return (dispatch) => {

        const disp = dispatch;
        dispatch({type: LOAD_DATA_START, data: {refresh: refresh}});

        database.ref('rides').orderByChild('date').startAt(Math.floor((Date.now() - (24 * 60 * 60 * 1000)) / 1000)).once('value', function (snapshot) {

            if(snapshot.val()) {

                getLocationAsync().then(location => {
                    Object.keys(snapshot.val()).forEach(key => {
                        rideInfo = snapshot.val()[key];

                        if(rideInfo.geolocation.center){
                            rideInfo.traveldistance = getTravelDistance(location, rideInfo.geolocation);
                            promises.push(getWeatherConditions(rideInfo));

                        }
                    });

                    Promise.all(promises).then(data => {
                        dispatch({type: LOAD_DATA_DONE, data: {rides: data, refresh: refresh}})
                    });

                });


            }
        });


    };
}



export function toggleSearch(search){
     return (dispatch) => {
         dispatch({type: TOGGLE_SEARCH, data: {search: search}})
     };
}

export function filterRides(filter){
    return (dispatch) => {
        dispatch({type: SET_FILTER, data: {filter: filter}})
    };
}

 getWeatherConditions = (ride) => {
     console.log(ride);
     const url = `https://api.darksky.net/forecast/fde78bde567300516c4e3cff1f929094/${ride.geolocation.center[1]},${ride.geolocation.center[0]},${ride.date}?exclude=currently,hourly,flags`;
     return fetch(url)
         .then(data => data.json())
         .then(data => {
             ride.weatherConditions = data.daily && data.daily.data && data.daily.data.length > 0 ? data.daily.data[0] : null;
             return ride;
         });
};

getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        this.setState({
            errorMessage: 'Permission to access location was denied',
        });
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
};


getTravelDistance = (userLocation, rideLocation) => {

    if(rideLocation.center){

        const radlat1 = Math.PI * userLocation.coords.latitude/180;
        const radlat2 = Math.PI * rideLocation.center[1]/180;
        const radlon1 = Math.PI * userLocation.coords.longitude/180;
        const radlon2 = Math.PI * rideLocation.center[0]/180;
        const theta = userLocation.coords.longitude-rideLocation.center[0];
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return Math.floor(dist);

    } else {
        return null;
    }


};