import React from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet, Text} from "react-native";
import Moment from 'moment-timezone';

export class RideInfo extends React.Component {


    delta = 0.05;

    constructor(props){
        super(props);
    }
    render() {

        return (
            <View style={styles.table}>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.header}>Date</Text>
                        <Text style={styles.data}>{Moment.unix(this.props.ride.date).format('ddd D MMMM YYYY')}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.header}>Address</Text>
                        <Text style={styles.data}>{this.props.ride.address.location}{"\n"}{this.props.ride.address.street}{"\n"}{this.props.ride.address.city}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.header}>Start</Text>
                        <Text style={styles.data}>{this.props.ride.time}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.header}>Distance</Text>
                        <Text style={styles.data}>{this.props.ride.distance}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.header}>Price</Text>
                        <Text style={styles.data}>{this.props.ride.price}</Text>
                    </View>
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({

    table: {
        flex: 1,
        justifyContent:'center',
        alignItems:'flex-start',
        padding:20
    },

    row: {
        flex:2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'flex-start',
        height: 50
    },

    col: {
        flex:1,
        flexDirection: 'column',
    },
    header: {
        fontSize: 15,
        fontFamily: 'roboto-bold'
    },
    data: {
        fontFamily: 'roboto'
    }
});
