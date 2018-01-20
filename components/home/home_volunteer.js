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
import PTRView from 'react-native-pull-to-refresh';
import Volunteer_Order_Item from './volunteer_order_item.js';

class Home_Volunteer extends Component {
  constructor(props) {
    super(props);
    this._refresh = this._refresh.bind(this);
    this.orders = [];
    this._refresh();
  }

  _refresh() {
    axios.get('https://ps-capstone-server.herokuapp.com/orders')
    .then(res => {
      this.props.setOrders(res.data);
    })
    .catch(err => {
      console.log(err);
    });
    navigator.geolocation.getCurrentPosition(pos => {
    let promises = this.props.orders.map((order)=>{
        const curCoord = pos.coords.latitude + ',' + pos.coords.longitude;
        const vendorCoords = order.vendorLat + ',' + order.vendorLng;
        return axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${curCoord}&destinations=${vendorCoords}&mode=driving&units=imperial&language=en&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
        .then( res => {
          let toVendor = res.data.rows[0].elements[0].distance.text.replace(',','');
          if (toVendor[toVendor.length - 1] === 't') {
            toVendor = 1;
          } else {
            toVendor = parseFloat( toVendor.substring(0,toVendor.length - 3) );
          }
          const totalDistance = toVendor + parseFloat(order.vendorToShelter);
          console.log('aaaaa',totalDistance);
          return ({
            distance: totalDistance,
            comp: <Volunteer_Order_Item key={order.id} order={order} curCoord={this.curCoord} user={this.props.user} totalDistance={totalDistance} />
          });
        })
        .catch(err => {
          console.log(err);
        });
      });
      Promise.all(promises).then((results) => {
        console.log('seeeeee',results);
        results.sort((a, b) => {
          return a.distance - b.distance;
        });
        results = results.map(order => {
          return order.comp;
        });
        this.orders = results;
      });
    });
  }

  render() {
    if (this.props.currentPage === 'volunteers') {
      if(this.orders.length !== this.props.orders.length) {
        this._refresh();
      }
      return (
        <PTRView onRefresh={this._refresh} >
        <View style={styles.container}>

          <View style={styles.title}>
            <View style={styles.titleItems}>
              <Text>Meals:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Pickup By:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Distance:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Accept</Text>
            </View>
          </View>

          <View style={styles.container}>
            {this.orders}
          </View>

        </View>
        </PTRView>
      );
    } else {
      return null;
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6
  },
  titleItems: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Home_Volunteer;
