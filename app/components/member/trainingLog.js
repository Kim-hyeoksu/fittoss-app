import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, Modal, Picker, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { database } from '../../../utils/misc';
import {
    LineChart,
} from "react-native-chart-kit";

import {getMyLog} from '../../store/actions/member_actions';
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native';

class TrainingLog extends Component {

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
            legend: ['스쿼트', '벤치프레스', '데드리프트']
        },
        form: {
            dataMonth: '11',
            squat: '',
            deadLift: '',
            benchPress: ''
        },
        calculator: {
            weight: '',
            reps: '',
            oneRM: ''
        }
    }

    componentDidMount() {
        this.props.getMyLog(this.props.User)
        this.chartDataUpdate();
    }

    chartDataUpdate = () => {
        const dataCopy = this.state.data
        const myLog = this.props.Members.mylog
        let squatArray = [];
        let deadLiftArray = [];
        let benchPressArray = [];
        let DateLabelArray = [];

        for(let item of myLog) {
            if(item.sbd) {
                squatArray.unshift(parseInt(item.sbd.squat, 10))
                deadLiftArray.unshift(parseInt(item.sbd.deadLift, 10))
                benchPressArray.unshift(parseInt(item.sbd.benchPress, 10))
                DateLabelArray.unshift(item.date % 100)     //substr(3, 2): 3번째부터 2개 추출, substring(3,7): 3~6번째 추출
            } 
        }
        dataCopy.datasets[0].data = squatArray;
        dataCopy.datasets[1].data = deadLiftArray;
        dataCopy.datasets[2].data = benchPressArray;
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
                        <View style={{flex: 1, alignItems:'center'}}><Text>{item.sbd.squat}</Text></View>
                        <View style={{flex: 1, alignItems:'center'}}><Text>{item.sbd.benchPress}</Text></View>
                        <View style={{flex: 1, alignItems:'center'}}><Text>{item.sbd.deadLift}</Text></View>
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
                database.ref(`users/${this.props.User.auth.userId}/mylog/${numberFinalDate}/sbd`).set({
                    squat: formCopy.squat,
                    deadLift: formCopy.deadLift,
                    benchPress: formCopy.benchPress,
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

    oneRMCalculate = (name, value) => {
        this.setState({
            hasErrors: false
        })
        
        // /^\d+$/
        if (/^\d+(?:[.]?[\d]?[\d])?$/.test(value)) {
            let calculatorCopy = this.state.calculator;
            calculatorCopy[name] = value;
            
            
            this.setState({
                calculator: calculatorCopy,
            })
        }
    }

    render() {
        const chartConfig = {
            backgroundGradientFrom: "#EDF3FF",
            // backgroundGradientFromOpacity: 1,
            backgroundGradientTo: "#EDF3FF",
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
                                        <Text style={{fontWeight: 'bold'}}>1RM 계산기</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', borderTopWidth: 1}}>
                                        <Text>1RM = W0 + W1</Text>
                                        <Text>W0=임의무게설정</Text>
                                        <Text>W1=W0 x 0.025 x reps</Text>

                                    </View>
                                    <View style={styles.personalInfoCon}>
                                        <View style={styles.valueBox}>
                                            <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>weight</Text></View>
                                            <TextInput
                                            style={styles.value}
                                            value={this.state.calculator.weight}
                                            textAlign= {'center'}
                                            autoCapitalize={'none'}
                                            keyboardType={'numeric'}
                                            placeholder=''
                                            placeholderTextColor='#ddd'
                                            onChangeText={value=>this.oneRMCalculate('weight', value)}
                                            />
                                        </View>
                                        <View style={[styles.valueBox, {marginLeft: 10, marginRight: 10}]}>
                                            <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>reps</Text></View>
                                            <TextInput
                                            style={styles.value}
                                            value={this.state.calculator.reps}
                                            textAlign= {'center'}
                                            autoCapitalize={'none'}
                                            keyboardType={'numeric'}
                                            placeholder=''
                                            placeholderTextColor='#ddd'
                                            onChangeText={value=>this.oneRMCalculate('reps', value)}
                                            />
                                        </View>
                                        <View style={styles.valueBox}>
                                            <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>1RM</Text></View>
                                            <View style={[styles.value, {flex: 2.5}]}>
                                                <Text>{parseInt(this.state.calculator.weight, 10) + parseInt(this.state.calculator.weight, 10) * 0.025 * parseInt(this.state.calculator.reps, 10)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <View style={styles.textContainer}>
                            <Text style={{color: '#6A4DFF', fontSize: 20, fontWeight: 'bold', marginRight: 3}}>{this.props.Profile.userProfile.username}</Text>
                            <Text style={{fontSize: 18}}>님의 운동기록</Text>
                            
                        </View>
                        
                        <View style={{marginBottom: 5}}>
                            <Text style={{color: '#80AAFF', fontSize: 12, fontWeight: 'bold'}}>오늘의 수치를 입력해주세요!</Text>
                        </View>
                        <View style={styles.personalInfoCon}>
                            <View style={styles.valueBox}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>스쿼트</Text></View>
                                <TextInput
                                style={styles.value}
                                value={this.state.form.squat}
                                textAlign= {'center'}
                                autoCapitalize={'none'}
                                keyboardType={'numeric'}
                                placeholder=''
                                placeholderTextColor='#ddd'
                                onChangeText={value=>this.updateInput('squat', value)}
                                />
                            </View>
                            <View style={[styles.valueBox, {marginLeft: 10, marginRight: 10}]}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>벤치프레스</Text></View>
                                <TextInput
                                style={styles.value}
                                value={this.state.form.deadLift}
                                textAlign= {'center'}
                                autoCapitalize={'none'}
                                keyboardType={'numeric'}
                                placeholder=''
                                placeholderTextColor='#ddd'
                                onChangeText={value=>this.updateInput('deadLift', value)}
                                />
                            </View>
                            <View style={styles.valueBox}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>데드리프트</Text></View>
                                <TextInput
                                style={styles.value}
                                value={this.state.form.benchPress}
                                textAlign= {'center'}
                                autoCapitalize={'none'}
                                keyboardType={'numeric'}
                                placeholder=''
                                placeholderTextColor='#ddd'
                                onChangeText={value=>this.updateInput('benchPress', value)}
                                />
                            </View>
                        </View>
                        <View style={{alignSelf: 'flex-start', marginBottom: 5}}>
                            <Text style={{color: '#80AAFF', fontSize: 12, fontWeight: 'bold'}}>최근 기록</Text>
                        </View>
                        <View style={styles.personalInfoCon}>
                            <View style={styles.valueBox}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>스쿼트</Text></View>
                                <View style={[styles.value, {flex: 2}]}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={[styles.valueBox, {marginLeft: 10, marginRight: 10}]}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>벤치프레스</Text></View>
                                <View style={[styles.value, {flex: 2}]}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={styles.valueBox}>
                                <View style={styles.title}><Text style={{fontWeight: 'bold', fontSize: 13, color: '#80AAFF'}}>데드리프트</Text></View>
                                <View style={[styles.value, {flex: 2}]}>
                                    <Text></Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                            style={{width: 70, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF3FF', borderRadius: 10}}
                            onPress={this.submitUser}
                            >  
                                <Text style={{color: '#80AAFF', fontSize: 12, fontWeight: 'bold'}}>저장</Text>
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
                                name='calculator'
                                size={20}
                                color='black'
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
                            <Text style={{fontWeight: 'bold'}}>중량기록</Text>
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
                                <View style={{flex: 1, alignItems:'center'}}><Text style={{fontWeight: 'bold'}}>스쿼트</Text></View>
                                <View style={{flex: 1, alignItems:'center'}}><Text style={{fontWeight: 'bold'}}>벤치프레스</Text></View>
                                <View style={{flex: 1, alignItems:'center'}}><Text style={{fontWeight: 'bold'}}>데드리프트</Text></View>
                            </View>
                            <View style={{flexDirection: 'column', flex: 1}}>
                                <ScrollView>
                                    {/* {this.renderWeightLog(this.props.Members)} */}
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
        backgroundColor: '#EDF3FF',
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

export default connect(mapStateToProps, mapDispatchToProps)(TrainingLog);