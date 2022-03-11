import { database } from "../misc";
export const validation = (value) => {
    let valid = true;
    valid = valid && validateItem(value)
    return valid;
}

const validateItem = (value) => {
    if(value === '') {
        return false
    }
    return true
}

export const Duplicateconfirmation = (code) => {
    let result = {
        result: true,
        personalTrainer: '',
        trainerGym: ''
    };
    const recommendationCode = parseInt(code, 10)
    database.ref('users').on('value', dataSnapShot => {     //on: read data, datasnapshot: on이 가리키는 위치에 있는 데이터

        for (let key in dataSnapShot.val()) {   //dataSnapShot.val() = user 최상위
            if(dataSnapShot.val()[key]['recommendationCode'] === recommendationCode) {
                result['result'] = false
                result['personalTrainer'] = dataSnapShot.val()[key]['username']
                result['trainerGym'] = dataSnapShot.val()[key]['gym']
            }
        }
    })
    return result
}

