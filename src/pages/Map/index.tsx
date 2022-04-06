import React, { useCallback, useEffect, useState } from 'react'
import MapFilter from '../../components/Map/Filter'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { setSelectedLandInfo, updateLandData, updateMapCenterPos, updateMapZoomLevel } from '../../state/map/actions'
import Map from './MapView'
import LandDetail from '../../components/Map/LandDetail';
import { getAllLandData } from 'state/map/hooks'
import { socket } from 'feathers'
import { mapLandDataUrl } from 'constants/map'
import { useLocation } from 'react-router-dom'

const useQuery = () => {
	const { search } = useLocation();
	return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const MapScene = () => {
	let query = useQuery()

	const [ isFirst, setIsFirst ] = useState(true)
	const [ landData, setLandData ] = useState([])

    const mapCenterPos = useSelector<AppState, AppState['map']['mapCenterPos']>(state => state.map.mapCenterPos)
    const mapZoomLevel = useSelector<AppState, AppState['map']['mapZoomLevel']>(state => state.map.mapZoomLevel)
    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)
	const searchOptions = useSelector<AppState, AppState['map']['searchOptions']>(state => state.map.searchOptions)

    const dispatch = useDispatch<AppDispatch>()

    const setSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )
    const setMapCenterPos = (newPos: object): any => dispatch( updateMapCenterPos( { newPos } ) )
    const setMapZoomLevel = (newLevel: number): any => dispatch( updateMapZoomLevel( { newLevel } ) )

	const fetchLandData = useCallback(async () => {
		const result = await fetch(mapLandDataUrl)
		const json_data = await result.json()

		setLandData(json_data)
	}, [dispatch])

	useEffect(() => {
		setIsFirst(false)

		if( isFirst ) {
			fetchLandData()

			socket.on('connect', () => {
				console.error('connected')
			})
		}

		return (() => {
			socket.off('connect')
		})
	}, [])

	useEffect(() => {
		const centerPos = {
			x: query.get('x'),
			y: query.get('y'),
		}

		const zoomLevel = query.get('zoom')

		if( centerPos.x && centerPos.y && zoomLevel ) {
			setMapCenterPos( centerPos )
			setMapZoomLevel( Number(zoomLevel) )

			setSelectedInfo({
				x: Number(centerPos.x),
				y: Number(centerPos.y),
				show: true
			})
		}
	}, [ query.get('x'), query.get('y'), query.get('zoom') ])
	
	return (
		<div className='w-screen h-full'>
			<div className='flex justify-between overflow-hidden h-full'>
				<MapFilter />
				<div className='w-full fixed top-0 left-0 h-full' id="mapContainer">
					{ landData.length > 0 ? (
						<Map 
							mapCenterPos={ mapCenterPos } 
							updateMapCenterPos={ setMapCenterPos }
							mapZoomLevel={mapZoomLevel} 
							updateMapZoomLevel={setMapZoomLevel}
							selectedInfo={selectedInfo}
							setSelectedInfo={setSelectedInfo}
							landData={landData}
							searchOptions={searchOptions}
						/>
					) : null }
				</div>
				<LandDetail />
			</div>
		</div>
	)
}

export default MapScene