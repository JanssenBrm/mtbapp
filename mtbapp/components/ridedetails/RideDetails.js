import React from 'react';
import * as DataActions from '../../actions/DataActions';
import * as AuthActions from '../../actions/AuthActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ActivityIndicator, FlatList, View, StyleSheet, Text} from "react-native";
import {ListItem} from "react-native-elements";
import {AppHeader} from "../header/AppHeader";
import {Actions} from 'react-native-router-flux';
import {MapView} from "expo";

export class RideDetails extends React.Component {

    constructor(props){
        super(props);
    }
    render() {

        return (
            <View style={styles.container}>
                <AppHeader back={true}/>
                <Text style={styles.pageTitle}>{this.props.ride.location}</Text>
                <View style={styles.infoView}>
                    <MapView
                        style={styles.mapView}
                        initialRegion={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    />
                    <View style={styles.details}>
                        <Text>{this.props.ride.location}</Text>
                    </View>
                </View>
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
    infoView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    mapView: {
        flex: 1
    },

    details: {
        flex: 2
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
