import React from 'react'
import MapFilter from '../../components/Map/Filter'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { setSelectedLandInfo, updateMapCenterPos, updateMapZoomLevel } from '../../state/map/actions'
import Map from './MapView'
import LandDetail from '../../components/Map/LandDetail';

export const MapScene = () => {
    const mapCenterPos = useSelector<AppState, AppState['map']['mapCenterPos']>(state => state.map.mapCenterPos)
    const mapZoomLevel = useSelector<AppState, AppState['map']['mapZoomLevel']>(state => state.map.mapZoomLevel)
    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)

    const dispatch = useDispatch<AppDispatch>()

    const setSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )
    const setMapCenterPos = (newPos: object): any => dispatch( updateMapCenterPos( { newPos } ) )
    const setMapZoomLevel = (newLevel: number): any => dispatch( updateMapZoomLevel( { newLevel } ) )
	
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