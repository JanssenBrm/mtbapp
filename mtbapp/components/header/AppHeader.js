import React from 'react';
import {Header} from "react-native-elements";
import {StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";

export class AppHeader extends React.Component {

    constructor(props){
        super(props);
    }
    render() {

        return (
            <Header
                //leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: this.props.title ? this.props.title : 'MTB Toertochten', style: styles.title }}
                rightComponent={this.props.back ? { icon: 'arrow-back', color: '#fff', onPress: () => Actions.pop() } :  null}
            />
        );

    }
}



const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'monserat'
    }
});