import {database} from "../config/firebase.config";
import {MAPBOX_KEY, MAPBOX_URL} from "../config/mapbox.config";
import Moment from "moment";

export const LOAD_DATA_START = 'LOAD_DATA_START';
export const LOAD_DATA_ERROR = 'LOAD_DATA_ERROR';
export const LOAD_DATA_DONE = 'LOAD_DATA_DONE';


export function getRideData(user){
    return (dispatch) => {

        dispatch({type: LOAD_DATA_START});


        database.ref('rides').orderByChild('date').once('value', function (snapshot) {

            rides = [];
            Object.keys(snapshot.val()).forEach(key => {
                rides.push({...snapshot.val()[key], id: key});
            })
            dispatch({type: LOAD_DATA_DONE, data: {rides: rides}});
        });

        /*const url = `https://randomuser.me/api/?seed=1&page=1&results=20`;
        fetch(url)
            .then(res => res.json())
            .then(res => {
                dispatch({type: LOAD_DATA_DONE, data: {rides: res.results}});
            })
            .catch(error => {
                dispatch({type: LOAD_DATA_ERROR});
            });

        */


    };
}

export function getRideLocationData(location){


    return fetch(`${MAPBOX_URL}/geocoding/v5/mapbox.places/${location.replace(' ', '-')}.json?autocomplete=true&language=NL&types=place&country=BE,NL&limit=1&access_token=${MAPBOX_KEY}`)
        .then(res => res.json())
        .then(res => {
            console.log("RES", res);
            return res.features && res.features.length > 0 ? {bbox: res.features[0].bbox, center: res.features[0].center} : null;
        })

}