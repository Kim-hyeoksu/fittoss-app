import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import Header from './header';
import Authform from './authform';
import EmailRequest from './emailRequest'
import EmailRequestSuccess from './emailRequestSuccess';
import { getTokens, setTokens } from '../../../utils/misc';
import { autoSignIn } from '../../store/actions/user_actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


export default class SignIn extends Component {

    goTrainer = () => {
        this.props.navigation.navigate('DrawerComponent')
    }
    goMember = () => {
        this.props.navigation.push('DrawerComponent_')
    }
    goEmailRequestSuccess = () => {
        this.props.navigation.navigate('EmailRequestSuccess')
    }
    goProfileRegister = () => {
        this.props.navigation.navigate('ProfileRegister')
    }
    
    // componentDidMount() {
    //     /*
    //     value....
    //     ["@hsdiary_app@userId", values.userId]
    //     ["@hsdiary_app@token", values.token]
    //     ["@hsdiary_app@refToken", values.refToken]
    //     */

    //     getTokens((value)=>{
    //         if(value[1][1] !== null) {
    //             this.props.autoSignIn(value[2][1]).then(()=>{
    //                 if(this.props.User.auth.token) {
    //                     setTokens(this.props.User.auth, () => {
    //                         this.goWithoutLogin();
    //                     })
    //                 }
    //             })
    //         }
    //     });

    //     //어떠한 방법을 쓰더라도 이전 화면으로의 이동을 모두 차단시킴
    //     //beforeRemove: 유저가 화면을 떠나지 못하게 하는 이벤트 타입
    //     this.props.navigation.addListener('beforeRemove', (e)=>{
    //         e.preventDefault();     //event로 정의된 기본 액션을 취하라=전 화면으로의 이동을 막아준다
    //     })
    // }

    

    render() {
        return (
            <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor:'#f2f2f2'}}>
              <Header/>
              <Authform
              goTrainer={this.goTrainer}
              goMember={this.goMember}
              goEmailRequestSuccess={this.goEmailRequestSuccess}
              goProfileRegister={this.goProfileRegister}
              />
              
            </View>
         )
  
    }
}