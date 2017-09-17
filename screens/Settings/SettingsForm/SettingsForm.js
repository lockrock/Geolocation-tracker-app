import React, { Component } from 'react'
import { Alert, View, Text, TextInput } from 'react-native'
import cloneDeep from 'lodash.clonedeep'

export default class SettingsForm extends Component {
    constructor(props) {
        super(props)
        const { reportsLogger, officeLongitude, officeLatitude, maxDistanceToOffice } = props
        this.state = { 
            officeLongitude,  
            officeLatitude,
            maxDistanceToOffice
        }
        this.distanceInputChanged = this.distanceInputChanged.bind(this)
        this.distanceInputSubmited = this.distanceInputSubmited.bind(this)
        this.longitudeInputChanged = this.longitudeInputChanged.bind(this)
        this.longitudeInputSubmited = this.longitudeInputSubmited.bind(this)
        this.latitudeInputChanged = this.latitudeInputChanged.bind(this)
        this.latitudeInputSubmited = this.latitudeInputSubmited.bind(this)
    }

    distanceInputChanged(val) {
        this.setState(() => ({maxDistanceToOffice: val}))
    }

    distanceInputSubmited() {
        this.props.onOfficeDistanceUpdated(Number.parseFloat(this.state.maxDistanceToOffice))
    }

    longitudeInputChanged(val) {
        this.setState(() => ({officeLongitude: val}))
    }

    longitudeInputSubmited() {
        this.props.onOfficeLongitudeUpdated(Number.parseFloat(this.state.officeLongitude))
    }

    latitudeInputChanged(val) {
        this.setState(() => ({officeLatitude: val}))
    }

    latitudeInputSubmited() {
        this.props.onOfficeLatitudeUpdated(Number.parseFloat(this.state.officeLatitude))
    }

    render() {
        return (
            <View>
                <Text>Office radius</Text>
                <TextInput
                    keyboardType='numeric'
                    value={this.state.maxDistanceToOffice.toString()}
                    onChangeText={this.distanceInputChanged}
                    onSubmitEditing={this.distanceInputSubmited}
                    ref={ref => { this.distanceInput = ref }}
                />
                <Text>Office longitude</Text>
                <TextInput
                    keyboardType='numeric'
                    value={this.state.officeLongitude.toString()}
                    onChangeText={this.longitudeInputChanged}
                    onSubmitEditing={this.longitudeInputSubmited}
                    ref={ref => { this.longitudeInput = ref }}
                />
                <Text>Office latitude</Text>
                <TextInput
                    keyboardType='numeric'
                    value={this.state.officeLatitude.toString()}
                    onChangeText={this.latitudeInputChanged}
                    onSubmitEditing={this.latitudeInputSubmited}
                    ref={ref => { this.latitudeInput = ref }}
                />
            </View>
        )
    }
}