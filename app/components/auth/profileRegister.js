import React, { Component } from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native'
import Header from './header';
import Input from '../../../utils/forms/input';
import {auth, database} from '../../../utils/misc';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getProfile} from '../../store/actions/user_actions';
import {Duplicateconfirmation, validation} from '../../../utils/forms/duplicationConfirmation';


class ProfileRegister extends Component {

    state = {
        hasErrors: false,
        form: {
            name: {
                value: '',
                valid: undefined
            },
            gym: {
                value: '',
                valid: undefined
            },
            recommendationCode: {
                value: '',
                valid: undefined
            },
            role: {
                value: '',
                valid: undefined
            }
        },
        roleBoxStyle: {             // nonClicked/onClicked    
            member: '#FFEDF9',      // #FFEDF9/#FF80B9
            trainer: '#EDF3FF'      // #EDF3FF/#9580FF

        }
    }

    formHasErrors = (name) => {
        const formCopy = this.state.form;
        if(formCopy[name].valid === false) {
          let notice;
          if(name === 'name') {
            notice = '인증 가능한 이메일을 입력 해주세요.';
          } else if(name === 'gym') {
            notice = '영문/숫자/특수문자를 포함한 10-32자 조합';
          } else if(name === 'recommendationCode') {
            notice = '트레이너의 코드를 입력해주세요.(회원만)';
          }
          return (
            <View style={styles.emptySpace}>
              <Text style={styles.registerRule}>{notice}</Text>
            </View>
          )
        } else {
          return (
            <View style={styles.emptySpace}></View>
          )
        }
    }

    updateInput = (name, value) => {
        //로그인하는 순간에 error가 있으면 안되니까 한번 더 설정해줌
        this.setState({
            hasErrors: false
        })
    
        let formCopy = this.state.form;
        formCopy[name].value = value;
        
        let valid = validation(value);
        formCopy[name].valid = valid;   //빈칸이 아니면 모두 true
        
        this.setState({
            form: formCopy
        })
    }

    checkedRole = () => {
        let styleCopy = this.state.roleBoxStyle
        let formCopy = this.state.form
        if(formCopy.role.value === 'member') {
            styleCopy.member = '#FF80B9'
            styleCopy.trainer = '#EDF3FF'
        } else {
            styleCopy.trainer = '#9580FF'
            styleCopy.member = '#FFEDF9'
        }
        // if(role === 'member') {
        //     if(styleCopy.trainer === '#9580FF') {
        //         styleCopy.trainer === '#EDF3FF'
        //     }
        //     styleCopy[role] = '#FF80B9'
        // }  //'#FFEDF9' : '#FF80B9'
        // if(role === 'trainer') {
        //     if(styleCopy.member === '#FF80B9') {
        //         styleCopy.member === '#FFEDF9'
        //     }
        //     styleCopy[role] = '#9580FF'
        // }    //'#EDF3FF' : '#9580FF'
        this.setState({
            roleBoxStyle: styleCopy
        })
    }

    writeUserData = () => {
        this.submitUser();
        this.props.navigation.push('Trainer')
    }

