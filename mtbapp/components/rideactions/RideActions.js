import React from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet, Text} from "react-native";
import Moment from 'moment-timezone';
import {Button} from "react-native-elements";
import { Linking, Platform } from 'react-native';
import {getRideLocationData} from "../../actions/DataActions";
import {WebBrowser} from "expo";

export class RideActions extends React.Component {

    state = {
        location: null
    };


    delta = 0.05;

    constructor(props) {
        super(props);
        getRideLocationData(this.props.ride.address).then(result => {
            this.setState({location: result})
        })
    }

    render() {

        return (
            <View style={styles.list}>
                <Button
                    title='Navigate'
                    buttonStyle={styles.button}
                    icon={{
                        name: 'navigation',
                        size: 15,
                        color: 'white'
                    }}
                    onPress={() => {
                        this.openNavigation()
                    }}
                />
                <Button
                    title='Open website'
                    titleStyle={styles.buttonText}
                    buttonStyle={styles.button}
                    icon={{
                        name: 'open-in-browser',
                        size: 15,
                        color: 'white'
                    }}
                    onPress={() => {
                        WebBrowser.openBrowserAsync(this.props.ride.source);
                    }}
                />
            </View>
        );

    }

    openNavigation() {

        const gmapsUrl = `comgooglemaps://?q=${this.props.ride.address.location},${this.props.ride.address.street},${this.props.ride.address.city}`;
        const wazeUrl = `waze://?q=${this.props.ride.address.location},${this.props.ride.address.street},${this.props.ride.address.city}`;
        const mapsUrl = `${Platform.OS == 'android' ? 'geo' : 'maps'}:${this.state.location.center[1]},${this.state.location.center[0]}`;

        console.log(Linking.canOpenURL(wazeUrl))
       Linking.canOpenURL(wazeUrl).then(supported => {

           if(supported){
               Linking.openURL(wazeUrl);
           }else{
               Linking.canOpenURL(gmapsUrl).then( gsupported => {
                   if(gsupported){
                       Linking.openURL(gmapsUrl);
                   }else{
                       Linking.openURL(mapsUrl)
                   }
               })
           }

       }).catch(err => {
           console.error("Error when opening URL", err);
       })
    }
}

const styles = StyleSheet.create({

    list: {
        flex: 1,
        justifyContent:'center',
        alignItems:'stretch',
        flexDirection: 'column'
    },

    button: {
        borderRadius: 25,
        backgroundColor: '#3D6DCC',
        marginBottom: 5
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: "700"
    }
});