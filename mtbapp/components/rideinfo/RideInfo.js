import React from 'react';
import {ActivityIndicator, FlatList, View, StyleSheet, Text} from "react-native";
import Moment from 'moment-timezone';
import {ListItem} from "react-native-elements";
import _ from 'lodash';

export class RideInfo extends React.Component {


    info = [];


    constructor(props){
        super(props);

        this.info.push({key: 'Date', value: Moment.unix(this.props.ride.date).format('ddd D MMMM YYYY')});
        this.info.push({key: 'Address', value: `${_.startCase(this.props.ride.address.location)}, ${_.startCase(this.props.ride.address.street)}, ${_.startCase(this.props.ride.address.city)}`});
        this.info.push({key: 'Start', value: this.props.ride.time});
        this.info.push({key: 'Distance', value: this.props.ride.distance});
        this.info.push({key: 'Price', value: this.props.ride.price});
    }
    render() {

        return (
            <View style={styles.list}>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.info}
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
