export const APIKEY = `AIzaSyBB7VoyitSUe9k_Z3QndYmG2Tt2xBK2nT4`;
export const SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
export const SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`;
export const REFRESH = `https://securetoken.googleapis.com/v1/token?key=${APIKEY}`;
export const VERIFYEMAIL = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${APIKEY}`;
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBB7VoyitSUe9k_Z3QndYmG2Tt2xBK2nT4",
  authDomain: "fittoss.firebaseapp.com",
  databaseURL: "https://fittoss-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fittoss",
  storageBucket: "fittoss.appspot.com",
  messagingSenderId: "913194897248",
  appId: "1:913194897248:web:8ce61056b6d521f92b5805",
  measurementId: "G-ZWS4XDV3E3"
};
  
  firebase.initializeApp(firebaseConfig);
  
  export const storage = firebase.storage();
  export const database = firebase.database();
  export const auth = firebase.auth();
  
  export const setTokens = async (values, callBack) => {
      const firstPair = ["@Fittoss@userId", values.userId]
      const secondPair = ["@Fittoss@token", values.token]
      const thirdPair = ["@Fittoss@refToken", values.refToken]
      try {
        await AsyncStorage.multiSet([firstPair, secondPair, thirdPair])
        .then(response=>{callBack()})
      } catch(e) {
        //save error
      }
    }
    
  
  export const getTokens = async (callBack) => {
  
    let values
    try {
      values = await AsyncStorage.multiGet([
        "@Fittoss@userId", 
        "@Fittoss@token", 
        "@Fittoss@refToken"
      ]).then(values=>{
        callBack(values)
      })
    } catch(e) {
      // read error
    }
  
    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  }
  
  export const removeTokens = async (callBack) => {
    try {
      await AsyncStorage.multiRemove([
        "@Fittoss@userId", 
        "@Fittoss@token", 
        "@Fittoss@refToken"
      ]).then(()=>{
        callBack()
      })
    } catch (e) {
  
    }
  }