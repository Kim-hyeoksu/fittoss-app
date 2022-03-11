import React, { Component } from 'react'
import {View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Header extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 24, color: '#6A4DFF'}}>FITTOSS</Text>
                <Icon 
                name='dehaze'
                size={20}
                />
            </View>
        )
    }
}
