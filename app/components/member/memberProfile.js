import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { database } from '../../../utils/misc';
import Input from '../../../utils/forms/input'

class MemberProfile extends Component {
    state = {
        hasErrors: false,
        form: {
            age: {
                value: this.props.Profile.userProfile.myinfo.age,
                valid: true
            },
            height: {
                value: this.props.Profile.userProfile.myinfo.height,
                valid: true
            },
            gender: {
                value: this.props.Profile.userProfile.myinfo.gender === "" ? '남' : this.props.Profile.userProfile.myinfo.gender,
                valid: true
            },
            trainingPurpose: {
                value: this.props.Profile.userProfile.myinfo.trainingPurpose === "" ? 'fastDiet' : this.props.Profile.userProfile.myinfo.trainingPurpose,
                valid: true
            },
            activityLevel: {
                value: this.props.Profile.userProfile.myinfo.activityLevel === "" ? 'lv1' : this.props.Profile.userProfile.myinfo.activityLevel,
                valid: true
            }

        }
    }

    formHasErrors = (name) => {
        const formCopy = this.state.form;
        if(formCopy[name].valid === false) {
          let notice;
          if(name === 'name') {
            notice = '인증 가능한 이메일을 입력 해주세요.';
          } else if(name === 'age') {
            notice = '영문/숫자/특수문자를 포함한 10-32자 조합';
          } else if(name === 'height') {
            notice = '추천인코드가 존재하지 않습니다.';
          } else if(name === 'gender') {
            notice = '추천인코드가 존재하지 않습니다.';
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
        this.setState({
            hasErrors: false
        })
    
        let formCopy = this.state.form;
        formCopy[name].value = value;
        
        
        this.setState({
            form: formCopy,
        })
    }

    submitUser = () => {
        let isformValid = true;
        let submittedForm = {};
        const formCopy = this.state.form;

        if(isformValid) {
            try {
                database.ref(`users/${this.props.User.auth.userId}/myinfo`).set({
                  age: formCopy.age.value,
                  height: formCopy.height.value,
                  gender: formCopy.gender.value,
                  trainingPurpose: formCopy.trainingPurpose.value,
                  activityLevel: formCopy.activityLevel.value,
                })
                alert('저장되었습니다.')
            } catch (err) {
                alert('저장실패:'+err.message);
            }
            
        } else {
            this.setState({
            hasErrors: true
            })
        }   
    }

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <View style={{justifyContent: 'center', marginRight: 10, width: 50}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#B3B3B3'}}>나이</Text>
                    </View>
                    <Input
                    value={this.state.form.age.value}
                    type='textinput'
                    autoCapitalize={'none'}
                    placeholder='나이'
                    placeholderTextColor='#ddd'
                    onChangeText={value=>this.updateInput('age', value)}
                    />
                </View>
                {this.formHasErrors('age')}
                <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center', marginRight: 10, width: 50}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#B3B3B3'}}>신장</Text>
                    </View>
                    <Input
                    value={this.state.form.height.value}
                    type='textinput'
                    autoCapitalize={'none'}
                    placeholder='신장'
                    placeholderTextColor='#ddd'
                    onChangeText={value=>this.updateInput('height', value)}
                    />
                </View>
                {this.formHasErrors('height')}
                <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center', marginRight: 10, width: 50}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#B3B3B3'}}>성별</Text>
                    </View>
                    <View style={{borderRadius: 10, borderWidth: 0, overflow: "hidden", height: 50, width: 300, padding: 0, backgroundColor: "#FFF"}}>
                        <Picker
                        style={{color: '#B3B3B3'}}
                        mode='dropdown'
                        selectedValue={this.state.form.gender.value}
                        onValueChange={value=>this.updateInput('gender', value)}
                        >
                            <Picker.Item label="남" value="male" />
                            <Picker.Item label="여" value="female" />
                        </Picker>
                    </View>
                </View>
                {this.formHasErrors('gender')}
                <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center', marginRight: 10, width: 50}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#B3B3B3'}}>운동목적</Text>
                    </View>
                    <View style={{borderRadius: 10, borderWidth: 0, overflow: "hidden", height: 50, width: 300, padding: 0, backgroundColor: "#FFF"}}>
                        <Picker
                        style={{color: '#B3B3B3'}}
                        mode='dropdown'
                        selectedValue={this.state.form.trainingPurpose.value}
                        onValueChange={value=>this.updateInput('trainingPurpose', value)}
                        >
                            <Picker.Item label="빠른다이어트" value="fastDiet" />
                            <Picker.Item label="다이어트" value="diet" />
                            <Picker.Item label="유지어트" value="maintenance" />
                            <Picker.Item label="린매스업" value="leanMassUp" />
                            <Picker.Item label="벌크업" value="bulkUp" />
                        </Picker>
                    </View>  
                </View>              
                {this.formHasErrors('age')}
                <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center', marginRight: 10, width: 50}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#B3B3B3'}}>활동레벨</Text>
                    </View>
                    <View style={{borderRadius: 10, borderWidth: 0, overflow: "hidden", height: 50, width: 300, padding: 0, backgroundColor: "#FFF"}}>
                        <Picker
                        style={{color: '#B3B3B3'}}
                        mode='dropdown'
                        selectedValue={this.state.form.activityLevel.value}
                        onValueChange={value=>this.updateInput('activityLevel', value)}
                        >
                            <Picker.Item label="Lv.1 전혀 운동을 하지 않는다" value="lv1" />
                            <Picker.Item label="Lv.2 주 1-3회 운동" value="lv2" />
                            <Picker.Item label="Lv.3 주 3-5회 운동" value="lv3" />
                            <Picker.Item label="Lv.4 주 5-7회 운동" value="lv4" />
                            <Picker.Item label="Lv.5 하루 2회 이상" value="lv5" />
                        </Picker>
                    </View>   
                    </View>
                {this.formHasErrors('age')}
                <TouchableOpacity 
                style={styles.purpleButton}
                onPress={this.submitUser}
                >
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>저장</Text>
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
      User: state.User,
      Profile: state.Profile
    }
}
  
// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({getProfile}, dispatch);
//   }

export default connect(mapStateToProps)(MemberProfile);