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
          <View style={styles.items}>
          <Button
            title = 'Food Vendor'
            color="#3A867B"
            onPress={() => this.props.setPage('signup_vendor')}/>
          </View>
          <View style={styles.items}>
          <Button
            title = 'Volunteer'
            color="#3A867B"
            onPress={() => this.props.setPage('signup_volunteer')}/>
          </View>
          <View style={styles.items}>
          <Button
            title = 'Shelter'
            color="#3A867B"
            onPress={() => this.props.setPage('signup_shelter')}/>
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
    backgroundColor: '#F5FCFF',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  items: {
    margin: 8,
    width: 200
  },
  text : {
    fontSize: 24,
  },
});

export default SignUp;
