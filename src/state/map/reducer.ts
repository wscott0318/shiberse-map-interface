import { createReducer } from '@reduxjs/toolkit'
import { zoomRange } from 'constants/map'
import { setSelectedLandInfo, updateLandData, updateMapCenterPos, updateMapZoomLevel, updateSearchOptions, updateMultiSelect } from './actions'

export interface MapState {
    readonly selectedLandInfo: any
    readonly mapCenterPos: {
        x: number,
        y: number,
    }
    readonly mapZoomLevel: number
    readonly landData: any
    readonly searchOptions: any
    readonly multiSelect: boolean
}

const initialState: MapState = {
    selectedLandInfo: [],
    mapCenterPos: {
        x: 0,
        y: 0,
    },
    mapZoomLevel: 20,
    landData: {},
    searchOptions: {
        shiboshiZone: false,
        privatehub: false,
        diamond: false,
        platinum: false,
        gold: false,
        silver: false,
        openforbid: false,
        openforminting: false,
        minPrice: 0.2,
        maxPrice: 1,

        searchMinPrice: 0.2,
        searchMaxPrice: 1,

        minPos: {
            x: null,
            y: null,
        },
        maxPos: {
            x: null,
            y: null,
        },

        walletAddress: '',
    },
    multiSelect: false,
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
        .addCase( updateMultiSelect, (state, { payload: { newValue } }) => {
            state.multiSelect = newValue
        })
)
