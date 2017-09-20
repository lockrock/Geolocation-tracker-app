import React, { Component } from 'react'
import { Alert, View, Text, TextInput, StyleSheet,  } from 'react-native'
import { Card } from 'react-native-elements'
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
                <Card>
                    <Text style={styles.inputLabel}>Office radius</Text>
                    <TextInput style={[styles.input, { marginTop: 10, }]}
                        keyboardType='numeric'
                        value={this.state.maxDistanceToOffice.toString()}
                        onChangeText={this.distanceInputChanged}
                        onSubmitEditing={this.distanceInputSubmited}
                        ref={ref => { this.distanceInput = ref }}
                    />
                </Card>
                <Card>
                    <Text style={styles.inputLabel}>Office longitude</Text>
                    <TextInput style={styles.input}
                        keyboardType='numeric'
                        value={this.state.officeLongitude.toString()}
                        onChangeText={this.longitudeInputChanged}
                        onSubmitEditing={this.longitudeInputSubmited}
                        ref={ref => { this.longitudeInput = ref }}
                    />
                </Card>
                <Card >
                    <Text style={styles.inputLabel}>Office latitude</Text>
                    <TextInput style={styles.input}
                        keyboardType='numeric'
                        value={this.state.officeLatitude.toString()}
                        onChangeText={this.latitudeInputChanged}
                        onSubmitEditing={this.latitudeInputSubmited}
                        ref={ref => { this.latitudeInput = ref }}
                    />
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputLabel: {
        fontSize: 20,
        paddingLeft: 10,
        color: '#888',
    },
    input: {
        fontSize: 20,
        height: 45,
        paddingLeft: 10,
        color: '#888',
        borderBottomColor: '#888',
    },
})
