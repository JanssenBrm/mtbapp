import React from 'react';
import * as DataActions from '../../actions/DataActions';
import * as AuthActions from '../../actions/AuthActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ActivityIndicator, FlatList, View, StyleSheet, ScrollView, Image} from "react-native";
import {Divider, Icon, ListItem, Text, Input, Avatar} from "react-native-elements";
import {Actions} from 'react-native-router-flux';
import {AppHeader} from "../header/AppHeader";
import Moment from 'moment-timezone';
import {WEATHER_ICONS} from "../../mapping/weathericons.mapping";
import _ from 'lodash';

class RideList extends React.Component {

    state = {
        search: false
    };

    constructor(props){
        super(props);
        this.props.getRideData(false);
    }
    render() {
        if (this.props.loading) {
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true}/>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <AppHeader/>
                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Overview of rides</Text>
                        <View style={styles.actions}>
                            <Icon name='search' color={this.props.search ? '#3D6DCC' : null} onPress={() => { this.props.toggleSearch(!this.props.search)}}/>
                        </View>
                    </View>


                    {
                        this.props.search ? (
                            <View style={styles.actionBar}>
                                <Input
                                    placeholder='Search for rides'
                                    rightIcon={
                                        <Icon
                                            name='search'
                                        />
                                    }
                                    onChangeText={(text) => { this.props.filterRides(text)}}
                                    containerStyle={styles.searchBar}
                                />
                            </View>
                        ) : null
                    }
                    <FlatList
                        ref='listRef'
                        data={this.filterRides(this.props.rides, this.props.filter)}
                        renderItem={this.getRideListItem}
                        style={styles.listView}
                        onRefresh={() => {this.props.getRideData(true);}}
                        refreshing={this.props.refresh}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            );
        }
    }


    filterRides(rides, filterQuery) {

        return rides.filter(ride => ride.location.indexOf(filterQuery) >= 0);
    }
    getRideListItem({item, index}){
        return (
            <ListItem
                roundAvatar
                key={item.id}
                leftIcon={
                    <Icon
                        name={'directions-bike'}
                        color={'#bfbfbf'}
                        />
                }
                title={
                    <View style={styles.title}>
                        <Text style={styles.title_item}>{_.startCase(item.location)}</Text>
                        <View style={styles.title_info}>
                        {item.traveldistance ? (<Text style={styles.title_item}><Icon name='navigation' size={12} />{item.traveldistance} km</Text>) : null}
                        {item.weatherConditions ? (
                            <Text style={styles.title_item}><Avatar source={WEATHER_ICONS[item.weatherConditions.icon].icon} size='small' containerStyle={styles.weatherIcon} overlayContainerStyle={styles.weatherIconContainer}  /></Text>) : null}
                        </View>
                    </View>
                }
                subtitle={
                    <View style={styles.description}>
                        <Text style={styles.description_item}>{Moment.unix(item.date).format('ddd D MMMM YYYY')}</Text>
                        <Text style={styles.description_item}>{item.distance}</Text>
                    </View>
                }
                onPress={() => {Actions.ridedetail({ride: item})}}
                style={styles.listItem}
            />
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    listView: {
        zIndex:1,
        backgroundColor: 'white'
    },
    listItem: {
        backgroundColor: 'white'
    },

    pageHeader:{
        flex: 0.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding:20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 1,
        zIndex:99
    },

    actionActive: {
      color: '#5a84cc'
    },

    pageTitle: {
        fontSize:18,
        fontFamily: 'monserat',
        textAlign: 'center',
        flex:6
    },

    title:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    title_item: {
        fontSize: 15,
        fontFamily: 'roboto-bold'
    },

    title_info: {
        flexDirection: 'row',
    },

    description:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    description_item:{
        marginTop: 5,
        fontSize: 12,
        fontFamily: 'roboto'
    },
    activityIndicatorContainer:{
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    searchBar:{
        paddingLeft:20,
        paddingRight:20,
        paddingBottom: 5,
        paddingTop:5,
        backgroundColor: 'white',
        margin:10,
        borderRadius: 50
    },

    actionBar: {
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'center'
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


function mapStateToProps(state, props) {
    return state.dataReducer
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...DataActions, ...AuthActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RideList);