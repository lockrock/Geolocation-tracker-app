// @flow
import { Alert, AsyncStorage } from 'react-native'
import type { Coords } from '../../utils/coordinates'
import { degreesToRadians, distanceBetweenCoords } from '../../utils/coordinates'
import { getOfficeCoords } from '../officeCoords'

const defaultLocationService = navigator.geolocation

export type LocationCheckerOptions = {
    locationService: typeof navigator.geolocation,
    officeCoords: Coords
}

export type LocationWatch = {
    stopWatching: () => void,
}



export function watchDistance(onSuccess: ((dist:number)=>void), onError, opts: LocationCheckerOptions = {}): LocationWatch  {
    let { locationService = defaultLocationService, officeCoords } = opts
    let watchId;

    const createPosiotionWatcher = () => {
        watchId = locationService.watchPosition(
            ({coords})=>{
                const { longitude, latitude, accuracy } = coords
                    const dist = distanceBetweenCoords(coords, officeCoords)
                    onSuccess(dist)
            },
            ({message})=>{ 
                onError(message) 
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 10000
            }
        )
    } 

    createPosiotionWatcher()

    return {
        stopWatching: ()=>{
            locationService.clearWatch(watchId)
        },
        updateOfficeCoords: (newCoords)=>{
            officeCoords = newCoords
            locationService.clearWatch(watchId)
            createPosiotionWatcher()
        }
    }
}