import React from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet, Text} from "react-native";
import Moment from 'moment-timezone';
import {Avatar, Button, Icon, ListItem} from "react-native-elements";
import { Linking, Platform } from 'react-native';
import {getRideLocationData} from "../../actions/DataActions";
import {WebBrowser} from "expo";
import {WEATHER_ICONS} from "../../mapping/weathericons.mapping";

export class RideWeatherConditions extends React.Component {


    weatherConditions = [];

    constructor(props) {
        super(props);

        console.log(props.ride.weatherConditions);
        this.weatherConditions.push({key: 'Condition', value: props.ride.weatherConditions.summary, icon: WEATHER_ICONS[props.ride.weatherConditions.icon].icon});

        if(props.ride.weatherConditions.precipProbability)
            this.weatherConditions.push({key: 'Chance of rain', value: `${props.ride.weatherConditions.precipProbability * 100} %`});
        this.weatherConditions.push({key: 'Min temperature', value: `${props.ride.weatherConditions.temperatureMin} °C`});
        this.weatherConditions.push({key: 'Max temperature', value: `${props.ride.weatherConditions.temperatureHigh} °C`});
        this.weatherConditions.push({key: 'Wind speed', value: `${props.ride.weatherConditions.windSpeed} km/h`});
    }

    getTempInCelcius(tmpFahr){
        return Intl.NumberFormat('nl-BE', {maximumFractionDigits: 1}).format((tmpFahr - 32) * (5/9))
    }

    render() {

        return (
            <View style={styles.list}>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.weatherConditions}
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
            subtitle={item.item.value}
            subtitleStyle={styles.subtitle}
            rightIcon={item.item.icon ? (
                <Avatar source={item.item.icon} size='medium' containerStyle={styles.weatherIcon} overlayContainerStyle={styles.weatherIconContainer} />
            ) : null }
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

    weatherIcon: {
        height:12,
        marginLeft: 10
    },

    weatherIconContainer: {
        backgroundColor: 'white',
        height:12,
        marginLeft: 5,
        marginTop: 2
    }
});
