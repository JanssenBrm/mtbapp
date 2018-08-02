import React from 'react';
import * as DataActions from '../../actions/DataActions';
import * as AuthActions from '../../actions/AuthActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ActivityIndicator, FlatList, View, StyleSheet} from "react-native";
import {ListItem} from "react-native-elements";
import {Actions} from 'react-native-router-flux';

class RideList extends React.Component {

    constructor(props){
        super(props);

        this.props.getRideData();
    }
    render() {
        console.log("RENDERING", this.props);
        if (this.props.loading) {
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true}/>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <FlatList
                        ref='listRef'
                        data={this.props.rides}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}/>
                </View>
            );
        }
    }

    renderItem({item, index}) {
        return(
                <ListItem
                    title={item.location}
                    subtitle={item.date}
                    onPress={() => {Actions.ridedetail({ride: item})}}
                />
            )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    activityIndicatorContainer:{
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    row:{
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 10
    },

    title:{
        fontSize: 15,
        fontWeight: "600"
    },

    description:{
        marginTop: 5,
        fontSize: 14,
    }
});


function mapStateToProps(state, props) {
    return state.dataReducer
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...DataActions, ...AuthActions}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RideList);