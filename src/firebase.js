import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/analytics";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCK_ZC0dGDKLlQutY1wTeuFlKin7tvsunc",
    authDomain: "devchat-2134a.firebaseapp.com",
    databaseURL: "https://devchat-2134a.firebaseio.com",
    projectId: "devchat-2134a",
    storageBucket: "devchat-2134a.appspot.com",
    messagingSenderId: "1089740297452",
    appId: "1:1089740297452:web:2f913f8bca46ffe21941c9",
    measurementId: "G-NR3D9V3VXQ",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
