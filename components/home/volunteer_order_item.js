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
  ScrollView,
} from 'react-native';
import axios from 'axios';

class Volunteer_Order_Item extends Component {
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
    const color = this.props.user.maxDistance < this.props.totalDistance ? 'red' : 'gray';
      return (
        <TouchableOpacity onPress={() => this.displayAlert(
          `Order Information:\n
  From: ${this.props.order.businessName}
  To: ${this.props.order.shelterName}
  Number of Meals: ${this.props.order.meals}
  Pick up by: ${this.props.order.pickupDeadline}
  Total Distance: ${this.props.totalDistance} mi
  description: ${this.props.order.description}`
        )}>
        <View style={styles.container}>

        <View style={styles.items}>
        <Text>{this.props.order.meals}</Text>
        </View>
        <View style={styles.items}>
        <Text>{this.props.order.pickupDeadline}</Text>
        </View>
        <View style={styles.items}>
        <Text style={{color}}>
        {this.props.totalDistance} mi
        </Text>
        </View>
        <View style={styles.items}>
        <Button
        title="✓"
        color="#3A867B"
        onPress={() => this.displayAlert('what should i be doing again?')} />
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
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Volunteer_Order_Item;
