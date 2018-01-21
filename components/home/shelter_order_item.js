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

  displayAlert(msg) {
    Alert.alert(
  '',
  msg,
  [
    {text: 'OK', onPress: () => ''},
  ],
  { cancelable: false }
  )
  }

  render() {
    const color = this.props.order.status === 'Delivered' ? '#3A867B' : 'gray';
    return (
      <TouchableOpacity onPress={() => this.displayAlert(
        `Order Information:\n
From: ${this.props.order.businessName}
Number of Meals: ${this.props.order.meals}
Status: ${this.props.order.status}
description: ${this.props.order.description}`
      )}>
      <View style={styles.container}>

        <View style={styles.items}>
          <Text>{this.props.order.meals}</Text>
        </View>
        <View style={styles.items}>
          <Text>{this.props.order.status}</Text>
        </View>
        <View style={styles.items}>
          <Button
            title="Confirm"
            color={color}
            onPress={() => this.props.setPage('newOrder')} />
        </View>

      </View>
      </TouchableOpacity>
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
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Shelter_Order_Item;
