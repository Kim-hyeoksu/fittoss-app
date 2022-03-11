import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { connect } from 'react-redux'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';



class Member extends Component {
    state = {
        avatar: ''
    } 

    memberListStyle = (index) => {
        switch(index % 4) {
            case 0:
                return '#EDF3FF'
            case 1:
                return '#FFEDF5'
            case 2:
                return '#FFEDED'
            case 3:
                return '#F0EDFF'
            default:
                return '#F0EDFF'
        }    
    }

    memberListTextStyle = (index) => {
        switch(index % 4) {
            case 0:
                return '#80AAFF'
            case 1:
                return '#FF80B9'
            case 2:
                return '#FF8080'
            case 3:
                return '#9580FF'
            default:
                return '#9580FF'
        }    
    }

    render() {
        return (
            <View style={{alignItems: 'center', flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={{color: '#6A4DFF', fontSize: 20, fontWeight: 'bold', marginRight: 2}}>{this.props.Profile.userProfile.username}</Text>
                        <Text style={{fontSize: 18}}>님의 핏로그</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <TouchableOpacity 
                        style={[styles.categoryBox, {backgroundColor: this.memberListStyle(0)}]}
                        onPress={()=>this.props.navigation.push('Gallery')}
                        >
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: this.memberListTextStyle(0)}}>인증찰칵</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={[styles.categoryBox, {backgroundColor: this.memberListStyle(1), marginLeft: 10}]}
                        onPress={()=>this.props.navigation.push('weightLog')}
                        >
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: this.memberListTextStyle(1)}}>체중기록</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <TouchableOpacity style={[styles.categoryBox, {backgroundColor: this.memberListStyle(2)}]}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: this.memberListTextStyle(2)}}>오늘의운동</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={[styles.categoryBox, {backgroundColor: this.memberListStyle(3), marginLeft: 10}]}
                        onPress={()=>this.props.navigation.push('TodayMeal')}
                        >
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: this.memberListTextStyle(3)}}>오늘의식단</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <TouchableOpacity 
                        style={[styles.categoryBox, {backgroundColor: this.memberListStyle(4)}]}
                        onPress={()=>this.props.navigation.push('TrainingLog')}
                        >
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: this.memberListTextStyle(4)}}>운동기록</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.categoryBox, {backgroundColor: this.memberListStyle(5), marginLeft: 10}]}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: this.memberListTextStyle(5)}}>수업로그</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                        <TouchableOpacity 
                        style={[styles.categoryBox, {backgroundColor: this.memberListStyle(6)}]}
                        onPress={()=>this.props.navigation.push('MemberProfile')}
                        >
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: this.memberListTextStyle(6)}}>마이페이지</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.categoryBox, {backgroundColor: '#F2F2F2', marginLeft: 10}]}>
                            <Text style={{fontWeight: 'bold', fontSize: 24, color: '#4D4D4D'}}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column', 
        backgroundColor: '#FFFFFF', 
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        borderRadius: 10
    },
    textContainer: {
        flexDirection: 'row', 
        alignItems: 'baseline', 
        alignSelf: 'flex-start', 
        marginBottom: 10
    },
    categoryBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 135,
        height: 112,
        
    }
})

function mapStateToProps(state) {
    return {
      Profile: state.Profile,
      User: state.User,
      Members: state.Members
    }
}

export default connect(mapStateToProps)(Member);