import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, Modal, Picker, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { database } from '../../../utils/misc';
import {
    LineChart,
} from "react-native-chart-kit";

import {getMyLog} from '../../store/actions/member_actions';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native';

class WeightLog extends Component {

    state = {
        modal: false,
        data: {
            labels: [0,0,0,0,0,0,0],
            datasets: [
                {
                    data: [0,0,0,0,0,0,0],
                    strokeWidth: 2,
                    color: () => `#ed7d31`, // optional
                },
                {
                    data: [0,0,0,0,0,0,0],
                    strokeWidth: 2,
                    color: () => `#5b9bd5`, // optional                    
                },
                {
                    data: [0,0,0,0,0,0,0],
                    strokeWidth: 2,
                    color: () => `#a5a5a5`, // optional                    
                },
            ],
            legend: ['체중', '체지방률', '골격근량']
        },
        form: {
            dataMonth: '11',
            weight: '',
            fatPercentage: '',
            SkeletalMuscleMass: ''
        }
    }

    componentDidMount() {
        this.props.getMyLog(this.props.User)
        this.chartDataUpdate();
    }

    chartDataUpdate = () => {
        const dataCopy = this.state.data
        const myLog = this.props.Members.mylog
        let weightArray = [];
        let fatPercentageArray = [];
        let SkeletalMuscleMassArray = [];
        let DateLabelArray = [];

        for(let item of myLog) {
            weightArray.unshift(parseInt(item.weight, 10))
            fatPercentageArray.unshift(parseInt(item.fatPercentage, 10))
            SkeletalMuscleMassArray.unshift(parseInt(item.SkeletalMuscleMass, 10))
            DateLabelArray.unshift(item.date % 100)     //substr(3, 2): 3번째부터 2개 추출, substring(3,7): 3~6번째 추출
        }
        dataCopy.datasets[0].data = weightArray;
        dataCopy.datasets[1].data = fatPercentageArray;
        dataCopy.datasets[2].data = SkeletalMuscleMassArray;
        dataCopy.labels = DateLabelArray;

        this.setState({
            data : dataCopy
        })
    }

    //const reverse = [...members.mylog].reverse();
    renderWeightLog = (members) => (
        members.mylog ?
            members.mylog.map((item, index)=>(
                    <View
                    key={index}
                    style={styles.weightLog}
                    >
                        <View style={{flex: 1, alignItems:'center'}}><Text>{item.date}</Text></View>
                        <View style={{flex: 1, alignItems:'center'}}><Text>{item.weight}</Text></View>
                        <View style={{flex: 1, alignItems:'center'}}><Text>{item.fatPercentage}</Text></View>
                        <View style={{flex: 1, alignItems:'center'}}><Text>{item.SkeletalMuscleMass}</Text></View>
                    </View>
                ))
        :        
        null        
    )

    submitUser = () => {
        let isformValid = true;
        const formCopy = this.state.form;

        let today = new Date();
        let year = today.getFullYear(); // 년도
        let month = (today.getMonth() + 1).toString();  // 월
        let date = (today.getDate()).toString();  // 날짜
        if(month.length < 2) month = `0${month}`;
        if(date.length < 2) date = `0${date}`;
        let numberFinalDate = parseInt(`${year}${month}${date}`, 10)

        //${finalDate}
        if(isformValid) {
            try {
                database.ref(`users/${this.props.User.auth.userId}/mylog/${numberFinalDate}`).set({
                    weight: formCopy.weight,
                    fatPercentage: formCopy.fatPercentage,
                    SkeletalMuscleMass: formCopy.SkeletalMuscleMass,
                    date: numberFinalDate
                })
                .then(this.props.getMyLog(this.props.User))
                
            } catch (err) {
                alert('저장실패:'+err.message);
            }
            
        } else {
            this.setState({
            hasErrors: true
            })
        }   
    }

    updateInput = (name, value) => {
        //로그인하는 순간에 error가 있으면 안되니까 한번 더 설정해줌
        this.setState({
            hasErrors: false
        })
        
        // /^\d+$/
        if (/^\d+(?:[.]?[\d]?[\d])?$/.test(value)) {
            let formCopy = this.state.form;
            formCopy[name] = value;
            
            
            this.setState({
                form: formCopy,
            })
        }
    }

