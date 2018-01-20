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
} from 'react-native';
import axios from 'axios';

class SignUp_Vendor extends Component {
  constructor(props) {
    super(props);
    this.createNewVendor = this.createNewVendor.bind(this);
    this.state = {
      businessName: '',
      address: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    };
  }

  displayAlert(msg) {
    let password = '';
    Alert.alert(
  '',
  msg,
  [
    {text: 'OK'},
  ],
  { cancelable: false }
)
  }

  createNewVendor() {
    let empty = false;
    for (let val in this.state) {
      if( this.state[val] === '' ) {
        empty = true;
      }
    }
    if (empty) {
      this.displayAlert('Please fill out all criteria')
    } else {
      //create vendor account in db
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.address.replace(' ','+')}&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
      .then(res => {
        let lat = '' + res.data.results[0].geometry.location.lat;
        let lng = '' + res.data.results[0].geometry.location.lng;
        axios.post('https://ps-capstone-server.herokuapp.com/foodvendors/signup', {
          businessName: this.state.businessName,
          lat: lat,
          lng: lng,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          phoneNumber: this.state.phoneNumber,
          password: this.state.password,
        })
        .then(res => {
          if (res.data === 'email already registered') {
            this.displayAlert('This email has already been registered');
          }
          else {
            this.props.setUser({
              businessName: this.state.businessName,
              lat: lat,
              lng: lng,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              email: this.state.email,
              phoneNumber: this.state.phoneNumber,
            });
            this.props.setPage('foodvendors');
          }
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  render() {
    if(this.props.currentPage === 'signup_vendor') {
      return (
        <View style={styles.container}>

          <View style={{width: 200}}>
            <Text>
              Business Name:
            </Text>
            <TextInput
              value={this.state.businessName}
              onChangeText={(businessName) => this.setState({businessName})} />
          </View>

          <View style={{width: 200}}>
            <Text>
              Address:
            </Text>
            <TextInput
              value={this.state.address}
              onChangeText={(address) => this.setState({address})} />
          </View>

          <View style={{width: 200}}>
            <Text>
              First Name:
            </Text>
            <TextInput
              value={this.state.firstName}
              onChangeText={(firstName) => this.setState({firstName})} />
          </View>

          <View style={{width: 200}}>
            <Text>
              Last Name:
            </Text>
            <TextInput
              value={this.state.lastName}
              onChangeText={(lastName) => this.setState({lastName})} />
          </View>

          <View style={{width: 200}}>
            <Text>
              Email:
            </Text>
            <TextInput
              value={this.state.email}
              onChangeText={(email) => this.setState({email})} />
          </View>

          <View style={{width: 200}}>
            <Text>
              Phone number:
            </Text>
            <TextInput
              value={this.state.phoneNumber}
              onChangeText={(phoneNumber) => this.setState({phoneNumber})} />
          </View>

          <View style={{width: 200}}>
            <Text>
              Password:
            </Text>
            <TextInput
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(password) => this.setState({password})} />
          </View>

          <Button
            title="Create Account"
            color="#ff5c5c"
            onPress={this.createNewVendor}/>

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
    backgroundColor: '#F5FCFF',
  },
});

export default SignUp_Vendor;
