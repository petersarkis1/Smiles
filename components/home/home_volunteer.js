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
import openMap from 'react-native-open-maps';
import axios from 'axios';
import PTRView from 'react-native-pull-to-refresh';
import Volunteer_Order_Item from './volunteer_order_item.js';

class Home_Volunteer extends Component {
  constructor(props) {
    super(props);
    this._refresh = this._refresh.bind(this);
    this._signOut = this._signOut.bind(this);
    this._progress = this._progress.bind(this);
    this._setCurrentOrder = this._setCurrentOrder.bind(this);
    this._updateStatus = this._updateStatus.bind(this);
    this.displayAlert = this.displayAlert.bind(this);
    this.state = {
      orderComponents: [],
      currentOrder: null,
      distanceTo: null,
    };
    this.load = false;
    _this = this;
    setInterval(function(){
      console.log(_this.state.currentOrder);
      console.log(typeof (_this.state.currentOrder));
      if(_this.state.currentOrder) {
        navigator.geolocation.getCurrentPosition(pos => {
          const curCoord = pos.coords.latitude + ',' + pos.coords.longitude;
          let destinationCoords = _this.state.currentOrder.vendorLat + ',' + _this.state.currentOrder.vendorLng;
          axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${curCoord}&destinations=${destinationCoords}&mode=driving&units=imperial&language=en&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
          .then(res => {
            _this.setState({distanceTo: res.data.rows[0].elements[0].distance.text});
          })
          .catch(err => {
            console.log(err);
          });
        });
      }
    }, 30000);
  }

  _setCurrentOrder(index) {
    if(!this.state.currentOrder) {
      let tempOrderComponents = this.state.orderComponents;
      tempOrderComponents.splice(index,1);
      let tempOrders = this.props.orders;
      let CO = tempOrders.splice(index,1)[0];
      CO.status = 'Pickup';
      this.setState({currentOrder: CO});
      this.props.setOrders(tempOrders);
      this.setState({orderComponents : tempOrderComponents});
      axios.patch(`https://ps-capstone-server.herokuapp.com/orders/volunteer/${CO.id}`,{
        volunteerName : this.props.user.firstName + ' ' + this.props.user.lastName,
        volunteerEmail: this.props.user.email,
      })
      .then(res => {
      })
      .catch(err => {
        console.log(err);
      });
      navigator.geolocation.getCurrentPosition(pos => {
        const curCoord = pos.coords.latitude + ',' + pos.coords.longitude;
        let destinationCoords = this.state.currentOrder.vendorLat + ',' + this.state.currentOrder.vendorLng;
        axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${curCoord}&destinations=${destinationCoords}&mode=driving&units=imperial&language=en&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
        .then(res => {
          this.setState({distanceTo: res.data.rows[0].elements[0].distance.text});
        })
        .catch(err => {
          console.log(err);
        });
      });
    }
  }

  _progress() {
    if(this.state.currentOrder.status === 'Complete') {
      Alert.alert(
        '',
        `Please wait for Shelter Confirmation`,
        [
          {text: 'OK', onPress: () => this._refresh()},
        ],
        { cancelable: false }
      )
    }
    if(this.state.currentOrder.status === 'Delivery') {
      Alert.alert(
        '',
        `Order delivered to ${this.state.currentOrder.shelterName}?`,
        [
          {text: 'Cancel', onPress: () => ''},
          {text: 'Confirm', onPress: () => {
            let temp = this.state.currentOrder;
            temp.status = 'Complete';
            this.setState({currentOrder: temp});
            this._updateStatus('Complete');
          }},
        ],
        { cancelable: false }
      )
    }
    if(this.state.currentOrder.status === 'Pickup') {
      Alert.alert(
        '',
        `Order picked up from ${this.state.currentOrder.businessName}?`,
        [
          {text: 'Cancel', onPress: () => ''},
          {text: 'Confirm', onPress: () => {
            let temp = this.state.currentOrder;
            temp.status = 'Delivery';
            this.setState({currentOrder: temp});
            this._updateStatus('Delivery');
          }},
        ],
        { cancelable: false }
      )
    }
  }

  _updateStatus(newStatus) {
    axios.patch(`https://ps-capstone-server.herokuapp.com/orders/status/${this.state.currentOrder.id}`,{
      status: newStatus,
    })
    .then(() => {
    })
    .catch(err => {
      console.log(err);
    });
  }

