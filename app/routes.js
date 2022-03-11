import React from 'react';
import {Text, View, TouchableOpacity } from 'react-native'

import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { 
    createDrawerNavigator,
    DrawerContentScrollView, 
    DrawerItemList,
    DrawerItem
   } from '@react-navigation/drawer';
  
import 'react-native-gesture-handler';

//Screens

import Loading from './components/auth/loading';
import SignIn from './components/auth';
import EmailRequest from './components/auth/emailRequest';
import EmailRequestSuccess from './components/auth/emailRequestSuccess';
import ProfileRegister from './components/auth/profileRegister';

import Trainer from './components/trainer';
import Sample1 from './components/trainer/sample1';
import Sample2 from './components/trainer/sample2';
import SideDrawer from './components/trainer/myDrawer';
import MemberManagement from './components/trainer/memberManagement';
import NutritionManagement from './components/trainer/memberManagement/nutritionManagement';
import TrainingManagement from './components/trainer/memberManagement/trainingManagement';

import Member from './components/member';
import MemberProfile from './components/member/memberProfile';
import weightLog from './components/member/weightLog';
import TrainingLog from './components/member/trainingLog';
import TodayMeal from './components/member/todaymeal';
import Gallery from './components/member/gallery';

import Icon from 'react-native-vector-icons/MaterialIcons';


const MainStack = createStackNavigator();
const AuthStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const TrainerStack = createStackNavigator();
const MainScreenTab = createMaterialTopTabNavigator();

const headerConfig = {
    headerTitle: false,
    headerTintColor: '#fff',
    headerStyle: {
        backgroundColor: '#F2F2F2',
        elevation: 0, // remove shadow on Android
        // shadowOpacity: 0, // remove shadow on iOS
        // borderBottomWidth: 0,
        // shadowColor: 'transparent'
    },
    // shadowOffset: {
    //     height: 0,
    // },
    headerRight: ({}) => (
        // <Icon name='dehaze' size={20}/>
        <HeaderRight/>
    ),
    headerLeft: ({ navigation }) => (
        <Text 
        style={{color: '#6A4DFF', fontSize: 24, fontWeight: 'bold'}}
        onPress={()=>navigation.push('Trainer')}
        >FITTOSS</Text>
    ),
    headerLeftContainerStyle: {
        paddingLeft: 10,
        paddingTop: 10
    },
    headerRightContainerStyle: {
        paddingRight: 10,
        paddingTop: 10
    },
}

const headerSignIn = {
    headerTitle: false,
    headerTintColor: '#fff',
    headerStyle: {
        backgroundColor: '#F2F2F2',
        elevation: 0, // remove shadow on Android
        // shadowOpacity: 0, // remove shadow on iOS
        // borderBottomWidth: 0,
        // shadowColor: 'transparent'
        height: 44,
    },
    // shadowOffset: {
    //     height: 0,
    // },
    headerLeftContainerStyle: {
        paddingLeft: 10,
        paddingTop: 10
    },
    // headerLeft: () => (
    //     <Icon name='arrow-back-ios' size={30} color="#B3B3B3"/>
    // )
    headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            // Do something
          }}
        />
      ),
}
/*
    Stack Navigator
        -Stack Screen A

    Stack Navigator
        -Tab Navigator
            -Tab Screen B
            -Tab Screen C
 */

const TabBarIcon = (focused, name) => {
    let iconName, iconSize, color;
    if(name === 'Trainer') {
        iconName = 'apps';
    } else if (name === 'sample1') {
        iconName = 'access-alarm';
    } else if (name === 'sample2') {
        iconName = 'campaign';
    }

    if(focused) iconSize = 30, color='black';
    else iconSize = 26, color='gray';

    return <Icon name={iconName} size={iconSize} color={color}/>
}

const DrawerComponent = () => {
    return (
      <Drawer.Navigator
      // permanent, slide ,front
      drawerType="front"
      drawerPosition="right"
      drawerStyle={{
        backgroundColor: '#c6cbef',
        width: 200
      }}
      drawerContentOptions={{
        activeTintColor: 'red',
        activeBackgroundColor: 'skyblue'
      }}
      drawerContent={props => <SideDrawer {...props} />}
      >
        <Drawer.Screen name="AppTabComponent" component={AppTabComponent}/>
      </Drawer.Navigator>
    )
  }

const DrawerComponent_ = () => {
    return (
      <Drawer.Navigator
      // permanent, slide ,front
      drawerType="front"
      drawerPosition="right"
      drawerStyle={{
        backgroundColor: '#c6cbef',
        width: 200
      }}
      drawerContentOptions={{
        activeTintColor: 'red',
        activeBackgroundColor: 'skyblue'
      }}
      drawerContent={props => <SideDrawer {...props} />}
      >
        <Drawer.Screen name="AppTabComponent_" component={AppTabComponent_}/>
      </Drawer.Navigator>
    )
  }

