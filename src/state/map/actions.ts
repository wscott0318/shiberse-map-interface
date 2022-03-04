import { createAction } from '@reduxjs/toolkit'

export const setSelectedLandInfo = createAction<{ newLandInfo: object }>('map/setSelectedLandInfo')

export const updateMapCenterPos = createAction<{ newPos: object }>('map/updateMapCenterPos')

export const updateMapZoomLevel = createAction<{ newLevel: number }>('map/updateMapZoomLevel') 