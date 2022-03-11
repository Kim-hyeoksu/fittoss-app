import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import ValidationRules from '../../../utils/forms/validationRules';
import Input from '../../../utils/forms/input';

//react native component를 redux 흐름에 태우기 위해 connect가 필요함
import { connect } from 'react-redux';
import { signIn, signUp, getProfile } from '../../store/actions/user_actions';
//action creator를 묶어주기 위한 함수
import { bindActionCreators } from 'redux';
import { setTokens, database } from '../../../utils/misc';

class Authform extends Component {

  state = {
      type: '로그인',  // 로그인/등록
      action: '로그인',  //로그인/등록
      actionMode: '회원가입', //회원가입/로그인
      hasErrors: false,
      form: {
        email: {
          value: '',
          type: 'textinput',
          rules: {
              isRequired: true,
              isEmail: true
          },
          valid: true
        },
        password: {
          value: '',
          type: 'textinput',
          rules: {
              isRequired: true,
              minLength: 10
          },
          valid: true
        },
        confirmPassword: {
          value: '',
          type: 'textinput',
          rules: {
              confirmPassword: 'password'
          },
          valid: true
        },
        confirmEmail: {
          value: '',
          type: 'textinput',
          rules: {
            confirmEmail: 'email'
          },
          valid: true
        }
      }
  }

  
  formHasErrors = (name) => {
    const formCopy = this.state.form;
    if(name === 'signIn') {
      if(this.state.hasErrors) {
        return(
          <View style={styles.emptySpace}>
            <Text style={styles.registerRule}>이메일 또는 비밀번호가 맞지 않습니다!</Text>
          </View>
        )
      } else {
        return (
          <View style={styles.emptySpace}></View>
          )
      }
      
    }
    if(formCopy[name].valid === false) {
      let notice;
      if(name === 'email') {
        notice = '인증 가능한 이메일을 입력 해주세요.';
      } else if(name === 'password') {
        notice = '영문/숫자/특수문자를 포함한 10-32자 조합';
      } else if(name === 'confirmPassword') {
        notice = '비밀번호가 일치하지 않습니다.';
      } else if(name === 'confirmEmail') {
        notice = '이메일이 일치하지 않습니다.';
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
  
  changeForm = () => {
  const type = this.state.type;

  this.setState({
      type: type === '로그인' ? '회원가입' : '로그인',
      action: type === '로그인' ? '회원가입' : '로그인',
      actionMode: type === '로그인' ? '로그인 화면으로' : '회원가입',
  })
  }
  
  submitUser = () => {
    //Init
    let isformValid = true;
    let submittedForm = {};
    const formCopy = this.state.form;

    //key: email, password, confirmEmail, confirmPassword
    for(let key in formCopy) {
      if(this.state.type === '로그인') {
        if(key !== 'confirmPassword' && key !== 'confirmEmail') {
          isformValid = isformValid && formCopy[key].valid;
          submittedForm[key] = formCopy[key].value;
        }
      } else {
          isformValid = isformValid && formCopy[key].valid;
          submittedForm[key] = formCopy[key].value;
      }
    }

    if(isformValid) {
      const type = this.state.type;
      if(type === '로그인') {
        //action creator 함수 호출
        this.props.signIn(submittedForm)
        .then(()=>{
          this.props.getProfile(this.props.User)
          this.manageAccess('로그인');
        })
      } else {
        this.props.signUp(submittedForm)
        .then(()=>{
          this.manageAccess('회원가입');
          
        })
      }
    } else {
      this.setState({
        hasErrors: true
      })
    }
  }

  updateInput = (name, value) => {
  //로그인하는 순간에 error가 있으면 안되니까 한번 더 설정해줌
    this.setState({
        hasErrors: false
    })

    let formCopy = this.state.form;
    formCopy[name].value = value;

    //rules
    let rules = formCopy[name].rules;
    let valid = ValidationRules(value, rules, formCopy);
    formCopy[name].valid = valid;
    if(value === '') {
      valid = true;
      formCopy[name].valid = valid;
    }
    this.setState({
        form: formCopy
    })
  }

  // manageAccess = (type) => {
  //   if(!this.props.User.auth.userId) {
  //     this.setState({hasErrors: true})
  //   } else {
  //     setTokens(this.props.User.auth, ()=> {
  //       this.setState({hasErrors: false});
  //       if(type === '로그인') {
  //         this.props.goWithoutLogin();
  //       } else {
  //         this.props.goEmailRequest();
  //       }
  //     })
  //   }
  // }
  manageAccess = (type) => {
    if(!this.props.User.auth.userId) {
      this.setState({hasErrors: true})
    } else {
      if(type === '로그인') {
        database.ref(`users/${this.props.User.auth.userId}`).on('value', dataSnapShot => {
          if(dataSnapShot.val()['username'] === "") {
            this.props.goProfileRegister();
          } else {
            if(dataSnapShot.val()['role'] === "trainer") {
              this.props.goTrainer();
            } else {
              this.props.goMember();
            }
            
          }
        })
       
      } else {    //type === '회원가입'
        this.writeUserData()
        this.props.goEmailRequestSuccess();
        this.changeForm();
        
      }
    }
  }

  writeUserData = () => {
    try {
      database.ref(`users/${this.props.User.auth.userId}`).set({
        username: '',
        gym: '',
        recommendationCode: ''
      })
    } catch (err) {
      alert('저장실패:'+err.message);
    }
  }

  render() {
      return (
          <View>
              <Input
              value={this.state.form.email.value}
              type={this.state.form.email.type}
              autoCapitalize={'none'}
              placeholder='이메일'
              placeholderTextColor='#ddd'
              onChangeText={value=>this.updateInput('email', value)}
              />
              
              {this.formHasErrors('email')}

              {this.state.type === '로그인' ?
                <View>
                  <Input
                  value={this.state.form.password.value}
                  type={this.state.form.password.type}
                  //별표시
                  secureTextEntry={true}
                  placeholder='비밀번호'
                  placeholderTextColor='#ddd'
                  onChangeText={value=>this.updateInput('password', value)}
                  />
                  {this.formHasErrors('password')}

                  {/* 로그인 버튼 */}
                  <TouchableOpacity
                  style={styles.purpleButton}
                  onPress={this.submitUser}
                  >
                    <Text style={styles.buttonText}>{this.state.action}</Text>
                  </TouchableOpacity>

                  <View 
                  style={{
                    flexDirection: 'row-reverse',
                    marginTop: 10,
                    marginBottom: 30
                    }}>
                    <Text style={{color: '#B3B3B3', fontSize: 12}}>아이디/비밀번호 찾기</Text>
                    {this.formHasErrors('signIn')}
                  </View>
                  
                  <View style={styles.emptySpace}></View>

                  {/* 회원가입 이동 버튼 */}
                  <TouchableOpacity
                  style={styles.lightPurpleButton}
                  onPress={this.changeForm}
                  >
                    <Text style={[styles.buttonText, {color: '#9580FF'}]}>{this.state.actionMode}</Text>
                  </TouchableOpacity>
                </View>
              :
                <View>
                  <Input
                  value={this.state.form.confirmEmail.value}
                  type={this.state.form.confirmEmail.type}
                  placeholder='이메일 확인'
                  placeholderTextColor='#ddd'
                  onChangeText={value=>this.updateInput('confirmEmail', value)}
                  />
                  {this.formHasErrors('confirmEmail')}

                  <Input
                  value={this.state.form.password.value}
                  type={this.state.form.password.type}
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  placeholder='비밀번호'
                  placeholderTextColor='#ddd'
                  onChangeText={value=>this.updateInput('password', value)}
                  />
                  
                  {this.formHasErrors('password')}


                  <Input
                  value={this.state.form.confirmPassword.value}
                  type={this.state.form.confirmPassword.type}
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  placeholder='비밀번호 확인'
                  placeholderTextColor='#ddd'
                  onChangeText={value=>this.updateInput('confirmPassword', value)}
                  />

                  {this.formHasErrors('confirmPassword')}

                  <TouchableOpacity
                  style={[styles.purpleButton, {marginTop: 20}]}
                  onPress={
                    this.submitUser
                  }
                  >
                    <Text style={styles.buttonText}>{this.state.action}</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
      )
  }
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 50,
    fontSize: 17,
    padding: 5,
    marginTop: 30
  },
  errorContainer: {
    marginBottom: 10,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ee3344'
  },
  errorLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  purpleButton: {
      backgroundColor: '#BFB3FF',
      width: 300,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    // ...Platform.select({
    //   ios: {
    //     marginTop: 15
    //   },
    //   android: {
    //     marginTop: 15,
    //     marginBottom: 10
    //   }
    // })
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  lightPurpleButton: {
    backgroundColor: '#F0EDFF',
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
  }
});

function mapStateToProps(state) {
  return {
    //react native 세계관에서 props가 가질 User를 만든 것
    //redux 세계관에서 store가 갖고 있는 User
    User: state.User
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({signIn, signUp, getProfile}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Authform);