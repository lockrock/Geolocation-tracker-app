import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'

export default class DayReportsScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {log: []}
    }
    render() {
        return (
            <View>
                {
                    this.props.screenProps.reportsLog.length === 0 ?
                    <Text>No time was logged</Text>:
                    <FlatList   data={this.props.screenProps.reportsLog.map(
                                    item => ({ 
                                        ...item, 
                                        key: item.timestamp, 
                                        date: new Date(item.timestamp).toString() 
                                        })
                                )}
                                renderItem={({item})=> <Text>{JSON.stringify(item)}</Text>} 
                    />
                }
            </View>
        )
    }
}