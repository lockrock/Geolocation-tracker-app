import { Alert, AsyncStorage } from 'react-native'

type Coords = { longitude: number, latitude: number }

const storageCoordsProp = 'officeCoords';

let coordsCache: Coords;

export function getOfficeCoords(opt: {defaultCoords: { longitude: number, latitude: number }}): Promise<Coords> {
    if(coordsCache != undefined) 
        return Promise.resolve(coordsCache) 
    else {
        const { defaultCoords, } = opt
        return new Promise((resolve) => {
            AsyncStorage.getItem(storageCoordsProp)
                .then((result) => {
                    if(!result) {
                        resolve(defaultCoords)
                        setOfficeCoords(defaultCoords)   
                    }
                    coordsCache = JSON.parse(result)
                    resolve(coordsCache)
                })
                .catch((err)=>{
                    setOfficeCoords(defaultCoords)
                    resolve(defaultCoords)
                })
        })
    }
}

export function setOfficeCoords(newCoords: Coords) {
    const { longitude, latitude } = newCoords
    if(
        typeof longitude === 'number' && 
        typeof latitude === 'number' && 
        longitude<=180 && 
        latitude<=90
    ) {
        return AsyncStorage.setItem(storageCoordsProp, JSON.stringify({longitude, latitude}))
            .then(() => {
                coordsCache = { longitude, latitude }
            })
    } else {
        return Promise.reject('Incorrect input')
    }
}

const storageDistanceProp = 'maxDistanceToOffice'
let distanceToOfficeCache: number

export function getMaxDistanceToOffice(opt: { defaultDistance: number }) {
    const { defaultDistance } = opt
    return new Promise((resolve) => {
        AsyncStorage.getItem(storageDistanceProp)
            .then((dist) => {
                if(!dist) {
                    resolve(defaultDistance)
                    setMaxDistanceToOffice(defaultDistance)
                }
                distanceToOfficeCache = JSON.parse(dist)
                resolve(distanceToOfficeCache)
            })
            .catch((err) => {
                setMaxDistanceToOffice(defaultDistance)
                resolve(defaultDistance)
            })
    })
    
}

export function setMaxDistanceToOffice(distance: number) {
    if(typeof distance === 'number') {
        return AsyncStorage.setItem(storageDistanceProp, JSON.stringify(distance))
            .then(() => {
                distanceToOfficeCache = distance
            })
    } else {
        return Promise.reject('Invalid argument')
    }
}

