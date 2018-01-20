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
import DateTimePicker from 'react-native-modal-datetime-picker';
const moment = require('moment');

class New_Order extends Component {
  constructor(props) {
    super(props);
    this.createNewOrder = this.createNewOrder.bind(this);
    this._showDateTimePicker = this._showDateTimePicker.bind(this);
    this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
    this._handleDatePicked = this._handleDatePicked.bind(this);
    this.state = {
      meals: '',
      pickupDeadline: '',
      description: '',
      isDateTimePickerVisible: false,
    };
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    this.setState({pickupDeadline: moment(date).format('hh:mm a') });
    this._hideDateTimePicker();
  };

    displayAlert(msg) {
      Alert.alert(
    '',
    msg,
    [
      {text: 'OK', onPress: () => ''},
    ],
    { cancelable: false }
  )
    }

    createNewOrder() {
      let empty = false;
      if( this.state.meals === '' || this.state.pickupDeadline === '' ) {
        empty = true;
      }
      if (empty) {
        this.displayAlert('Please fill out all criteria')
      } else {
        axios.get('https://ps-capstone-server.herokuapp.com/shelters')
        .then(shelter_res => {
          if(shelter_res.data.length === 0) {
            this.displayAlert('Sorry, there are no available shelters at this time please try again later');
          } else {
            //google distance api
            let vendorCoords = this.props.user.lat + ',' + this.props.user.lng;
            let shelterCoords = shelter_res.data.map(shelter => {
              return shelter.lat + ',' + shelter.lng;
            }).join('|');
            axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${vendorCoords}&destinations=${shelterCoords}&mode=driving&units=imperial&language=en&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
            .then(maps_res => {
              if(maps_res.data.rows[0].elements[0].status === "ZERO_RESULTS") {
                this.displayAlert('Sorry, there are no available shelters at this time please try again later');
              } else {
                let distanceArr = maps_res.data.rows[0].elements;
                distanceArr = distanceArr.map(el => {
                  let str = el.distance.text.replace(',','');
                  return parseFloat( str.substring(0,str.length - 3) );
                });
                let shortestDistance = distanceArr[0];
                let shortestDistancePos = 0;
                for (let i = 1; i < distanceArr.length; i++) {
                  if(distanceArr[i] < shortestDistance) {
                    shortestDistance = distanceArr[i];
                    shortestDistancePos = i;
                  }
                }
                shortestDistance = '' + shortestDistance;
                let shelterName = shelter_res.data[shortestDistancePos].shelterName;
                let shelterEmail = shelter_res.data[shortestDistancePos].email;
                let shelterLat = shelter_res.data[shortestDistancePos].lat;
                let shelterLng = shelter_res.data[shortestDistancePos].lng;
                console.log('shelterNameHere',shelterName);
                axios.post('https://ps-capstone-server.herokuapp.com/orders', {
                  meals: this.state.meals,
                  businessName: this.props.user.businessName,
                  shelterName: shelterName,
                  businessEmail: this.props.user.email,
                  shelterEmail: shelterEmail,
                  description: this.state.description,
                  vendorLat: this.props.user.lat,
                  vendorLng: this.props.user.lng,
                  shelterLat: shelterLat,
                  shelterLng: shelterLng,
                  vendorToShelter: shortestDistance,
                  pickupDeadline: this.state.pickupDeadline,
                })
                .then(res => {
                  this.setState({
                    meals: '',
                    pickupDeadline: '',
                    description: '',
                  });
                  this.props.setPage('foodvendors');
                  axios.get(`https://ps-capstone-server.herokuapp.com/orders/${this.props.user.email}`)
                  .then(res => {
                    this.props.setOrders(res.data);
                  })
                  .catch(err => {
                    console.log(err);
                  });
                })
                .catch(err => {
                  console.log(err);
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    }

  render() {
    if (this.props.currentPage === 'newOrder') {
      let timeMargin = this.state.pickupDeadline ? 20 : 0;
      return (
        <View style={styles.container}>

          <View style={{width: 200}}>
            <Text style={styles.items}>
              Number of meals:
            </Text>
            <TextInput
              value={this.state.meals}
              onChangeText={(meals) => this.setState({meals})} />
          </View>

          <View style={{width: 200, margin: 10}}>
            <Text style={styles.items}>
              Pickup time by:
            </Text>
            <View style={styles.timeContainer}>
              <Text style={{margin: timeMargin}}>
                {this.state.pickupDeadline}
              </Text>
              <Button
                title="Pick Time"
                color="#3A867B"
                onPress={this._showDateTimePicker} />
              <DateTimePicker
                mode={'time'}
                is24Hour={false}
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker} />
            </View>
          </View>

          <View style={{width: 200}}>
            <Text style={styles.items}>
              description:
            </Text>
            <TextInput
              value={this.state.description}
              onChangeText={(description) => this.setState({description})} />
          </View>

          <Button
            title="Create Posting"
            color="#3A867B"
            onPress={this.createNewOrder}/>

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
  items: {
    textAlign: 'center',
    margin: 4,
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default New_Order;
