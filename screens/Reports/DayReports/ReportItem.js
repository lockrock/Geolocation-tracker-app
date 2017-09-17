import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import moment from 'moment'

export default function ReportItem(props) {

    const containerHighlight = props.currentStatus === 'inside' ? 
        styles.statusInside : 
        styles.statusOutside

    const status = props.currentStatus.charAt(0).toUpperCase() + 
            props.currentStatus.substring(1, props.currentStatus.length) 

    const time = moment(props.date).fromNow()

    return (
        <View style={[styles.container, containerHighlight]}>
            <Text style={styles.status}>{status}</Text>
            <Text style={styles.time}>{time}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    status: {
        fontSize: 15,
    },
    statusInside: {
        backgroundColor: '#1e88e5',
    },
    statusOutside: {
        backgroundColor: '#ef5350',
    },
    time: {
        fontSize: 15,
    },
})
