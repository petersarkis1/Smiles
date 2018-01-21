import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Alert,
} from 'react-native';
import axios from 'axios';


class Login extends Component {
  constructor(props) {
  super(props);
  this.canAttempt = true;
  this.attemptLogin = this.attemptLogin.bind(this);
  this.displayAlert = this.displayAlert.bind(this);
  this.state = { email: '', password: ''};
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

  //button is pressed with login credentials
  attemptLogin() {
    if (this.canAttempt) {
      let email = this.state.email;
      let password = this.state.password;
      //one of the input boxes is empty
      if(!email || !password) {
        this.displayAlert('Please fill out both email and password');
      }
      else {
        this.canAttempt = false;
        //DB check for credentials
        axios.post('https://ps-capstone-server.herokuapp.com/auth/login', {
          email: email,
          password: password
        })
        .then(res => {
          this.canAttempt = true;
          if (res.data === 'invalid login') {
            this.displayAlert('Invalid email or password');
          } else {
            let page = res.data.currentPage;
            delete res.data.currentPage;
            this.props.setUser(res.data);
            this.props.setPage(page);
            this.setState({
              email: '',
              password: '',
            });
          }
        })
        .catch(err => {
          this.canAttempt = true;
          this.displayAlert('Cannot log in at this time please try again later');
        });
      }
    }
  }

  render() {
    if(this.props.currentPage === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Smiles!
        </Text>
        <View style={{width: 200}}>
          <Text style={styles.instructions}>
            Email:
          </Text>
          <TextInput style={styles.credentials}
            value={this.state.email}
            onChangeText={(email) => this.setState({email})} />
        </View>
        <View style={{width: 200}}>
          <Text style={styles.instructions}>
            Password:
          </Text>
          <TextInput style={styles.credentials}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})} />
        </View>
        <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={this.attemptLogin} />
        <Button
          title="Create Account"
          color="#ff5c5c"
          onPress={() => this.props.setPage('signup')} />
        </View>
      </View>
    );
  }
  else {
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20
  },
});

export default Login;
