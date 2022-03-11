import { database } from "../misc";
const validation = (value, rules, form) => {
    let valid = true;
    
    for(let rule in rules) {
        switch(rule) {
            case 'isRequired':
                valid = valid && validateRequired(value)
                break;
            case 'isEmail':
                valid = valid && validateEmail(value)
                break;
            case 'minLength':
                valid = valid && validateMinLength(value, rules[rule])
                break;
            case 'confirmPassword':
                valid = valid && validateConfirmPassword(value, form[rules.confirmPassword].value)
                break;
            case 'confirmEmail':
                valid = valid && validateConfirmEmail(value, form[rules.confirmEmail].value)
                break;
            case 'isNotDuplicated':
                valid = valid && Duplicateconfirmation(value)
                break;
            default:
                valid = true;
        }
    }
    return valid;
}

const validateEmail = (value) => {
    const expression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return expression.test(String(value).toLocaleLowerCase());
}

const validateRequired = (value) => {
    if(value !== "") {
        return true;
    }
    return false;
}

const validateConfirmPassword = (confirmPassword, password) => {
    return confirmPassword === password
}

const validateConfirmEmail = (confirmEmail, email) => {
    return confirmEmail === email
}

const validateMinLength = (value, ruleValue) => {
    if(value.length >= ruleValue) {
        return true;
    }
    return false;
}

const Duplicateconfirmation = (recommendationCode) => {
    database.ref('users').on('value', dataSnapShot => {     //on: read data, datasnapshot: on이 가리키는 위치에 있는 데이터
        const profile = [];
        for (let key in dataSnapShot.val()) {   //dataSnapShot.val() = user 최상위
            if(dataSnapShot.val()[key]['recommendationCode'] === recommendationCode) {
                return false
            }
        }
        //value event: 참조하는 경로에 데이터가 있다면 트리거됨
        dispatch({type: GET_PROFILE, payload: profile})
    })
    return true
}

// database.ref(url).child('users').orderByChild('name').equalTo('Backho Kang').once('value', function(data){
//     console.log('2번 :' , data.val());
// });
// 출처: https://cionman.tistory.com/72 [Suwoni블로그]
export default validation;