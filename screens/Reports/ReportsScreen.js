import { Component } from 'react'
import { TabNavigator } from 'react-navigation'
import DayReportsScreen from './DayReports/DayReportsScreen'
import MonthReportsScreen from './MonthReports/MonthReportsScreen'

const ReportsScreen = TabNavigator({
    DayReports: {
      screen: DayReportsScreen,
    },
    // MonthReports: {
    //   screen: MonthReportsScreen
    // }
  })

export default ReportsScreen
  