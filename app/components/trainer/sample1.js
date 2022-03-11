import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import Plus from 'react-native-vector-icons/Entypo'


export default class Sample1 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'baseline'}}>
                    <Text style={{color: '#6A4DFF', fontSize: 20, fontWeight: 'bold'}}>홍길동</Text>
                    <Text style={{fontSize: 18}}>선생님 안녕하세요!</Text>
                </View>
                <ScrollView contentContainerStyle={{ height: '100%' }}>
                    <View >
                        <TouchableOpacity 
                        style={styles.memberList}
                        >
                            <Text style={{color: '#6A4DFF', fontSize: 20, fontWeight: 'bold'}}>나의 핏로그</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.addMemberList}>
                            <Plus
                            name='plus'
                            size={40}
                            style={{color: 'gray'}}
                            />
                        </TouchableOpacity>
                        <Text style={styles.registerRule}>+버튼을 클릭 해, 새로운 회원을 등록해보세요!</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', 
        backgroundColor: '#FFFFFF', 
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 25,
        borderRadius: 10
    },
    memberList: {
        width: 280,
        height: 100,
        backgroundColor: '#F0EDFF',
        borderRadius: 10,
        paddingLeft: 20,
        paddingTop: 20,
        marginBottom: 10
    },
    addMemberList: {
        width: 280,
        height: 100,
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    registerRule: {
        color: '#9580FF',
        fontSize: 12,
        fontWeight: 'bold'
      },
})