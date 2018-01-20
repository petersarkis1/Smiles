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
    this.curCoord = '';
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
    this.orders = this.props.orders.map((order)=>{
      return <Volunteer_Order_Item key={order.id} order={order} curCoord={this.curCoord} user={this.props.user}/>;
    });
  }

  render() {
    if (this.props.currentPage === 'volunteers') {
      if(this.orders.length !== this.props.orders.length) {
        this._refresh();
      }
      this.orders = this.props.orders.map((order)=>{
        return <Volunteer_Order_Item key={order.id} order={order} curCoord={this.curCoord} user={this.props.user}/>;
      });
      navigator.geolocation.getCurrentPosition(pos => {
        this.curCoord = pos.coords.latitude + ',' + pos.coords.longitude;
      });
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
