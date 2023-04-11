import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence,
} from "firebase/auth/react-native";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbMNvlrOrwI_Dj57K0RMcSxptDt0mp92E",
    authDomain: "react-native-hw-dadc6.firebaseapp.com",
    projectId: "react-native-hw-dadc6",
    storageBucket: "react-native-hw-dadc6.appspot.com",
    messagingSenderId: "379592385436",
    appId: "1:379592385436:web:05e3cb566d520e5c99de59",
    measurementId: "G-4LEFNR7PMD",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);

export const storage = getStorage(app);