    render() {
        const chartConfig = {
            backgroundGradientFrom: "#FFEDF5",
            // backgroundGradientFromOpacity: 1,
            backgroundGradientTo: "#FFEDF5",
            // backgroundGradientToOpacity: 0.5,
            color: () => `#000`,  //글씨 색
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
        };

            return (
                <View style={{alignItems: 'center', flex: 1}}>
                    <View style={styles.container}>
                        <Modal
                        visible={this.state.modal}
                        // slide fade
                        animationType={'fade'}
                        transparent={true}
                        >
                            <View style={styles.modalContainer}>
                                <View style={
                                    {backgroundColor: '#F7F7F7', 
                                    alignItems: 'center',
                                    borderColor: '#B3B3B3',
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    borderRadius: 10
                                    }}>
                                    <View style={{alignSelf: 'flex-end'}}>
                                        
                                        <TouchableOpacity
                                        style={{marginRight: 5}}
                                        onPress={()=>{
                                            this.setState({
                                                modal: this.state.modal ? false : true
                                            })
                                        }}
                                        >
                                            <Icon
                                            name='close'
                                            size={20}
                                            color='gray'
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={{fontWeight: 'bold'}}>체지방률 기준</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', borderTopWidth: 1}}>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <Text>정상</Text>
                                            <View style={{flexDirection: 'column'}}>
                                                <Text>남 20%↓</Text>
                                                <Text>여 28%↓</Text>
                                            </View>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <Text>바디프로필</Text>
                                            <Text>8~9%</Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <Text>시합준비</Text>
                                            <Text>3~5%</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <View style={styles.textContainer}>
                            <Text style={{color: '#6A4DFF', fontSize: 20, fontWeight: 'bold', marginRight: 3}}>{this.props.Profile.userProfile.username}</Text>
                            <Text style={{fontSize: 18}}>님의 체중기록</Text>
                            
                        </View>
                        
                        <View style={{marginBottom: 5}}>
                            <Text style={{color: '#FF80B9', fontSize: 12, fontWeight: 'bold'}}>오늘의 수치를 입력해주세요!</Text>
                        </View>
                        <View style={styles.personalInfoCon}>
                            <View style={styles.valueBox}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#FF80B9'}}>체중</Text></View>
                                <TextInput
                                style={styles.value}
                                value={this.state.form.weight}
                                textAlign= {'center'}
                                autoCapitalize={'none'}
                                keyboardType={'numeric'}
                                placeholder=''
                                placeholderTextColor='#ddd'
                                onChangeText={value=>this.updateInput('weight', value)}
                                />
                            </View>
                            <View style={[styles.valueBox, {marginLeft: 10, marginRight: 10}]}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#FF80B9'}}>체지방률</Text></View>
                                <TextInput
                                style={styles.value}
                                value={this.state.form.fatPercentage}
                                textAlign= {'center'}
                                autoCapitalize={'none'}
                                keyboardType={'numeric'}
                                placeholder=''
                                placeholderTextColor='#ddd'
                                onChangeText={value=>this.updateInput('fatPercentage', value)}
                                />
                            </View>
                            <View style={styles.valueBox}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#FF80B9'}}>골격근량</Text></View>
                                <TextInput
                                style={styles.value}
                                value={this.state.form.SkeletalMuscleMass}
                                textAlign= {'center'}
                                autoCapitalize={'none'}
                                keyboardType={'numeric'}
                                placeholder=''
                                placeholderTextColor='#ddd'
                                onChangeText={value=>this.updateInput('SkeletalMuscleMass', value)}
                                />
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                            style={{width: 70, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEDF5', borderRadius: 10}}
                            onPress={this.submitUser}
                            >  
                                <Text style={{color: '#FF80B9', fontSize: 12, fontWeight: 'bold'}}>저장</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginBottom: 5}}>
                            <TouchableOpacity
                            onPress={()=>{
                                this.setState({
                                    modal: this.state.modal ? false : true
                                })
                            }}
                            >
                                <Icon
                                name='info'
                                size={20}
                                color='gray'
                                />
                            </TouchableOpacity>
                            
                        </View>
                        
                        <LineChart
                        style={{borderRadius: 10, marginBottom: 10}}
                        data={this.state.data}
                        width={280}
                        height={170}
                        withInnerLines={false}  //눈금선
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars={true}
                        />
                        
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>체중기록</Text>
                            <View style={{alignSelf: 'flex-start', overflow: 'hidden', height: 40, width: 100}}>
                                <Picker
                                style={{color: '#B3B3B3'}}
                                selectedValue={this.state.form.dataMonth}
                                onValueChange={value=>this.updateInput('dataMonth', value)}
                                >
                                    <Picker.Item label="1" value="1" />
                                    <Picker.Item label="2" value="2" />
                                    <Picker.Item label="3" value="3" />
                                    <Picker.Item label="4" value="4" />
                                    <Picker.Item label="5" value="5" />
                                    <Picker.Item label="6" value="6" />
                                    <Picker.Item label="7" value="7" />
                                    <Picker.Item label="8" value="8" />
                                    <Picker.Item label="9" value="9" />
                                    <Picker.Item label="10" value="10" />
                                    <Picker.Item label="11" value="11" />
                                    <Picker.Item label="12" value="12" />
                                </Picker>
                            </View>
                            
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1, alignItems:'center'}}><Text style={{fontWeight: 'bold'}}>날짜</Text></View>
                                <View style={{flex: 1, alignItems:'center'}}><Text style={{fontWeight: 'bold'}}>체중</Text></View>
                                <View style={{flex: 1, alignItems:'center'}}><Text style={{fontWeight: 'bold'}}>체지방률</Text></View>
                                <View style={{flex: 1, alignItems:'center'}}><Text style={{fontWeight: 'bold'}}>골격근량</Text></View>
                            </View>
                            <View style={{flexDirection: 'column', flex: 1}}>
                                <ScrollView>
                                    {this.renderWeightLog(this.props.Members)}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            )
        
        
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center', 
        paddingTop: 160,
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'column',
    },
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
        marginBottom: 5
    },
    personalInfoCon: {
        flexDirection: 'row',
        height: 60,
        marginBottom: 5
    },
    valueBox: {
        flex: 1,
        flexDirection: 'column',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#B3B3B3',
        borderRadius: 10
        
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEDF5',
        flex: 1.5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    value: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderTopColor: '#B3B3B3',
        borderTopWidth: 1,
    },
    purposeContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        height: 50
    },
    weightLog: {
        flexDirection: 'row'
    }
})

function mapStateToProps(state) {
    return {
      Profile: state.Profile,
      User: state.User,
      Members: state.Members
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getMyLog}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WeightLog);