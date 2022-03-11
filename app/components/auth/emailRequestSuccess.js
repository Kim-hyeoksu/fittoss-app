import React, { Component } from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native'
import Header from './header';


export default class EmailRequestSuccess extends Component {
    render() {
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Header/>
                <Text style={[styles.fontColor, {fontSize: 20, marginBottom: 30}]}>이메일 인증 완료</Text>
                <Text style={[styles.fontColor, {fontSize: 16}]}>가입해주셔서 감사합니다!</Text>
                <Text style={[styles.fontColor, {fontSize: 16}]}>이제 가입된 계정을 이용하여</Text>
                <Text style={[styles.fontColor, {fontSize: 16, marginBottom: 40}]}>로그인 해보세요.</Text>

                <TouchableOpacity 
                style={styles.purpleButton}
                onPress={()=>this.props.navigation.navigate('SignIn')}
                >
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>로그인 &gt;</Text>
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
    }
})