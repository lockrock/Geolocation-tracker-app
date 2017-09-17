import React, { Component } from 'react'
import { Alert, View, Text, TextInput, StyleSheet } from 'react-native'
import SettingsForm from './SettingsForm/SettingsForm'

export default class SettingsScreen extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
            {
                this.props.screenProps.settingsReady ?
                <SettingsForm 
                        maxDistanceToOffice={this.props.screenProps.maxDistanceToOffice}
                        officeLatitude={this.props.screenProps.officeLatitude}
                        officeLongitude={this.props.screenProps.officeLongitude}
                        onOfficeLongitudeUpdated={this.props.screenProps.onOfficeLongitudeUpdated}
                        onOfficeLatitudeUpdated={this.props.screenProps.onOfficeLatitudeUpdated}
                        onOfficeDistanceUpdated={this.props.screenProps.onOfficeDistanceUpdated}
                /> :
                <Text style={styles.container}>Settings is loading</Text>
            }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // fontSize: 15
    },
})
