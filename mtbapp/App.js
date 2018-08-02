import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from "./components/main/Main";
import Store from "./stores/Store";
import {Provider} from "react-redux";

export default class App extends React.Component {
  render() {
    return (
        <Provider store={Store}>
            <Main/>
        </Provider>
    );
  }
}
