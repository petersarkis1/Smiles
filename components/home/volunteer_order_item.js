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
    this.state = {
      totalDistance: 1000000000000
    }
  }
  render() {
    const vendorCoords = this.props.order.vendorLat + ',' + this.props.order.vendorLng;
    axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.props.curCoord}&destinations=${vendorCoords}&mode=driving&units=imperial&language=en&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
    .then( res => {
      let toVendor = res.data.rows[0].elements[0].distance.text.replace(',','');
      if (toVendor[toVendor.length - 1] === 't') {
        toVendor = 1;
      } else {
        toVendor = parseFloat( toVendor.substring(0,toVendor.length - 3) );
      }
      this.setState({
        totalDistance: toVendor + parseFloat(this.props.order.vendorToShelter)
      });
    })
    .catch(err => {
      console.log(err);
    });
    if (this.state.totalDistance < this.props.user.maxDistance) {
      return (
        <View style={styles.container}>

        <View style={styles.items}>
        <Text>{this.props.order.meals}</Text>
        </View>
        <View style={styles.items}>
        <Text>{this.props.order.pickupDeadline}</Text>
        </View>
        <View style={styles.items}>
        <Text>{this.state.totalDistance} mi</Text>
        </View>
        <View style={styles.items}>
        <Button
        title="x"
        color="#3A867B"
        onPress={() => console.log('what should i be doing again?')} />
        </View>

        </View>
      );
    } else {
      return null;
    }
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
