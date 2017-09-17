// @flow

export type Coords = {
    longitude: number,  
    latitude: number,
}

export const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

export function distanceBetweenCoords(p1: Coords, p2: Coords) {
    const longitude1 = degreesToRadians(p1.longitude),
        latitude1 = degreesToRadians(p1.latitude),
        longitude2 = degreesToRadians(p2.longitude),
        latitude2 = degreesToRadians(p2.latitude)

    const latitudeDegreeLength = 111000/(Math.PI/180), 
        longitudeDegreeLengthAtEquator = 111000/(Math.PI/180)

    const longitudeDegreeLengthHere = Math.cos(latitude1) * longitudeDegreeLengthAtEquator

    const horDistance = longitudeDegreeLengthHere * Math.abs(longitude1-longitude2),
        verDistance = latitudeDegreeLength * Math.abs(latitude1 - latitude2),
        cartesianDistance = Math.sqrt(horDistance*horDistance + verDistance*verDistance)

    return cartesianDistance
}