  _refresh() {
    axios.get(`https://ps-capstone-server.herokuapp.com/orders/volunteers/${this.props.user.email}`)
    .then(res => {
        this.setState({currentOrder: res.data});
        if(res.data) {
        navigator.geolocation.getCurrentPosition(pos => {
          const curCoord = pos.coords.latitude + ',' + pos.coords.longitude;
          let destinationCoords = this.state.currentOrder.vendorLat + ',' + this.state.currentOrder.vendorLng;
          axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${curCoord}&destinations=${destinationCoords}&mode=driving&units=imperial&language=en&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
          .then(res => {
            this.setState({distanceTo: res.data.rows[0].elements[0].distance.text});
          })
          .catch(err => {
            console.log(err);
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
    });


    axios.get('https://ps-capstone-server.herokuapp.com/orders/open')
    .then(res => {
      this.props.setOrders(res.data);
    })
    .catch(err => {
      console.log(err);
    });
    navigator.geolocation.getCurrentPosition(pos => {
    let promises = this.props.orders.map((order,i)=>{
        const curCoord = pos.coords.latitude + ',' + pos.coords.longitude;
        const vendorCoords = order.vendorLat + ',' + order.vendorLng;
        return axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${curCoord}&destinations=${vendorCoords}&mode=driving&units=imperial&language=en&key=AIzaSyBbA2R_64ojDk8R5juL5kpfYE5ITJR0zpI`)
        .then( res => {
          let toVendor = res.data.rows[0].elements[0].distance.text.replace(',','');
          if (toVendor[toVendor.length - 1] === 't') {
            toVendor = 1;
          } else {
            toVendor = parseFloat( toVendor.substring(0,toVendor.length - 3) );
          }
          const totalDistance = toVendor + parseFloat(order.vendorToShelter);
          const setCO = (index => {this._setCurrentOrder(index)});
          return ({
            distance: totalDistance,
            comp: <Volunteer_Order_Item key={order.id} order={order} user={this.props.user} totalDistance={totalDistance} index={i} setCO={setCO}/>
          });
        })
        .catch(err => {
          console.log(err);
        });
      });
      Promise.all(promises).then((results) => {
        results.sort((a, b) => {
          return a.distance - b.distance;
        });
        results = results.map(order => {
          return order.comp;
        });
        this.setState({orderComponents: results});
      });
    });
  }

  _signOut() {
    this.props.setPage('login');
    this.props.setUser('');
  }

  displayAlert(msg) {
    let lat;
    let lng;
    if (this.state.currentOrder.status === 'Pickup') {
      lat = this.state.currentOrder.vendorLat;
      lng = this.state.currentOrder.vendorLng;
    } else {
      lat = this.state.currentOrder.shelterLat;
      lng = this.state.currentOrder.shelterLng;
    }
    Alert.alert(
  '',
  msg,
  [
    {text: 'Open Maps', onPress: () => openMap({ latitude: lat, longitude: lng })},
    {text: 'OK', onPress: () => ''},
  ],
  { cancelable: false }
  )
  }

  render() {
    if (this.props.currentPage === 'volunteers') {
      if(this.state.orderComponents.length !== this.props.orders.length) {
        this._refresh();
      }
      if(!this.load) {
        this._refresh();
        this.load = true;
      }

      let curOrderContainer;
      if (this.state.currentOrder) {
        let curOrderDistance;

        curOrderContainer = (
          <View style={styles.container}>
          <View style={styles.title}>
            <View style={styles.titleItems}>
              <Text>Pickup By:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Segment:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Status:</Text>
            </View>
            <View style={styles.titleItems}>
              <Text>Advance:</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => this.displayAlert(
            `Order Information:\n
    From: ${this.state.currentOrder.businessName}
    To: ${this.state.currentOrder.shelterName}
    Number of Meals: ${this.state.currentOrder.meals}
    Pick up by: ${this.state.currentOrder.pickupDeadline}
    Distance to Next Stop: ${this.state.distanceTo}
    description: ${this.state.currentOrder.description}`
          )}>
          <View style={styles.innerContainer}>
          <View style={styles.items}>
          <Text>{this.state.currentOrder.pickupDeadline}</Text>
          </View>
          <View style={styles.items}>
          <Text>{this.state.distanceTo}</Text>
          </View>
          <View style={styles.items}>
          <Text>{this.state.currentOrder.status}</Text>
          </View>
          <View style={styles.items}>
          <Button
          title="=>"
          color="#3A867B"
          onPress={() => this._progress()} />
          </View>
          </View>
          </TouchableOpacity>
          </View>
        );
      } else {
        curOrderContainer = <Text style={{marginLeft: 10}}>No ongoing order</Text>;
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
        <Text style={styles.orderTitle}>Current Order:</Text>
        {curOrderContainer}
        <Text style={styles.orderTitle}>Available Order(s):</Text>
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
            {this.state.orderComponents}
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
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    marginTop: 10
  },
  navBar: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#474747',
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
    color: 'black'
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
  },
  items: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home_Volunteer;
