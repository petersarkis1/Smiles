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

class SignUp_Volunteer extends Component {
  constructor(props) {
    super(props);
    this.createNewVolunteer = this.createNewVolunteer.bind(this);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      maxDistance: '',
    };
  }

  displayAlert(msg) {
    let password = '';
    Alert.alert(
  '',
  msg,
  [
    {text: 'OK', onPress: () => this.setState({password})},
  ],
  { cancelable: false }
)
  }

  createNewVolunteer() {
    let empty = false;
    for (let val in this.state) {
      if( this.state[val] === '' ) {
        empty = true;
      }
    }
    if (empty) {
      this.displayAlert('Please fill out all criteria')
    } else {
      //create volunteer account in db
      axios.post('https://ps-capstone-server.herokuapp.com/volunteers/signup', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        password: this.state.password,
        maxDistance: this.state.maxDistance,
      })
      .then(res => {
        if (res.data === 'email already registered') {
          this.displayAlert('This email has already been registered');
        }
        else {
          this.props.setUser({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            maxDistance: this.state.maxDistance,
          });
          this.props.setPage('volunteers');
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  render() {
    if(this.props.currentPage === 'signup_volunteer') {
      return (
        <View style={styles.container}>

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

          <View style={{width: 200}}>
            <Text>
              Max distance willing to drive:
            </Text>
            <TextInput
              value={this.state.maxDistance}
              onChangeText={(maxDistance) => this.setState({maxDistance})} />
          </View>

          <Button
            title="Create Account"
            color="#ff5c5c"
            onPress={this.createNewVolunteer}/>

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

export default SignUp_Volunteer;
