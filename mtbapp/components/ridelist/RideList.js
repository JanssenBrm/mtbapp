import React from 'react';
import * as DataActions from '../../actions/DataActions';
import * as AuthActions from '../../actions/AuthActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ActivityIndicator, FlatList, View, StyleSheet, ScrollView} from "react-native";
import {Divider, Icon, ListItem, Text} from "react-native-elements";
import {Actions} from 'react-native-router-flux';
import {AppHeader} from "../header/AppHeader";
import Moment from 'moment-timezone';

class RideList extends React.Component {

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
                    <Text style={styles.pageTitle}>Overview of rides</Text>
                    <FlatList
                        ref='listRef'
                        data={this.props.rides}
                        renderItem={this.getRideListItem}
                        style={styles.listView}
                        onRefresh={() => {this.props.getRideData(true);}}
                        refreshing={this.props.refresh}
                    />
                </View>
            );
        }
    }


    getRideListItem({item, index}){
        return (
            <ListItem
                roundAvatar
                key={item.id}
                leftIcon={{name: 'directions-bike'}}
                title={
                    <View style={styles.title}>
                        <Text style={styles.title_item}>{item.location}</Text>
                        {item.traveldistance ? (<Text style={styles.title_item}><Icon name='navigation' size='12'/>{item.traveldistance} km</Text>) : null}
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

    title:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    title_item: {
        fontSize: 15,
        fontFamily: 'roboto-bold'
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
    }


});


function mapStateToProps(state, props) {
    return state.dataReducer
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...DataActions, ...AuthActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RideList);