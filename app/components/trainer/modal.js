/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {View, Text, Modal, Button, StyleSheet} from 'react-native';

 class ModalComponent extends Component {
    state = {
        modal: this.props.modal
    }

    handleModal = () => {
        this.setState({
            modal: this.state.modal ? false : true
        })
    }

    render() {
        return (
            <Modal
                visible={true}
                // slide fade
                animationType={'fade'}
                >
                    <View style={{alignItems: 'center', width: 300}}>
                        <View style={{
                            backgroundColor: 'red'
                        }}>
                            <Text>This is modal content</Text>
                        </View>
                        <Button
                        title="Go Back"
                        onPress={this.handleModal}
                        />
                    </View>
                </Modal>
        )
   }
 }
 
 const styles = StyleSheet.create({
 })
 export default ModalComponent;