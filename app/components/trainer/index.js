import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../store/actions/user_actions';
import { getMembers } from '../../store/actions/member_actions';

import ModalComponent from './modal';
import { database } from '../../../utils/misc';
import Input from '../../../utils/forms/input';
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Trainer extends Component {
    state = {
        modal: false,
        hasErrors: false,
        isAdded: false,
        style: {
            trainingPurpose: {
                fastDiet: '#BFB3FF',
                diet: '#D9D9D9',
                maintenance: '#D9D9D9',
                leanMassUp: '#D9D9D9',
                bulkUp: '#D9D9D9'
            },
            activityLevel: {
                lv1: '#BFB3FF',
                lv2: '#D9D9D9',
                lv3: '#D9D9D9',
                lv4: '#D9D9D9',
                lv5: '#D9D9D9'
            }
        },
        form: {
            memberName: '',
            trainingPurpose: 'fastDiet',
            activityLevel: 'lv1'
        }
    }

    memberListStyle = (item, index) => {
        if(item === 'container') {
            switch(index % 6) {
                case 0:
                    return '#EDF3FF'
                case 1:
                    return '#FFEDF5'
                case 2:
                    return '#FFEDED'
                case 3:
                    return '#B3B3B3'
                case 4:
                    return '#FFFFFF'
                case 5:
                    return '#F0EDFF'
                default:
                    return '#F0EDFF'
            }    
        } else {
            switch(index % 6) {
                case 0:
                    return '#80AAFF'
                case 1:
                    return '#FF80B9'
                case 2:
                    return '#FF8080'
                case 3:
                    return '#4D4D4D'
                case 4:
                    return '#808080'
                case 5:
                    return '#9580FF'
                default:
                    return '#9580FF'
            }    
        }
    }

    renderMemberList = (members) => (
        members.member ?
            members.member.map((item, index)=>(
                <TouchableOpacity
                key={index} 
                style={[styles.memberList, {backgroundColor: this.memberListStyle('container', index)}]}
                onPress={()=>this.props.navigation.push('MemberManagement', {
                    member: item
                })}
                >
                    <Text style={{color: this.memberListStyle('text', index), fontSize: 20, fontWeight: 'bold'}}>{item.name}님의 핏로그</Text>
                </TouchableOpacity>
            ))
        :        
        null        
    )

    componentWillMount() {
        // this.props.dispatch(getProfile(this.props.User))
        // this.props.getProfile(this.props.User)
        this.props.dispatch(getMembers(this.props.User))
    }

    updateInput = (value) => {
        //로그인하는 순간에 error가 있으면 안되니까 한번 더 설정해줌
        this.setState({
            hasErrors: false
        })
    
        let formCopy = this.state.form;
        formCopy.memberName = value;
    
        this.setState({
            form: formCopy
        })
    }


    changeMenuStyle(purpose) {
        let styleCopy = this.state.style
        let formCopy = this.state.form

        if(purpose in styleCopy.trainingPurpose) {
            for(let key in styleCopy.trainingPurpose) {
                if(purpose === key) {
                    styleCopy.trainingPurpose[key] = '#BFB3FF';
                    formCopy.trainingPurpose = purpose;
                } else {
                    styleCopy.trainingPurpose[key] = '#D9D9D9';
                }
            }
        } else {
            for(let key in styleCopy.activityLevel) {
                if(purpose === key) {
                    styleCopy.activityLevel[key] = '#BFB3FF';
                    formCopy.activityLevel = purpose;
                } else {
                    styleCopy.activityLevel[key] = '#D9D9D9';
                }
            }
        }
       
        this.setState({
            style: styleCopy,
            form: formCopy
        })
    }

    submitUser = () => {
        let isformValid = false;
        let formCopy = this.state.form;
        let styleCopy = this.state.style
        if(formCopy.memberName !== '') {
            isformValid = true;
        }

        if(isformValid) {
            try {
                database.ref(`users/${this.props.User.auth.userId}/members/${formCopy.memberName}`).set({
                    name: formCopy.memberName,
                    trainingPurpose: formCopy.trainingPurpose,
                    activityLevel: formCopy.activityLevel
                })
                .then(()=>{
                    // formCopy.memberName = '',
                    formCopy.trainingPurpose = '',
                    formCopy.activityLevel = '',
                    this.changeMenuStyle('fastDiet')
                    this.changeMenuStyle('lv1')
                    this.setState({
                        isAdded: true,
                        addMember: false,
                        form: formCopy
                    })
                    })
            } catch (err) {
                alert('저장실패:'+err.message);
            }
            
        } else {
            alert('이름을 입력해주세요.')
            // this.setState({
            // hasErrors: true
            // })
        }
    }

    handleModal = () => {
        this.setState({
            modal: this.state.modal ? false : true
        })
    }

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <View>
                    <Modal
                    visible={this.state.modal}
                    // slide fade
                    animationType={'fade'}
                    // onBackdropPress={() => this.handleModal()}
                    >
                        {this.state.isAdded ?
                            <View style={styles.modalContainer}>
                                <View style={styles.addMemberContainer}>
                                    <Text style={{fontSize: 20, color: '#9580FF', marginBottom: 122}}>회원추가</Text>
                                    <View style={{flexDirection: 'row', marginBottom: 30}}>
                                        <Text style={{color: '#9580FF', fontSize: 20, fontWeight: 'bold'}}>{this.state.form.memberName}</Text>
                                        <Text style={{fontSize: 20, color: '#9580FF'}}>님 추가 완료!</Text>
                                    </View>
                                    <View style={{marginBottom: 92, alignItems: 'center'}}>
                                        <Text style={{fontSize: 16, color: '#9580FF'}}>아래의 "회원초대하기"</Text>
                                        <Text style={{fontSize: 16, color: '#9580FF', marginBottom: 25}}>버튼을 클릭하면,</Text>
                                        <Text style={{fontSize: 16, color: '#9580FF'}}>초대메세지가 공유됩니다.</Text>
                                    </View>
                                    <TouchableOpacity 
                                    style={styles.purpleButton}
                                    onPress={this.handleModal}
                                    >
                                        <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>회원초대하기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        :
                            <View style={styles.modalContainer}>
                                <View style={styles.addMemberContainer}>
                                    <View
                                    style={{alignSelf: 'flex-start'}}
                                    >
                                        <Icon
                                        name='arrow-back-ios'
                                        size={20}
                                        color={'white'}
                                        onPress={this.handleModal}
                                        />
                                    </View>                                   
                                    <Text style={{color: '#9580FF', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>회원추가</Text>
                                    <Text style={{color: '#9580FF', fontSize: 12, marginBottom: 15}}>회원 정보는 등록 후 수정이 가능합니다.</Text>
                                    <View>
                                        <Text style={styles.categoryFont}>이름</Text>
                                        <Input
                                        value={this.state.form.memberName}
                                        type='narrowTextinput'
                                        autoCapitalize={'none'}
                                        placeholder='이름'
                                        placeholderTextColor='#ddd'
                                        onChangeText={value=>this.updateInput(value)}
                                        />
                                        <Text style={styles.categoryFont}>운동목표</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity 
                                            style={[styles.trainingPurpose, {backgroundColor: this.state.style.trainingPurpose.fastDiet}]}
                                            onPress={()=>this.changeMenuStyle('fastDiet')}
                                            >
                                                <Text style={{fontSize: 12, color: 'white'}}>빠른</Text>
                                                <Text style={{fontSize: 12, color: 'white'}}>다이어트</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                            style={[styles.trainingPurpose, {backgroundColor: this.state.style.trainingPurpose.diet}]}
                                            onPress={()=>this.changeMenuStyle('diet')}
                                            >
                                                <Text style={{fontSize: 12, color: 'white'}}>다이어트</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                            style={[styles.trainingPurpose, {backgroundColor: this.state.style.trainingPurpose.maintenance}]}
                                            onPress={()=>this.changeMenuStyle('maintenance')}
                                            >
                                                <Text style={{fontSize: 12, color: 'white'}}>유지어트</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                            style={[styles.trainingPurpose, {backgroundColor: this.state.style.trainingPurpose.leanMassUp}]}
                                            onPress={()=>this.changeMenuStyle('leanMassUp')}
                                            >
                                                <Text style={{fontSize: 12, color: 'white'}}>린매스업</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                            style={[styles.trainingPurpose, {backgroundColor: this.state.style.trainingPurpose.bulkUp}]}
                                            onPress={()=>this.changeMenuStyle('bulkUp')}
                                            >
                                                <Text style={{fontSize: 12, color: 'white'}}>벌크업</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.categoryFont}>활동레벨</Text>
                                        <View style={{flexDirection: 'row', marginBottom: 25}}>
                                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                                <TouchableOpacity 
                                                style={[styles.trainingPurpose, {backgroundColor: this.state.style.activityLevel.lv1}]}
                                                onPress={()=>this.changeMenuStyle('lv1')}
                                                >
                                                    <Text style={{fontSize: 18, color: 'white'}}>LV.1</Text>
                                                </TouchableOpacity>
                                                <Text style={{fontSize: 10, color: '#9580FF'}}>운동안함</Text>
                                            </View>
                                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                                <TouchableOpacity 
                                                style={[styles.trainingPurpose, {backgroundColor: this.state.style.activityLevel.lv2}]}
                                                onPress={()=>this.changeMenuStyle('lv2')}
                                                >
                                                    <Text style={{fontSize: 18, color: 'white'}}>LV.2</Text>
                                                </TouchableOpacity>
                                                <Text style={{fontSize: 10, color: '#9580FF'}}>주 1-3회</Text>
                                            </View>
                                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                                <TouchableOpacity 
                                                style={[styles.trainingPurpose, {backgroundColor: this.state.style.activityLevel.lv3}]}
                                                onPress={()=>this.changeMenuStyle('lv3')}
                                                >
                                                    <Text style={{fontSize: 18, color: 'white'}}>LV.3</Text>
                                                </TouchableOpacity>
                                                <Text style={{fontSize: 10, color: '#9580FF'}}>주 3-5회</Text>
                                            </View>
                                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                                <TouchableOpacity 
                                                style={[styles.trainingPurpose, {backgroundColor: this.state.style.activityLevel.lv4}]}
                                                onPress={()=>this.changeMenuStyle('lv4')}
                                                >
                                                    <Text style={{fontSize: 18, color: 'white'}}>LV.4</Text>
                                                </TouchableOpacity>
                                                <Text style={{fontSize: 10, color: '#9580FF'}}>주 6-7회</Text>
                                            </View>
                                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                                <TouchableOpacity 
                                                style={[styles.trainingPurpose, {backgroundColor: this.state.style.activityLevel.lv5}]}
                                                onPress={()=>this.changeMenuStyle('lv5')}
                                                >
                                                    <Text style={{fontSize: 18, color: 'white'}}>LV.5</Text>
                                                </TouchableOpacity>
                                                <Text style={{fontSize: 10, color: '#9580FF'}}>일 2회↑</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity 
                                        style={styles.purpleButton}
                                        onPress={this.submitUser}
                                        >
                                            <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>추가하기</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        }
                    </Modal>
                    <View style={styles.container}>
                        <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'baseline'}}>
                            <Text style={{color: '#6A4DFF', fontSize: 20, fontWeight: 'bold', marginRight: 2}}>{this.props.Profile.userProfile.username}</Text>
                            <Text style={{fontSize: 18}}>선생님 안녕하세요!</Text>
                        </View>
                        <ScrollView>
                            <View>
                                <TouchableOpacity 
                                style={[styles.memberList, {backgroundColor: '#F0EDFF'}]}
                                >
                                    <Text style={{color: '#6A4DFF', fontSize: 20, fontWeight: 'bold'}}>나의 핏로그</Text>
                                </TouchableOpacity>
                                {this.renderMemberList(this.props.Members)}
                                
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                        style={styles.addMemberList}
                        onPress={this.handleModal}
                        >
                            <Text style={{color: '#b3b3b3', fontSize: 30}}>+</Text>
                        </TouchableOpacity>
                        <Text style={styles.registerRule}>+ 버튼을 클릭 해, 새로운 회원을 등록해보세요!</Text>
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center', 
        paddingTop: 80,
    },
    modalContainer_: {
        alignItems: 'center', 
        paddingTop: 80,
    },
    container: {
        width: 300,
        flex: 1,
        flexDirection: 'column', 
        backgroundColor: '#FFFFFF', 
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 25,
        borderRadius: 10
    },
    addMemberContainer: {
        width: 300,
        alignItems: 'center',
        flexDirection: 'column', 
        backgroundColor: '#F0EDFF', 
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 10,
    },
    memberList: {
        width: 280,
        height: 100,
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
    categoryFont: {
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 10,
        color: '#9580FF',
        fontSize: 16
    },
    trainingPurpose: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 50,
        marginRight: 5,
        borderRadius: 10
    },
    purpleButton: {
        backgroundColor: '#BFB3FF',
        width: 260,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
})
  
function mapStateToProps(state) {
    return {
      Profile: state.Profile,
      User: state.User,
      Members: state.Members
    }
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({getProfile, getMembers}, dispatch);
// }

export default connect(mapStateToProps)(Trainer);