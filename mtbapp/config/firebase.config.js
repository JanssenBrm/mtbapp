import * as firebase from 'firebase';

const FIREBASE_API_KEY = "AIzaSyBFCCIDh2U6K6hHoP4fHlz-pUbSH_85xRo";
const FIREBASE_AUTH_DOMAIN = "mtbapp-4204e.firebaseapp.com";
const FIREBASE_DATABASE_URL = "https://mtbapp-4204e.firebaseio.com";
const FIREBASE_PROJECT_ID = "mtbapp-4204e";
const FIREBASE_STORAGE_BUCKET = "mtbapp-4204e.appspot.com";
const FIREBASE_MESSAGING_SENDER_ID = "960118561650";


const config = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

export const database = firebase.database();
export const auth = firebase.auth();
export const provider = new firebase.auth.FacebookAuthProvider();
export const storage = firebase.storage();