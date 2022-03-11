import React, { Children, Component, useCallback } from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, Linking} from 'react-native'
import { firebaseCreateUser } from '../../store/actions/user_actions'
import { auth, database } from '../../../utils/misc'; 
import Header from './header';


const OpenURLButton = ( {url, children} ) => {
 
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);
  
    return (
        <TouchableOpacity
        onPress={handlePress}
        >
            {children}
        </TouchableOpacity>
    )
};

export default class EmailRequest extends Component {
    // componentDidMount() {
    //     let user = auth.currentUser;
    //     user.sendEmailVerification()
    //     .then(function() {
    //         // Verification email sent.
    //       })
    //     .catch(function(error) {
        // Error occurred. Inspect error.code.
        // });
        // if(user.emailVerified) {
        //     set(ref(database, 'users/' + user.email), {
        //         email: user.email,
        //       });
        //     this.props.navigation.push('EmailRequestSuccess');
        // }
        
    // }

    // handlePress = (url) => async () => {
    //         // Checking if the link is supported for links with custom URL scheme.
    //         const supported = await Linking.canOpenURL(url);
        
    //         if (supported) {
    //           // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    //           // by some browser in the mobile
    //           await Linking.openURL(url);
    //         } else {
    //           Alert.alert(`Don't know how to open this URL: ${url}`);
    //         }
    //       }, [url]
    // }

    

    render() {
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Header/>
                <Text style={[styles.fontColor, {fontSize: 20, marginBottom: 30}]}>반갑습니다!</Text>
                <Text style={[styles.fontColor, {fontSize: 16}]}>적어주신 메일로 인증메일이 발송되었어요.</Text>
                <Text style={[styles.fontColor, {fontSize: 16, marginBottom: 40}]}>계정 이용을 위해 인증을 완료해주세요.</Text>
                <Text style={[styles.fontColor, {fontSize: 20}]}>이메일 인증 바로가기</Text>

                <View style={styles.iconContainer}>
                    <OpenURLButton url={'https://www.naver.com'}>
                        <Image
                        source={require(`../../assets/images/naver_icon.png`)}
                        style={styles.icon}
                        />
                    </OpenURLButton>
                    <OpenURLButton url={'https://www.daum.net'}>
                        <Image
                        source={require(`../../assets/images/daum_icon.png`)}
                        style={styles.icon}
                        />
                    </OpenURLButton>
                    <OpenURLButton url={'https://www.google.com'}>
                        <Image
                        source={require(`../../assets/images/google_icon.png`)}
                        style={styles.icon}
                        />
                    </OpenURLButton>

                </View>
                <TouchableOpacity 
                style={styles.purpleButton}
                // onPress={firebaseCreateUser('123@123.com', '123123123123')}
                onPress={()=>this.props.navigation.navigate('SignIn')}
                >
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>&lt;돌아가기</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    fontColor: {
        color: '#9580FF'
    },
    iconContainer: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 50,
        width: 170,
        justifyContent: 'space-between'
    },
    icon: {
        width: 50,
        height: 50,
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
