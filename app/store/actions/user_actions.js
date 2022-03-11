import {
    SIGN_IN,
    SIGN_UP,
    AUTO_SIGN_IN,
    GET_PROFILE,
} from '../types';

import axios from 'axios';
import {
    SIGNUP,
    SIGNIN,
    REFRESH,
    auth
} from '../../../utils/misc';
import { database } from '../../../utils/misc';


export const autoSignIn = (refToken) => {
    const request = axios({
        method: 'POST',
        url: REFRESH,
        data: 'grant_type=refresh_token&refresh_token='+refToken,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        console.log(response.data)
        return response.data
    }).catch(err=>{
        console.warn(err)
        return false
    })
    
    return {
        type: AUTO_SIGN_IN,
        payload: request
    }
}


firebaseCreateUser = (email, password) => {
    auth.createUserWithEmailAndPassword(email, password)        //firebase 계정 직접 생성
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
}

// firebaseLogin = async (email, password) => {
//     try {
//         let user = await auth.signInWithEmailAndPassword(email, password);  //login 정보가 담김
//     } catch (err) {
        
//     }
// }

firebaseLogin = async (email, password) => {
    try {
        let user = await auth.signInWithEmailAndPassword(email, password);  //login 정보가 담김
    } catch (err) {

    }
    // auth.signInWithEmailAndPassword(email, password)
    //     .catch(function(error) {
    // // Handle Errors here.
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // if (errorCode === 'auth/wrong-password') {
    //     alert('Wrong password.');
    // // } else if (errorCode === 'auth/invalid-email') {
    // //     alert('Wrong email.');
    // } else if (errorCode === 'auth/user-disabled') {
    //     alert('User disabled.');
    // } else if (errorCode === 'auth/user-not-found') {
    //     alert('User not found.');
    // }
    // console.log(error);
    // });
}


export function signIn(data) {

    firebaseLogin(data.email, data.password);
    const request = axios({
        method: 'POST',
        url: SIGNIN,
        data: {
            email: data.email,
            password: data.password,
            returnSecureToken: true
        },
        header: {
            'Content-Type':'application/json'
        }
    }).then(response=>{
        console.log(response.data)
        return response.data
    }).catch(err=>{
        alert(err.message)
        console.warn(err.message)
        return false
    })
    
    return {
        type: SIGN_IN,
        payload: request
    }
}


// export function signUp(data) {
//     const request ={};
//     auth.createUserWithEmailAndPassword(data.email, data.password)
//     .then((userCremential)=> {
//         request = {
//             localId:userCremential.user.uid,
//             refreshToken: userCremential.user.refreshToken
//         }
//         const user = auth.currentUser;
//         user.sendEmailVerification()
//         .then(() => {
//                 alert('success')
                
//             }
//         );
//     })
//     return {
//         type: SIGN_UP,
//         payload: request
//     }
// }
export function signUp(data) {
    const request = axios({
        method: 'POST',
        url: SIGNUP,
        data: {
            email: data.email,
            password: data.password,
            returnSecureToken: true
        },
        header: {
            'Content-Type':'application/json'
        }
    }).then(response=>{
        console.log(response.data)
        return response.data
    }).catch(err=>{
        alert('signUp:'+err.message)
        return false
    })
    return {
        type: SIGN_UP,
        payload: request
    }
}

//Get
//http://주소?이름=값&이름=값...

export function getProfile(User, role) {
    return (dispatch) => {
        const url = `users/${User.auth.userId}`;
        database.ref(url).on('value', dataSnapShot => {     //on: read data, datasnapshot: on이 가리키는 위치에 있는 데이터
            const profile = {...dataSnapShot.val()};
            // if(dataSnapShot.val()[key]) {
            //     profile.push({
            //         ...dataSnapShot.val()[key]
            //     })
            // }
            dispatch({type: GET_PROFILE, payload: profile})
        })      //함수를 반환하기 위해 redux-thunk를 설치한 것임
    }
}