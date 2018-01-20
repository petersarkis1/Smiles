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

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if(this.props.currentPage === 'signup') {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.text}> Sign up as a ____ </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.props.setPage('signup_vendor')}
            style={styles.vender}>
            <Text style={styles.text}> Food Vendor </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.setPage('signup_volunteer')}
            style={styles.volunteer}>
            <Text style={styles.text}> Volunteer </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.setPage('signup_shelter')}
            style={styles.shelter}>
            <Text style={styles.text}> Homeless shelter </Text>
          </TouchableOpacity>
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
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  title: {
    height: '13%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1FAEE',
  },
  vender: {
    height: '29%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A8DADC',
  },
  volunteer: {
    height: '29%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#457B9D',
  },
  shelter: {
    height: '29%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D3557',
  },
  text : {
    fontSize: 40,
    color: '#545556'
  },
});

export default SignUp;
