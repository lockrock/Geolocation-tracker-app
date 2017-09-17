// @flow
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TabNavigator, DrawerNavigator } from 'react-navigation'
import SettingsScreen from './screens/Settings/SettingsScreen'
import ReportsScreen from './screens/Reports/ReportsScreen'

import { watchDistance } from './services/checkIfInside/checkIfInside'
import ReportsLogger from './services/reports'
import { getOfficeCoords, setOfficeCoords, setMaxDistanceToOffice, getMaxDistanceToOffice } from './services/officeCoords'

const reportsLogger = new ReportsLogger()

const AppDrawer = DrawerNavigator({
  Settings: {
    screen: SettingsScreen,
  },
  Reports: {
    screen: ReportsScreen,
  }
}, {
  drawerPosition: 'left',
  drawerWidth: 250,
})

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      maxDistanceToOffice: 100,
      officeCoords: {
        longitude: 0,
        latitude: 0,
      },
      settingsReady: false,
      reportsLog: [],
    }
    this.reportsLogger = reportsLogger
    this.reportsLogger.getFullLog() //populate cache
    .then(() => getMaxDistanceToOffice({ defaultDistance: this.state.maxDistanceToOffice }))
    .then(maxDistanceToOffice => { this.setState({ maxDistanceToOffice }) })
    .then(()=>{
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(({coords:{longitude, latitude}}) => {
          resolve(
            getOfficeCoords({defaultCoords: {longitude, latitude}})
              .then((officeCoords) => { 
                this.setState(() => ({officeCoords, settingsReady: true})) 
                return officeCoords
              })
          )
        })
      }) 
    })
    .then((officeCoords)=>{
      this.distanceWatcher = watchDistance(
        distanceToOffice=>{
          this.reportsLogger.logStatusChange(distanceToOffice < this.state.maxDistanceToOffice ? 'inside' : 'outside')
            .then(() => this.reportsLogger.getFullLog())
            .then((log) => {
              this.setState(() => ({reportsLog: log.slice().reverse()}))
            })
          this.setState({distanceToOffice, distanceError: null})
        }, 
        distanceError=>{
          this.setState({distanceError, distanceToOffice: null})
        }, {
          officeCoords
        }
      )
    })



    this.updateOfficeLongitude = this.updateOfficeLongitude.bind(this)
    this.updateOfficeLatitude = this.updateOfficeLatitude.bind(this)
    this.updateOfficeDistance = this.updateOfficeDistance.bind(this)
  }
  
  updateOfficeLongitude(longitude) {
    return setOfficeCoords({
      longitude,
      latitude: this.state.officeCoords.latitude
    })
      .then(() => { this.setState((prevState) => ({officeCoords: { ...prevState.officeCoords, longitude }})) })
      .then(() => this.distanceWatcher.updateOfficeCoords(this.state.officeCoords))
  }
  updateOfficeLatitude(latitude) {
    return setOfficeCoords({
      latitude,
      longitude: this.state.officeCoords.longitude
    })
      .then(() => { this.setState((prevState) => ({officeCoords: { ...prevState.officeCoords, latitude }})) })
      .then(() => this.distanceWatcher.updateOfficeCoords(this.state.officeCoords))
  }
  updateOfficeDistance(distance) {
    return setMaxDistanceToOffice(distance)
      .then(() => { this.setState(() => ({ maxDistanceToOffice: distance })) })
  }

  render() {
    return (
      <View style={styles.container}>
        
          {
            this.state.distanceError ?
            <Text style={styles.distanceContainer}>Error: {this.state.distanceError}</Text> : null
          }
          {
            this.state.distanceToOffice ? 
              ( (this.state.distanceToOffice > this.state.maxDistanceToOffice) ? 
                <Text style={styles.distanceContainer}>Distance to office: {Math.round(this.state.distanceToOffice)} meters</Text> :
                <Text style={styles.distanceContainer}>You are at office!</Text>
              ): 
              null
          }
        
        <AppDrawer screenProps={{
          reportsLogger: this.reportsLogger, 
          maxDistanceToOffice: this.state.maxDistanceToOffice, 
          officeLatitude: this.state.officeCoords.latitude,
          officeLongitude: this.state.officeCoords.longitude,
          settingsReady: this.state.settingsReady,
          reportsLog: this.state.reportsLog,
          onOfficeLongitudeUpdated: this.updateOfficeLongitude,
          onOfficeLatitudeUpdated: this.updateOfficeLatitude,
          onOfficeDistanceUpdated: this.updateOfficeDistance,
          }} />
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'flex-stretch',
  },
  distanceContainer: {
    fontSize: 20,
    padding: 5,
    marginBottom: 5,
  }
});
