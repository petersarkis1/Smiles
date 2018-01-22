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
    this._signOut = this._signOut.bind(this);
    this._deleteOrder = this._deleteOrder.bind(this);
    this.orders = [];
    this.load = false;
    this._refresh();
  }

  _deleteOrder(id) {
    this.props.removeOrder(id);
    setTimeout(() => {
      this._refresh();
    }, 50);
  }

  _refresh() {
    axios.get(`https://ps-capstone-server.herokuapp.com/orders/foodvendors/${this.props.user.email}`)
    .then(res => {
      this.props.setOrders(res.data);
    })
    .catch(err => {
      console.log(err);
    });
    const removeOrder = (id => {this._deleteOrder(id)});
    this.orders = this.props.orders.map((order)=>{
        return <Vendor_Order_Item key={order.id} order={order} removeOrder={removeOrder}/>;
      });
    }

  _signOut() {
    this.props.setPage('login');
    this.props.setUser('');
  }

  render() {
    if (this.props.currentPage === 'foodvendors') {
      if(this.orders.length !== this.props.orders.length) {
        this._refresh();
      }
      if(!this.load) {
        this._refresh();
        this.load = true;
      }

      return (
        <PTRView onRefresh={this._refresh} >
        <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={{margin: 10, color: 'white', fontWeight: 'bold', fontSize: 20}}>Welcome {this.props.user.firstName + ' ' + this.props.user.lastName}</Text>
          <View style={{margin: 10}}>
            <Button
            title="sign out"
            color="#3A867B"
            onPress={() => this._signOut()} />
          </View>
        </View>
          <View style={{margin: 5}}>
          <Button
            title="Add new Meals"
            color="#3A867B"
            onPress={() => this.props.setPage('newOrder')} />
          </View>
          <Text style={styles.orderTitle}>Your Order(s):</Text>
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
      this.load = false;
      return null;
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  navBar: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#474747',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
    color: 'black'
  },
  titleItems: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Home_Vendor;
