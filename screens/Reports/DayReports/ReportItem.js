import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Card } from 'react-native-elements'
import moment from 'moment'

export default function ReportItem(props) {

    const status = props.currentStatus.charAt(0).toUpperCase() + 
            props.currentStatus.substring(1, props.currentStatus.length) 

    const time = moment(props.date).fromNow()
    const startDate = moment(props.date).format('hh:mm DD/MM/YYYY')
    const endDate = props.endDate ? moment(props.endDate).format('hh:mm DD/MM/YYYY') : 'now'

    return (
        <View style={[styles.container]}>
            <View style={styles.header}>
                <Text style={styles.status}>{status}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>
            <View style={styles.timeRangeContainer}>
                <Text style={styles.timeRange}>{startDate} - {endDate}</Text>
            </View>
        </View>
    )
}

const textColor = '#777',
    borderColor = '#ddd'

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: 10,
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        height: 70,
    },
    status: {
        alignSelf: 'flex-start',
        fontSize: 15,
        color: textColor,
        flex: 1,
    },
    time: {
        alignSelf: 'flex-end',
        fontSize: 15,
        color: textColor,
        flex: 1,
        textAlign: 'right',
    },
    timeRangeContainer: {
        marginTop: 5,
        flex: 1,
    },
    timeRange: {
        color: textColor,
    },
})
