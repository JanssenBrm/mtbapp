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

    };
}

export function getRideLocationData(location){


    const url = `${MAPBOX_URL}/geocoding/v5/mapbox.places/${location.street},${location.city}.json?autocomplete=true&language=NL&types=poi,address,place&country=BE,NL&limit=1&access_token=${MAPBOX_KEY}`;
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            return res.features && res.features.length > 0 ? {bbox: res.features[0].bbox, center: res.features[0].center} : null;
        })

}