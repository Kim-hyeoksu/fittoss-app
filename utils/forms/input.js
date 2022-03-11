import React from 'react';
import { StyleSheet, TextInput} from 'react-native';

const Input = (props) => {
    let template = null;
    switch(props.type) {
        case 'textinput':
            template = 
                <TextInput
                {...props}
                style={styles.input}
                />
        break;
        case 'narrowTextinput':
            template = 
                <TextInput
                {...props}
                style={styles.narrowTextinput}
                />
        break;

        default:
            return template
    }
    return template
}

export default Input;

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#FCFCFC',
        borderRadius: 10,
        width: 300,
        height: 50,
        color: '#B3B3B3',
        fontSize: 20,
        padding: 5,
        
      },
      narrowTextinput: {
        backgroundColor: '#FCFCFC',
        borderRadius: 10,
        width: 260,
        height: 50,
        color: '#B3B3B3',
        fontSize: 20,
        padding: 5,
      },
})