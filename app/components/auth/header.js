import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation();

    return (
        <View style={{width: '70%'}}>
            
            <View style={{alignItems: 'center', marginTop: 40, marginBottom: 40}}>
                <Text style={styles.logoText}>FITTOSS</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    logoText: {
      fontSize: 50,
      color: '#6A4DFF',
      fontWeight: 'bold',
    },
})