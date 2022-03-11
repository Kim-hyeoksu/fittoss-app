import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Image } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { storage } from '../../../utils/misc';
import { connect } from 'react-redux';

class gallery extends Component {

    state = {
        modal: false,
        image: '',
        imageId: '',
        imagePath: ''
    }

    // getImage = () => {
    //     storage.ref('diaryImage').child(`${this.state.userId}/${this.state.diaryData.imagePath}/image.jpg`).getDownloadURL()
    //     .then(url=>{
    //         this.setState({
    //             image: url
    //         })
    //     })
    // }

    uploadImage = async (storageDirectory) => {
        const response = await fetch(this.state.image);
        const blob = await response.blob();
        await storage.ref(storageDirectory).put(blob)
    }

    takePhoto = () => {
        launchCamera({}, response=>{
            this.setState({
                image: response.assets[0].uri
            })
        })

        let imageDir = `index${this.state.imageId}`;

        //다음 state의 값이 이전 state 값에 의존한다면 updater 함수 형태를 사용하는 것이 좋습니다!
        //ctrl + k + c
        this.setState(prevState=>({
            ...prevState,
            imagePath: imageDir,
            modal: this.state.modal ? false : true
        }))

        let today = new Date();
        let year = today.getFullYear(); // 년도
        let month = (today.getMonth() + 1).toString();  // 월
        let date = (today.getDate()).toString();  // 날짜
        if(month.length < 2) month = `0${month}`;
        if(date.length < 2) date = `0${date}`;
        let numberFinalDate = `${year}${month}${date}`

        const userId = this.props.User.auth.userId;
        const storageDirectory = `trainingLogImage/${userId}/${numberFinalDate}/image.jpg`
        console.warn(this.state.image)
        this.uploadImage(storageDirectory)
    }

    selectImage = () => {
        launchImageLibrary({}, response=>{
            this.setState({
                image: response.assets[0].uri
            })
        })

        let imageDir = `index${this.state.imageId}`;

        //다음 state의 값이 이전 state 값에 의존한다면 updater 함수 형태를 사용하는 것이 좋습니다!
        this.setState(prevState=>({
            ...prevState,
            imagePath: imageDir,
            modal: this.state.modal ? false : true
        }))
    }

    renderImage = () => (
        <View style={{justifyContent: 'center', alignItems: 'center', width: 100, height: 100}}>
            <View style={{borderRadius: 10, width: '90%', height: '90%'}}>
                <Image
                source={{uri: this.state.image}}
                />
            </View>
        </View>
    )

    render() {
        return (
            <View style={{alignItems: 'center', flexDirection: 'column', flex: 1}}>
                <Modal
                visible={this.state.modal}
                animationType={'fade'}
                transparent={true}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        }}>
                        <View style={{backgroundColor:'white', width: '70%', borderRadius: 2, padding: 10}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>Select Image</Text>
                            <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.takePhoto()}>
                                <Text style={{fontSize: 15}}>Take Photo...</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{margin: 5}}
                                onPress={() => this.selectImage()}>
                                <Text style={{fontSize: 15}}>Choose from Library...</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{margin: 5, alignItems:'flex-end'}}
                                onPress={()=>{
                                    this.setState({
                                        modal: this.state.modal ? false : true
                                    })
                                }}
                                >
                                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={{width: 300, flex: 1, backgroundColor: '#fff'}}>
                    <ScrollView>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, paddingTop: 10}}>
                            <TouchableOpacity 
                            style={{borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 100, height:100}}
                            onPress={()=>{
                                this.setState({
                                    modal: this.state.modal ? false : true
                                })
                            }}
                            >
                                <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: '90%', height: '90%', backgroundColor:'#F2F2F2'}}>
                                    <Text style={{fontWeight: 'bold' ,fontSize: 30, color: '#4D4D4D'}}>+</Text>
                                </View>
                            </TouchableOpacity>
                            {this.renderImage}
                            
                        </View> 
                        
                    </ScrollView>
                </View>
            </View>
            
        )
    }
}

function mapStateToProps(state) {
    return {
      Profile: state.Profile,
      User: state.User,
      Members: state.Members
    }
}

export default connect(mapStateToProps)(gallery);