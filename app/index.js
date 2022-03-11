/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
 import 'react-native-gesture-handler';

 import React, { Component } from 'react'
 import { StyleSheet } from 'react-native';
 import { NavigationContainer } from '@react-navigation/native';
 import { RootNavigator } from './routes';

 export default class App extends Component {
   render() {
     return (
       //NavigationContainer: 앱 상태 관리 및 최상위 네비게이터를 앱 환경에 연결
       <NavigationContainer>    
         <RootNavigator/>
       </NavigationContainer>
     )
   }
 }
 
 const styles = StyleSheet.create({
 });
 
 