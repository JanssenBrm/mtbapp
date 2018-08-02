import {database} from "../config/firebase.config";

export const LOAD_DATA_START = 'LOAD_DATA_START';
export const LOAD_DATA_ERROR = 'LOAD_DATA_ERROR';
export const LOAD_DATA_DONE = 'LOAD_DATA_DONE';


export function getRideData(user){
    return (dispatch) => {

        dispatch({type: LOAD_DATA_START});

        database.ref('rides').once('value', function (snapshot) {

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