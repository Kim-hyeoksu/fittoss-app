import React, { Component } from 'react';
import { StyleSheet, Animated, View, Text } from 'react-native';
import { auth } from '../../../utils/misc'

class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            xValue: new Animated.Value(60),
            opacity: new Animated.Value(0)
        }
    }

    onComplete = () => {
        auth.onAuthStateChanged((user)=>{   //사용자 state 변경을 감지하는 관찰자, 로그인 로그아웃 시 trigger
            // if(user) {
            //     this.props.navigation.navigate("AppTabComponent")
            // } else {
            //     this.props.navigation.navigate("SignIn")
            // }
            this.props.navigation.navigate("SignIn")
        })
    }

    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 1000
        }).start(()=>{
            this.onComplete();
        });
    }


    render() {
        return (
            <View style={{height: '100%', backgroundColor: '#BFB3FF', justifyContent: 'center', alignItems: 'center'}}>
                <Animated.View
                    style={{
                        opacity: this.state.opacity,
                    }}
                >
                    <Text style={styles.logoText}>FITTOSS</Text>
                </Animated.View>
            </View>
        )
    }
}

    const styles = StyleSheet.create({
        logoText: {
            fontSize: 50,
            color: '#FFFFFF',
            fontWeight: 'bold'
        }
})
export default Loading;