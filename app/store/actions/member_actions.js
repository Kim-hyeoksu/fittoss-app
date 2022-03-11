import {
    GET_MEMBERS,
    GET_MYLOG
} from '../types';

import { database } from '../../../utils/misc';

export function getMembers(User) {
    return (dispatch) => {
        const url = `users/${User.auth.userId}/members`;
        database.ref(url).on('value', dataSnapShot => {     //on: read data, datasnapshot: on이 가리키는 위치에 있는 데이터
            // const members = {...dataSnapShot.val()};
            const members = [];
            for (let key in dataSnapShot.val()) {
                if(dataSnapShot.val()[key]) {
                    members.push({
                        ...dataSnapShot.val()[key]
                    })
                }
            }
            dispatch({type: GET_MEMBERS, payload: members})
        })      //함수를 반환하기 위해 redux-thunk를 설치한 것임
    }
}

export function getMyLog(User) {
    return (dispatch) => {
        const url = `users/${User.auth.userId}/mylog`;
        database.ref(url).on('value', dataSnapShot => {     //on: read data, datasnapshot: on이 가리키는 위치에 있는 데이터
            const mylog = [];
            for (let key in dataSnapShot.val()) {
                if(dataSnapShot.val()[key]) {
                    mylog.unshift({
                        ...dataSnapShot.val()[key]
                    })
                }
            }
            dispatch({type: GET_MYLOG, payload: mylog})
        })
    }
}