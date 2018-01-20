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
import Vendor_Order_Item from './vendor_order_item.js';

class Home_Vendor extends Component {
  constructor(props) {
    super(props);
    this._refresh = this._refresh.bind(this);
    this.orders = [];
    this._refresh();
  }

  _refresh() {
    axios.get(`https://ps-capstone-server.herokuapp.com/orders/${this.props.user.email}`)
    .then(res => {
      this.props.setOrders(res.data);
    })
    .catch(err => {
      console.log(err);
    });
    this.orders = this.props.orders.map((order)=>{
        return <Vendor_Order_Item key={order.id} order={order} removeOrder={this.props.removeOrder}/>;
      });
    }

  render() {
    if (this.props.currentPage === 'foodvendors') {
      if(this.orders.length !== this.props.orders.length) {
        this._refresh();
      }
      return (
        <PTRView onRefresh={this._refresh} >
        <View style={styles.container}>
          <View>
          <Button
            title="Add new Meals"
            color="#3A867B"
            onPress={() => this.props.setPage('newOrder')} />
          </View>
          <View style={styles.title}>
            <View style={styles.titleItems}>
              <Text>Meals:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Pickup By:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Status:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Delete</Text>
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

export default Home_Vendor;
