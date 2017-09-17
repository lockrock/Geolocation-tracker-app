// @flow
import checkIfInside from './checkIfInside'

const mockLocationService: typeof navigator.geolocation = {
    getCurrentPosition: (suc, err, opt) => {
        suc({
            coords: {
                latitude: 40,
                longitude: 40,
                accuracy: 20,
            }
        })
    }
}

const res = checkIfInside({
    locationService: mockLocationService
})