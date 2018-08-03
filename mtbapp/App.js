import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import Main from "./components/main/Main";
import Store from "./stores/Store";
import {Provider} from "react-redux";
import { Font } from 'expo';

export default class App extends React.Component {

    state = {
        fontsLoaded: false,
    };


    async componentDidMount() {
        await Font.loadAsync({
            'monserat': require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
            'roboto': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
            'roboto-bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
        });


        this.setState({ fontsLoaded: true });

    }

  render() {
    return (

        this.state.fontsLoaded ? (
            <Provider store={Store}>
                <Main/>
            </Provider>
        ):(
            <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator animating={true}/>
            </View>
        )
    );
  }
}

const styles = StyleSheet.create({

    activityIndicatorContainer: {
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    }
});
