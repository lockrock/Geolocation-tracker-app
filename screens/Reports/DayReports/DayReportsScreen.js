import React, { Component } from 'react'
import { Alert, Text, View, FlatList, StyleSheet, } from 'react-native'
import { Card } from 'react-native-elements'
import ReportItem from './ReportItem'

export default class DayReportsScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {log: []}
    }
    groupStatuses(statusList) {
        if(statusList && statusList[0] && statusList.currentStatus==='outside') {
            statusList = statusList.splice(1)
        }
        const { groupedItems } = statusList.reduce(({ groupedItems, prevItem }, currItem, index, arr) => {
            if(currItem.currentStatus === 'inside') {
                if(index < arr.length-1) {
                    prevItem = currItem
                } else {
                    groupedItems.push({
                        currentStatus: 'inside',
                        date: new Date(currItem.timestamp),
                        endDate: null,
                        timestamp: currItem.timestamp,
                    })
                    prevItem = null
                }
            } else if(currItem.currentStatus === 'outside'){
                groupedItems.push({
                    currentStatus: 'inside',
                    date: new Date(prevItem.timestamp),
                    endDate: new Date(currItem.timestamp),
                    timestamp: prevItem.timestamp,
                })
                prevItem = null
            }
            return { groupedItems, prevItem }
        }, { groupedItems: [], prevItem: null })
        return groupedItems
    }
    render() {
        const { distanceToOffice, distanceError, maxDistanceToOffice } = this.props.screenProps
        let statusList = this.groupStatuses(this.props.screenProps.reportsLog).map(
            item => ({ 
                ...item, 
                key: item.timestamp, 
                })
        )
        statusList.reverse()
        return (
            <View style={[styles.screen, this.props.containerStyle ? this.props.containerStyle : StyleSheet.create({})]}>
                {
                    distanceError ?
                    <View style={styles.statusContainer}><Text style={styles.distanceContainer}>Error: {distanceError}</Text></View> : null
                }
                {
                    distanceToOffice ?
                        ((distanceToOffice > maxDistanceToOffice) ?
                            <View style={styles.statusContainer}><Text style={styles.distanceContainer}>Distance to office: {Math.round(distanceToOffice)} meters</Text></View> :
                            <View style={styles.statusContainer}><Text style={styles.distanceContainer}>You are at office!</Text></View>
                        ) :
                        null
                }
                {
                    this.props.screenProps.reportsLog.length === 0 ?
                    <Text>No time was logged</Text>:
                    <FlatList   style={styles.list}
                                data={statusList}
                                renderItem={({item})=> <ReportItem {...item} />} 
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    distanceContainer: {
        fontSize: 18,
        color: '#fff',
    },
    list: {
        backgroundColor: 'white',
        flex: 0.9,
    },
    statusContainer: {
        padding: 19,
        justifyContent: 'center',
        flex: 0.1,
    },
})
