import React, { useCallback, useEffect, useState } from 'react'
import MapFilter from '../../components/Map/Filter'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { setSelectedLandInfo, updateLandData, updateMapCenterPos, updateMapZoomLevel } from '../../state/map/actions'
import Map from './MapView'
import LandDetail from '../../components/Map/LandDetail';
import { getLandData } from 'state/map/hooks'
// import { socket } from 'feathers'

export const MapScene = () => {
	const [ isFirst, setIsFirst ] = useState(true)

    const mapCenterPos = useSelector<AppState, AppState['map']['mapCenterPos']>(state => state.map.mapCenterPos)
    const mapZoomLevel = useSelector<AppState, AppState['map']['mapZoomLevel']>(state => state.map.mapZoomLevel)
    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)
	const landData = useSelector<AppState, AppState['map']['landData']>(state => state.map.landData)

    const dispatch = useDispatch<AppDispatch>()

    const setSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )
    const setMapCenterPos = (newPos: object): any => dispatch( updateMapCenterPos( { newPos } ) )
    const setMapZoomLevel = (newLevel: number): any => dispatch( updateMapZoomLevel( { newLevel } ) )
	const setLandData = (newLand: any): any => dispatch( updateLandData({ newLand }) )

	const fetchLandData = useCallback(async () => {
		const mapData = await getLandData()
		
		setLandData( mapData?.data )
	}, [dispatch])

	// useEffect(() => {
	// 	setIsFirst(false)

	// 	if( isFirst ) {
	// 		fetchLandData()

	// 		console.log(socket.id)

	// 		socket.on('connect', () => {
	// 			console.error('connected')
	// 		})
	// 	}

	// 	return (() => {
	// 		socket.off('connect')
	// 	})
	// }, [])
	
	return (
		<div className='w-screen h-full'>
			<div className='flex justify-between overflow-hidden h-full'>
				<MapFilter />
				<div className='w-full fixed top-0 left-0 h-full' id="mapContainer">
					<Map 
						mapCenterPos={ mapCenterPos } 
						updateMapCenterPos={ setMapCenterPos }
						mapZoomLevel={mapZoomLevel} 
						updateMapZoomLevel={setMapZoomLevel}
						selectedInfo={selectedInfo}
						setSelectedInfo={setSelectedInfo}
					/>
				</div>
				<LandDetail />
			</div>
		</div>
	)
}

export default MapScene