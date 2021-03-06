import React from 'react';
import * as DataActions from '../../actions/DataActions';
import * as AuthActions from '../../actions/AuthActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ActivityIndicator, FlatList, View, StyleSheet, Text, ScrollView} from "react-native";
import {ListItem} from "react-native-elements";
import {AppHeader} from "../header/AppHeader";
import {Actions} from 'react-native-router-flux';
import {MapView} from "expo";
import {getRideLocationData} from "../../actions/DataActions";
import {RideInfo} from "../rideinfo/RideInfo";
import {RideActions} from "../rideactions/RideActions";
import {RideAccomodations} from "../rideaccomodations/RideAccomodations";
import {RideWeatherConditions} from "../rideweatherconditions/RideWeatherConditions";
import _ from 'lodash'

export class RideDetails extends React.Component {

    delta = 0.05;

    constructor(props){
        super(props);
    }
    render() {


        return (
            <View style={styles.container}>
                <AppHeader back={true}/>
                <Text style={styles.pageTitle}>{_.startCase(this.props.ride.location)}</Text>
                <ScrollView style={styles.infoView}>
                    {
                        this.props.ride.geolocation.center? <MapView
                            style={styles.mapView}
                            initialRegion={{
                                longitude: this.props.ride.geolocation.center[0],
                                latitude: this.props.ride.geolocation.center[1],
                                longitudeDelta: this.delta,
                                latitudeDelta: this.delta,
                            }}
                        >
                           <MapView.Marker
                               key={this.props.ride.location}
                               coordinate={{
                                   latitude: this.props.ride.geolocation.center[1],
                                   longitude: this.props.ride.geolocation.center[0],
                               }}
                               title={this.props.ride.location}
                           />
                       </MapView>: null
                    }
                    <View style={styles.details}>
                        <Text style={styles.title}>Information</Text>
                        <RideInfo ride={this.props.ride}/>
                    </View>
                    <View style={styles.accomodations}>
                        <Text style={styles.title}>Accomodations</Text>
                        <RideAccomodations ride={this.props.ride}/>
                    </View>
                    <View style={styles.weatherinfo}>
                        <Text style={styles.title}>Weather Conditions</Text>
                        <RideWeatherConditions ride={this.props.ride}/>
                    </View>
                    <View style={styles.actions}>
                        <RideActions ride={this.props.ride}/>
                    </View>
                </ScrollView>
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

    title: {
        fontSize: 16,
        fontFamily: 'roboto-bold',
        marginLeft:15,
        marginRight:15,
        marginTop: 15,
        padding: 10,
        backgroundColor: '#3d94f3',
        color: '#FFFFFF',
        borderRadius:10
    },
     infoView: {
        flex: 1,
      /*  flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',*/
    },
    mapView: {
        minHeight: 200
    },

    details: {
        minHeight: 400,
        alignItems: 'stretch'
    },
    accomodations: {
        minHeight: 300,
    },
    actions: {
        flex: 1,
        padding:15
    },
    pageTitle: {
        fontSize:18,
        fontFamily: 'monserat',
        paddingTop:20,
        paddingBottom:20,
        textAlign: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 1,
        zIndex:99
    },
});