    submitUser = () => {
        let isformValid = false;
        let submittedForm = {};
        const formCopy = this.state.form;
        let trainerInfo = {};

        if(formCopy.role.value === 'member') {
            trainerInfo = (Duplicateconfirmation(formCopy.recommendationCode.value))
            if(trainerInfo.result) {
                formCopy.recommendationCode.valid = false
                this.setState({
                    form: formCopy
                })
                alert('코드를 다시 확인해주세요.')
            } else {
                formCopy.recommendationCode.valid = true
                this.setState({
                    form: formCopy
                })
                alert('코드가 확인되었습니다.')
            }
        } else if(formCopy.role.value === 'trainer') {
            formCopy.recommendationCode.valid = true
            this.setState({
                form: formCopy
            })
        }
        isformValid = formCopy.name.valid && formCopy.gym.valid && formCopy.recommendationCode.valid && formCopy.role.valid

        if(isformValid) {
            try {
                let formCopy = this.state.form;
                if(formCopy.role.value === 'trainer') {
                    database.ref(`users/${this.props.User.auth.userId}`).set({
                        username: formCopy.name.value,
                        gym: formCopy.gym.value,
                        recommendationCode: Math.floor(Math.random() * 100000000),   //추천인코드 8자 난수 생성
                        role: formCopy.role.value,
                        myinfo: {
                          age: '',
                          height: '',
                          gender: '',
                          trainingPurpose: '',
                          activityLevel: '',
                        },
                        mylog: {}
                    })
                    .then(()=>{
                        this.props.getProfile(this.props.User);
                        this.props.navigation.push('DrawerComponent')
                    }) 
                } else if(formCopy.role.value === 'member'){
                    database.ref(`users/${this.props.User.auth.userId}`).set({
                        username: formCopy.name.value,
                        personalTrainer: {
                            trainerName: trainerInfo.personalTrainer,
                            gym: trainerInfo.trainerGym 
                        },
                        gym: formCopy.gym.value,
                        role: formCopy.role.value,
                        myinfo: {
                          age: '',
                          height: '',
                          gender: '',
                          trainingPurpose: '',
                          activityLevel: '',
                        },
                        mylog: {
                            sbd: {}
                        }
                    })
                    .then(()=>{
                        this.props.getProfile(this.props.User);
                        this.props.navigation.push('DrawerComponent_')
                    }) 
                }                
            } catch (err) {
                alert('저장실패:'+err.message);
            }
            
        } else {
            alert('입력을 해주세요.')
            this.setState({
            hasErrors: true
            })
        }   
    }



    



    render() {
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Header/>
                <Text style={[styles.fontColor, {fontSize: 20, marginBottom: 20}]}>첫로그인을 축하해요!</Text>
                <Text style={[styles.fontColor, {fontSize: 16, marginBottom: 20}]}>당신에 대해 알려주세요!</Text>

                <Input
                value={this.state.form.name.value}
                type='textinput'
                autoCapitalize={'none'}
                placeholder='이름'
                placeholderTextColor='#ddd'
                onChangeText={value=>this.updateInput('name', value)}
                />
                {this.formHasErrors('name')}
                <Input
                value={this.state.form.gym.value}
                type='textinput'
                autoCapitalize={'none'}
                placeholder='소속'
                placeholderTextColor='#ddd'
                onChangeText={value=>this.updateInput('gym', value)}
                />
                {this.formHasErrors('gym')}
                <Input
                value={this.state.form.recommendationCode.value}
                type='textinput'
                autoCapitalize={'none'}
                placeholder='추천인코드'
                placeholderTextColor='#ddd'
                onChangeText={value=>this.updateInput('recommendationCode', value)}
                />
                {this.formHasErrors('recommendationCode')}
                <View style={{flexDirection: 'row', width: 300, borderRadius: 10, marginBottom: 20}}>
                    <TouchableOpacity 
                    style={[styles.role, {backgroundColor: this.state.roleBoxStyle.member, marginRight: 10}]}
                    onPress={()=>{
                        this.updateInput('role', 'member')
                        this.checkedRole();
                    }
                    }
                    >
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>회원님</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={[styles.role, {backgroundColor: this.state.roleBoxStyle.trainer}]}
                    onPress={()=>{
                        this.updateInput('role', 'trainer')
                        this.checkedRole();
                    }
                    }
                    >
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>선생님</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                style={styles.purpleButton}
                onPress={this.submitUser}
                >
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>입력 완료</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    fontColor: {
        color: '#9580FF'
    },
    purpleButton: {
        backgroundColor: '#BFB3FF',
        width: 300,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    registerRule: {
        color: '#9580FF',
        fontSize: 12,
        fontWeight: 'bold'
    },
    emptySpace: {
        height: 30,
        paddingTop: 2
    },
    role: {
        width: 145,
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 50,
        borderRadius: 10
}
})

function mapStateToProps(state) {
    return {
      //react native 세계관에서 props가 가질 User를 만든 것
      //redux 세계관에서 store가 갖고 있는 User
      User: state.User
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({getProfile}, dispatch);
  }

export default connect(mapStateToProps, mapDispatchToProps)(ProfileRegister);