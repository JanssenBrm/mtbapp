import React from 'react';
import * as DataActions from '../../actions/DataActions';
import * as AuthActions from '../../actions/AuthActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ActivityIndicator, FlatList, View, StyleSheet, Text} from "react-native";
import {ListItem} from "react-native-elements";

export class RideDetails extends React.Component {

    constructor(props){
        super(props);
    }
    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.ride.location}</Text>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column',
    },
    title:{
        fontSize: 16,
        fontWeight: "600",
        textAlign: 'center',
        marginTop: 1
    },

    description:{
        marginTop: 5,
        fontSize: 14,
    }
});
