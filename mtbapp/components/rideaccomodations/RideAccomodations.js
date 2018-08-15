import React from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet, Text} from "react-native";
import Moment from 'moment-timezone';
import {Button, Icon, ListItem} from "react-native-elements";
import { Linking, Platform } from 'react-native';
import {getRideLocationData} from "../../actions/DataActions";
import {WebBrowser} from "expo";

export class RideAccomodations extends React.Component {


    accomodationList = [];

    accomodationMapping = {
        bike_clean: 'Bike cleaning stand',
        bike_rent: 'Bike rental service',
        bikecorner_guarded: 'Guarded bike corner',
        kids_tour: 'Kids tour',
        showers: 'Showers',
        wash: 'Washing facilities',
        gender_seperate: 'Male/female seperate',
        ride_stop: 'Refill station'
    };

    constructor(props) {
        super(props);

        this.accomodationList = [];
        Object.keys(this.props.ride.accommodation).forEach(key => {
            this.accomodationList.push({ key: this.accomodationMapping[key], value: this.props.ride.accommodation[key]})
        })

    }

    render() {

        return (
            <View style={styles.list}>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.accomodationList}
                    renderItem={this.renderItem}
                />
            </View>
        );

    }

    keyExtractor = (item, index) => index;

    renderItem ( item ) {
        return <ListItem
            title={item.item.key}
            containerStyle={styles.listItem}
            subtitle={item.item.value ? 'Available' : 'Not available'}
            subtitleStyle={styles.subtitle}
            rightIcon={item.item.value ? (
                <Icon
                    name='done'
                    color='green'
                />
                ) : (
                <Icon
                    name='clear'
                    color='red'
                />
                )}
        />
    }
}

const styles = StyleSheet.create({

    list: {
        flex: 1,
        justifyContent:'center',
        alignItems:'stretch',
        flexDirection: 'column',
        padding: 20,
        marginBottom: 15,
    },

    listItem: {
        borderBottomWidth: 0
    },

    subtitle: {
        fontStyle: 'italic',
        fontSize: 13,
        color: '#696969',
        marginTop:5
    },
});
