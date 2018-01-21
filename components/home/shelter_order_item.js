import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import axios from 'axios';

class Shelter_Order_Item extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>

        <View style={styles.items}>
          <Text>{this.props.order.meals}</Text>
        </View>
        <View style={styles.items}>
          <Text>{this.props.order.status}</Text>
        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    marginTop: 10
  },
  items: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Shelter_Order_Item;
