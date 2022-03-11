/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import {auth} from '../../../utils/misc';

export default class SideDrawer extends Component {
     
    navigateToScreen = (route) => () => {
        this.props.navigation.dispatch(
            CommonActions.navigate({
                name: route,
                params: {},
            })
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Text style={styles.sectionHeading}>마이 페이지</Text>
                        <View style={styles.navSectionStyle}>
                            <Text 
                            style={styles.navItemStyle}
                            onPress={this.navigateToScreen('MemberProfile')}
                            >
                                Profile
                            </Text>

                            <Text 
                            style={styles.navItemStyle}
                            onPress={()=>{
                                auth.signOut()
                                this.props.navigation.navigate('SignIn')
                            }}
                            >
                                로그아웃
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{paddingLeft: 10, paddingBottom: 30}}>
                    <Text>Copyright @ Hyeoksu, 2021.</Text>
                </View>
            </View>
        )
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80
    },
    imageContainer: {
        alignItems: 'center',
        padding: 50
    },
    sectionHeading: {
        color: '#fff',
        backgroundColor: '#ef9de4',
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontWeight: 'bold'
    },
    navSectionStyle: {
        backgroundColor: '#04b6ff'
    },
    navItemStyle: {
        padding: 10,
        color: '#fff'
    }
});
  
  
 