const HeaderRight = () => {
    const navigation = useNavigation();
    return (
      <View style={{flexDirection: 'row', paddingRight: 15}}>
        <TouchableOpacity
        onPress={()=>{
          navigation.dispatch(DrawerActions.openDrawer())
        }}>
          <Icon name='dehaze' size={20}/>
        </TouchableOpacity>
      </View>
    )
  }

const TrainerStackComponent = () => {
    return (
        <TrainerStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        >
            <TrainerStack.Screen name='Trainer' component={Trainer}/>
            <TrainerStack.Screen name='MemberManagement' component={MemberManagement}/>
            <TrainerStack.Screen name='NutritionManagement' component={NutritionManagement}/>
        </TrainerStack.Navigator>
    )
}

const MemberStackComponent = () => {
    return (
        <TrainerStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        >
            <TrainerStack.Screen name='Member' component={Member}/>
            <TrainerStack.Screen name='MemberProfile' component={MemberProfile}/>
            <TrainerStack.Screen name='weightLog' component={weightLog}/>
            <TrainerStack.Screen name='TrainingLog' component={TrainingLog}/>
            <TrainerStack.Screen name='TodayMeal' component={TodayMeal}/>
            <TrainerStack.Screen name='Gallery' component={Gallery}/>
        </TrainerStack.Navigator>
    )
}

const AppTabComponent = () => {
    return (
        <MainScreenTab.Navigator
        tabBarOptions={{
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: '#fff',
                justifyContent: 'center',
                elevation: 0
            },
            tabStyle: {
                backgroundColor: '#F2F2F2'
            },
            iconStyle: {
                width: 30
            }
        }}
        initialRouteName='Trainer'
        screenOptions={
            ({route}) => ({
                tabBarIcon: ({focused}) => {
                    let iconName, iconSize, color;
                    if(route.name === 'Trainer') {
                        iconName = 'apps';
                    } else if (route.name === 'sample1') {
                        iconName = 'access-alarm';
                    } else if (route.name === 'sample2') {
                        iconName = 'campaign';
                    }

                    if(focused) iconSize = 30, color='black';
                    else iconSize = 26, color='gray';

                    return <Icon name={iconName} size={iconSize} color={color}/>
                }
            })
        }
        >
            <MainScreenTab.Screen name='sample1' component={Sample1}/>
            <MainScreenTab.Screen name='Trainer' component={TrainerStackComponent}/>
            <MainScreenTab.Screen name='sample2' component={Sample2}/>
            
        </MainScreenTab.Navigator>
    )
}

const AppTabComponent_ = () => {
    return (
        <MainScreenTab.Navigator
        tabBarOptions={{
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: '#fff',
                justifyContent: 'center',
                elevation: 0
            },
            tabStyle: {
                backgroundColor: '#F2F2F2'
            },
            iconStyle: {
                width: 30
            }
        }}
        initialRouteName='Member'
        screenOptions={
            ({route}) => ({
                tabBarIcon: ({focused}) => {
                    let iconName, iconSize, color;
                    if(route.name === 'Member') {
                        iconName = 'apps';
                    } else if (route.name === 'sample1') {
                        iconName = 'access-alarm';
                    } else if (route.name === 'sample2') {
                        iconName = 'campaign';
                    }

                    if(focused) iconSize = 30, color='black';
                    else iconSize = 26, color='gray';

                    return <Icon name={iconName} size={iconSize} color={color}/>
                }
            })
        }
        >
            <MainScreenTab.Screen name='sample1' component={Sample1}/>
            <MainScreenTab.Screen name='Member' component={MemberStackComponent}/>
            <MainScreenTab.Screen name='sample2' component={Sample2}/>
            
        </MainScreenTab.Navigator>
    )
}

const SignInComponent = () => {
    return (
        <AuthStack.Navigator
        screenOptions={headerSignIn}>
            <AuthStack.Screen name='SignIn' component={SignIn}/>
            <AuthStack.Screen name='EmailRequest' component={EmailRequest}/>
            <AuthStack.Screen name='EmailRequestSuccess' component={EmailRequestSuccess}/>
            <AuthStack.Screen name='ProfileRegister' component={ProfileRegister}/>
            <AuthStack.Screen name='DrawerComponent' component={DrawerComponent} options={headerConfig}/>
            <AuthStack.Screen name='DrawerComponent_' component={DrawerComponent_} options={headerConfig}/>
            
        </AuthStack.Navigator>
    )
}

export const RootNavigator = () => {
    return (
        <MainStack.Navigator
        screenOptions={headerConfig}
        >
            <MainStack.Screen name='Loading' component={Loading} options={{headerShown: false}}/>
            {/* <MainStack.Screen 
            name="DrawerComponent" 
            component={DrawerComponent}
            options={
                headerConfig
                // {headerRight: ({}) => <HeaderRight/>}
            }
            /> */}
            <MainStack.Screen name='SignIn' component={SignInComponent} options={{headerShown: false}}/>
        </MainStack.Navigator>
    )
}