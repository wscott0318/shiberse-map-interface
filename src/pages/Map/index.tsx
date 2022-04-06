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
import styled from 'styled-components'
import { Dots } from 'pages/Pool/styleds'
import ShiberseLoader from 'components/Loader/loader'
import { PrimaryButton } from 'theme'

const useQuery = () => {
	const { search } = useLocation();
	return React.useMemo(() => new URLSearchParams(search), [search]);
}

const LoadingWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #121212e0;
`

export const MapScene = () => {
	let query = useQuery()

	const [ isFirst, setIsFirst ] = useState(true)
	const [ landData, setLandData ] = useState([])
	const [ showClearFilter, setShowClearFilter ] = useState(false)

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
							clearFilter={ showClearFilter }
							setClearFilter={() => setShowClearFilter(prev => !prev)}
						/>
					) : (
						<LoadingWrapper>
							<ShiberseLoader size='40px'/>
							<div className='text-3xl mt-4'>
								Loading<Dots></Dots>
							</div>
						</LoadingWrapper>
					) }

					{ showClearFilter ? (
						<LoadingWrapper>
							<div className='text-xl mb-4'>
								No results were found in your search
							</div>

							<PrimaryButton>
								Clear Filters
							</PrimaryButton>
						</LoadingWrapper>
					) : null }
				</div>
				<LandDetail />
			</div>
		</div>
	)
}

export default MapScene