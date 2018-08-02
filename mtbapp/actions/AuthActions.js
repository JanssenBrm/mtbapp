import auth from '../config/firebase.config'

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_DONE = 'LOGIN_DONE';
export const LOGIN_ERROR = 'LOGIN_ERROR';


export function login(email, password){
    return (dispatch) => {

        dispatch({type: LOGIN_START});

        auth.signInWithEmailAndPassword(email, password)
            .then((resp) => dispatch({type: LOGIN_DONE, data: {rides: res.results}}))
            .catch((error) => dispatch({type: LOGIN_ERROR}));




    };
}