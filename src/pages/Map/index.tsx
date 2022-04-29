import React, { useEffect, useState } from 'react'
import MapFilter from '../../components/Map/Filter'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { setSelectedLandInfo, updateMapCenterPos, updateMapZoomLevel, updateSearchOptions } from '../../state/map/actions'
import Map from './MapView'
import LandDetail from '../../components/Map/LandDetail';
// import { socket } from 'feathers'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Dots } from 'pages/Pool/styleds'
import ShiberseLoader from 'components/Loader/loader'
import { PrimaryButton } from 'theme'
import useLandMap from 'hooks/useLandMap'
import { ToggleMultiSelect } from 'components/Map/ToggleMultiSelect'

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
	const [ showClearFilter, setShowClearFilter ] = useState(false)

	const { landData, landPriceData, updatePriceData, isLandDataLoaded, minPrice, maxPrice } = useLandMap()

    const mapCenterPos = useSelector<AppState, AppState['map']['mapCenterPos']>(state => state.map.mapCenterPos)
    const mapZoomLevel = useSelector<AppState, AppState['map']['mapZoomLevel']>(state => state.map.mapZoomLevel)
    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)
	const searchOptions = useSelector<AppState, AppState['map']['searchOptions']>(state => state.map.searchOptions)
	const multiSelect = useSelector<AppState, AppState['map']['multiSelect']>(state => state.map.multiSelect)

    const dispatch = useDispatch<AppDispatch>()

    const setSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )
    const setMapCenterPos = (newPos: object): any => dispatch( updateMapCenterPos( { newPos } ) )
    const setMapZoomLevel = (newLevel: number): any => dispatch( updateMapZoomLevel( { newLevel } ) )
	const setSearchOptions = (newOptions: any): any => dispatch( updateSearchOptions( { newOptions } ) )

	useEffect(() => {
		setIsFirst(false)

		// if( isFirst ) {
		// 	socket.on('connect', () => {
		// 		console.error('connected')
		// 	})

		// 	socket.on('created', (data: any) => {
		// 		console.error('Socket info: created', data)
		// 	})
		// }

		// return (() => {
		// 	socket.off('connect')
		// 	socket.off('created')
		// })
	}, [])

	useEffect(() => {
		const centerPos = {
			x: query.get('x') ? Number(query.get('x')) : query.get('x'),
			y: query.get('y') ? Number(query.get('y')) : query.get('y'),
		} as any

		const zoomLevel = query.get('zoom')

		if( (centerPos.x === 0 || centerPos.x) && (centerPos.y === 0 || centerPos.y) ) {
			setMapCenterPos( {
				...centerPos,
				y: -(centerPos.y)
			} )

			if( zoomLevel )
				setMapZoomLevel( Number(zoomLevel) )

			setSelectedInfo([{
				coordinates: {
					x: Number(centerPos.x),
					y: Number(centerPos.y),
				},
				show: false
			}])
		}
	}, [ query ])
	
	const handleClearFilters = () => {
		const newOptions = {
			shiboshiZone: false,
			privatehub: false,
			diamond: false,
			platinum: false,
			gold: false,
			silver: false,
			openforbid: false,
			openforminting: false,
	
			minPrice: minPrice,
			maxPrice: maxPrice,
	
			searchMinPrice: minPrice,
			searchMaxPrice: maxPrice,
	
			minPos: {
				x: null,
				y: null,
			},
			maxPos: {
				x: null,
				y: null,
			},
	
			walletAddress: '',

			clearFilters: true
		}

		setSearchOptions( newOptions )
	}

	return (
		<>
			<div className='w-screen h-full'>
				<div className='flex justify-between overflow-hidden h-full'>
					<MapFilter />
					<div className='w-full fixed top-0 left-0 h-full' id="mapContainer">
						{ isLandDataLoaded ? (
							<Map 
								mapCenterPos={ mapCenterPos } 
								updateMapCenterPos={ setMapCenterPos }
								mapZoomLevel={mapZoomLevel} 
								updateMapZoomLevel={setMapZoomLevel}
								selectedInfo={selectedInfo}
								setSelectedInfo={setSelectedInfo}
								landData={landData}
								landPriceData={landPriceData}
								searchOptions={searchOptions}
								clearFilter={ showClearFilter }
								setClearFilter={() => setShowClearFilter(prev => !prev)}
								multiSelect={multiSelect}
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

								<PrimaryButton onClick={handleClearFilters}>
									Clear Filters
								</PrimaryButton>
							</LoadingWrapper>
						) : null }
					</div>

					<ToggleMultiSelect />

					<LandDetail />
				</div>
			</div>
		</>
	)
}

export default MapScene