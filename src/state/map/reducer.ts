import { createReducer } from '@reduxjs/toolkit'
import { range, zoomRange } from 'constants/map'
import { setSelectedLandInfo, updateLandData, updateMapCenterPos, updateMapZoomLevel, updateSearchOptions } from './actions'

export interface MapState {
    readonly selectedLandInfo: {
        show: boolean,
        x: number,
        y: number,
        size: number,
    }
    readonly mapCenterPos: {
        x: number,
        y: number,
    }
    readonly mapZoomLevel: number
    readonly landData: object[]
    readonly searchOptions: any
}

const initialState: MapState = {
    selectedLandInfo: {
        show: false,
        x: 0,
        y: 0,
        size: 1,
    },
    mapCenterPos: {
        x: 0,
        y: 0,
    },
    mapZoomLevel: 20,
    landData: [],
    searchOptions: {
        shiboshiZone: false,
        privatehub: false,
        diamond: false,
        platinum: false,
        gold: false,
        silver: false,
        openforbid: false,

        minPrice: 0,
        maxPrice: 100000,

        minPos: {
            x: null,
            y: null,
        },
        maxPos: {
            x: null,
            y: null,
        },

        walletAddress: null,
    }
}

export default createReducer<MapState>(initialState, builder =>
    builder
        .addCase( setSelectedLandInfo, (state, { payload: { newLandInfo } }) => {
            (state.selectedLandInfo as any) = newLandInfo
        })
        .addCase( updateMapCenterPos, (state, { payload: { newPos } }) => {
            state.mapCenterPos.x = (newPos as any).x
            state.mapCenterPos.y = (newPos as any).y
        })
        .addCase( updateMapZoomLevel, (state, { payload: { newLevel } }) => {
            state.mapZoomLevel = newLevel
            if( state.mapZoomLevel > zoomRange.max )
                state.mapZoomLevel = zoomRange.max
            if( state.mapZoomLevel < zoomRange.min )
                state.mapZoomLevel = zoomRange.min
        })
        .addCase( updateLandData, (state, { payload: { newLand } }) => {
            state.landData = newLand
        })
        .addCase( updateSearchOptions, (state, { payload: { newOptions } }) => {
            state.searchOptions = { ...state.searchOptions, ...newOptions }
        })
)
