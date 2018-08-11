import {database} from "../config/firebase.config";
import {MAPBOX_KEY, MAPBOX_URL} from "../config/mapbox.config";
import Moment from "moment";
import { Constants, Location, Permissions } from 'expo';

export const LOAD_DATA_START = 'LOAD_DATA_START';
export const LOAD_DATA_ERROR = 'LOAD_DATA_ERROR';
export const LOAD_DATA_DONE = 'LOAD_DATA_DONE';


export function getRideData(refresh){
    return (dispatch) => {

        dispatch({type: LOAD_DATA_START, data: {refresh: refresh}});

        database.ref('rides').orderByChild('date').startAt(Math.floor((Date.now() - (24 * 60 * 60 * 1000)) / 1000)).once('value', function (snapshot) {

            rides = [];
            if(snapshot.val()) {

                getLocationAsync().then(location => {
                    console.log(location);
                    Object.keys(snapshot.val()).forEach(key => {
                        rideInfo = snapshot.val()[key];
                        rideInfo.traveldistance = rideInfo.geolocation.center ? getTravelDistance(location, rideInfo.geolocation) : null;
                        rides.push({...rideInfo, id: key});
                    });
                    dispatch({type: LOAD_DATA_DONE, data: {rides: rides, refresh: refresh}});
                });


            }
        });


    };
}

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