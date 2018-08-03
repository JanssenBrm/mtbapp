import {Router, Scene} from "react-native-router-flux";
import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';
import RideList from "../ridelist/RideList";
import {RideDetails} from "../ridedetails/RideDetails";

export default class Main extends Component {
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="ridelist" component={RideList} title="Ride Overview" hideNavBar={true} initial/>
                    <Scene key="ridedetail" component={RideDetails} title="Ride Details" hideNavBar={true}/>
                </Scene>
            </Router>
        );
    }
}