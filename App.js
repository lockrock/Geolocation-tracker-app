// @flow
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native';
import { TabNavigator, DrawerNavigator, NavigationActions } from 'react-navigation'
import { Header } from 'react-native-elements'
import SettingsScreen from './screens/Settings/SettingsScreen'
import DayReportsScreen from './screens/Reports/DayReports/DayReportsScreen'

import { watchDistance } from './services/checkIfInside/checkIfInside'
import ReportsLogger from './services/reports'
import { getOfficeCoords, setOfficeCoords, setMaxDistanceToOffice, getMaxDistanceToOffice } from './services/officeCoords'

const reportsLogger = new ReportsLogger()

function withNav(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props)
      this.navigation = props.navigation
      this.openDrawer = this.openDrawer.bind(this)
    }
    openDrawer() {
      this.navigation.navigate('DrawerOpen')
    }
    render() {
      return (
        <View style={styles.screenWrapper}>
          <Header
            style={styles.header}
            leftComponent={{ icon: 'menu', color: '#fff', onPress: this.openDrawer }}
            centerComponent={{ text: 'SMART TRACKER', style: { color: '#fff' } }}
          />

          <WrappedComponent {...this.props} />
        </View>
      )
    }
  }
}

const SettingsWithNav = withNav(SettingsScreen)
const ReportsWithNav = withNav(DayReportsScreen)

const AppDrawer = DrawerNavigator({
  Settings: {
    screen: SettingsWithNav,
  },
  Reports: {
    screen: ReportsWithNav,
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
              this.setState(() => ({reportsLog: log.slice()}))
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
    this.openDrawer = this.openDrawer.bind(this)
  }
  
  openDrawer() {
    // this.navigator.navigate('DrawerOpen')
    Alert.alert('', JSON.stringify(this.navigator.props.navigation))
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
          distanceToOffice: this.state.distanceToOffice,
          distanceError: this.state.distanceError,
          containerStyle: styles.screenContainer,
          }} 
          ref={nav=>{this.navigator=nav}}
          />
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    flex: 1,
    backgroundColor: '#b3e5fc',
  },
  screenWrapper: {
    flex: 1,
  },
  screenContainer: {
    // flex: 1,
  },
  header: {
    backgroundColor: '#0288d1',
    height: 50,
    padding: 15,
  }
});
