/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  BackHandler
} from 'react-native';
import axios from 'axios';

import Login from './components/login';
import SignUp from './components/signup.js';
import New_Order from './components/newOrder.js';
import SignUp_Vendor from './components/signup/signup_vendor';
import SignUp_Volunteer from './components/signup/signup_volunteer';
import SignUp_Shelter from './components/signup/signup_shelter';
import Home_Vendor from './components/home/home_vendor';
import Home_Volunteer from './components/home/home_volunteer';
import Home_Shelter from './components/home/home_shelter';


// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });


export default class App extends Component {
  constructor(props) {
    super(props);
    this.pastPages = [];
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.state = {
      user: '',
      orders: [],
      currentPage: 'login',
    };
    let _this = this;
    BackHandler.addEventListener('hardwareBackPress', function() {
      if(_this.pastPages.length > 0) {
        _this.setState({currentPage: _this.pastPages.pop()});
        return true;
      }
      if (_this.state.currentPage === 'login') {
        return false;
      }
      return true;
    });
  }

  setCurrentPage(nextPage) {
    const rootPages = ['foodvendors','volunteers','shelters','login'];
    if (rootPages.indexOf(nextPage) !== -1) {
      this.pastPages = [];
    } else {
      this.pastPages.push(this.state.currentPage);
    }
    this.setState({currentPage: nextPage});
  }

  removeOrder(id) {
    axios.delete(`https://ps-capstone-server.herokuapp.com/orders/${id}`)
    .then(res => {
      axios.get(`https://ps-capstone-server.herokuapp.com/orders/${this.state.user.email}`)
      .then(res => {
        this.setState({orders: res.data});
      })
      .catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    const setUser = (user => {this.setState({user})});
    const setOrders = (orders => {this.setState({orders})});
    const setPage = (page => {this.setCurrentPage(page)});
    const removeOrder = (id => {this.removeOrder(id)});
    return (
      <View style={{flex:1, backgroundColor: '#F5FCFF'}}>
        <Login
          currentPage={this.state.currentPage}
          setPage={setPage}
          setUser={setUser} />

        <SignUp
          currentPage={this.state.currentPage}
          setPage={setPage} />

        <SignUp_Vendor
          currentPage={this.state.currentPage}
          setPage={setPage}
          setUser={setUser} />

        <SignUp_Volunteer
          currentPage={this.state.currentPage}
          setPage={setPage}
          setUser={setUser} />

        <SignUp_Shelter
          currentPage={this.state.currentPage}
          setPage={setPage}
          setUser={setUser} />

        <Home_Vendor
          currentPage={this.state.currentPage}
          orders={this.state.orders}
          user={this.state.user}
          setUser={setUser}
          setOrders={setOrders}
          setPage={setPage}
          removeOrder={removeOrder} />

        <Home_Volunteer
          currentPage={this.state.currentPage}
          orders={this.state.orders}
          user={this.state.user}
          setUser={setUser}
          setOrders={setOrders}
          setPage={setPage} />

        <Home_Shelter
          currentPage={this.state.currentPage}
          orders={this.state.orders}
          user={this.state.user}
          setUser={setUser}
          setOrders={setOrders}
          setPage={setPage}
          removeOrder={removeOrder} />

        <New_Order
          currentPage={this.state.currentPage}
          user={this.state.user}
          setOrders={setOrders}
          setPage={setPage} />

      </View>
    );
  }
}
