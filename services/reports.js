// @flow

import { AsyncStorage, Alert } from 'react-native'
import { watchDistance } from './checkIfInside/checkIfInside'

type UserStatus = 'inside' | 'outside'
type StatusChange = {
    timestamp: number,
    status: UserStatus,
}

export default class ReportsLogger {
    constructor(opts) {
        this.cache = {
            currentStatus: null,
            log: [],
        }
        this.storage = ((opts && opts.storage ? opts.storage : AsyncStorage): Storage)
    }

    logStatusChange(newStatus: UserStatus) {
        if(newStatus !== this.cache.currentStatus) {
            this.cache.log.push({
                currentStatus: newStatus, 
                timestamp: Date.now()
            })
            this.cache.currentStatus = newStatus
            return this._persistCache()
        }
        return Promise.resolve()
    }

    getFullLog() {
        return new Promise((resolve, reject)=>{
            if (this.cache.log.length === 0) {
                this.storage.getItem('log')
                    .then(JSON.parse)
                    .then(log => {
                        if (this.cache.log.length === 0) {
                            this.cache.log = log
                            if(log.length > 0) {
                                this.cache.currentStatus = log[log.length-1].currentStatus
                            }
                        }
                        return log
                    })
                    .then(resolve)
            } else {
                this.cache.currentStatus = this.cache.log[this.cache.log.length-1].currentStatus
                resolve(this.cache.log)
            }
            
        })
    }

    _persistCache() {
        return this.storage.setItem('log', JSON.stringify(this.cache.log))
    }
}