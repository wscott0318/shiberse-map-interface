import React from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { updateMapCenterPos, updateMapZoomLevel } from 'state/map/actions'
import { zoomRange } from 'constants/map'
import ghostArrow from 'assets/images/map/icons/GhostArrow.svg'
import MiniMap from 'pages/Map/MiniMapView'

/* styled elements */
const FilterPanel = styled.div<{ expand: boolean }>`
    background: #1b221f;
    width: 241px;
    transition: all .5s;
    margin-left: ${({ expand }) => (expand ? 0 : -241) }px;

    &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }
    &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.4);
    }
    &::-webkit-scrollbar-thumb {
        background-color: #505861;
    }
`

const FilterExpandButton = styled.div`
    width: 30px;
    height: 40px;
    background-color: #0084ff;
    box-shadow: 5px 3px 8px rgb(0 0 0 / 16%);
    border-radius: 0 10px 10px 0;
    margin-top: 30px;
    transition: all .5s;

    &:hover {
        background-color: #0051ff;
    }
`

const ArrowImg = styled.img<{ expand: boolean }>`
    width: 8px;
    transform: rotateY(${({ expand }) => ( expand ? 0 : 180 )}deg);
    transition: .5s all;
`

const MiniMapContainer = styled.div<{ isShow: boolean }>`
    display: ${({ isShow }) => ( isShow ? 'flex' : 'none' )}
    width: 225px;
    height: 200px;
    background-color: #14181d;
    border-radius: 7px;
    border: 1px solid #a0a4a7;
    margin-left: 15px;
    margin-top: 5px;
    padding: 5px;
`

const MiniMapCanvas = styled.div`
    width: 189px;
    height: 189px;
`

const ZoomButtons = styled.div`
    top: unset;
    right: 5px;
    bottom: unset;
    left: unset;
    height: calc(100% - 10px);
`

const ZoomButtonsWrapper = styled.div`
    width: 20px;
`

const ZoomButton = styled.div`
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 5px;
    background-color: #0084ff;
    line-height: 15px;
    transition: all .5s;
    font-size: 18px;

    &:hover {
        background-color: #0051ff;
    }
`

const ZoomRangeWrapper = styled.div`
    width: 140px;
    height: 20px;
    border-radius: 1px;
    transform: rotate(90deg);
`

const ZoomRange = styled.input`
    -webkit-appearance: none;
    border-radius: 5px;
    transform: rotate(180deg);
`

const MiniMapBtnGroup = styled.div`
    margin-left: 5px;
    margin-top: 5px;

    .button {
        width: 43px;
        height: 43px;
        border-radius: 7px;
        margin: 0;
    }
`

export const MapFilter = () => {
    const mapCenterPos = useSelector<AppState, AppState['map']['mapCenterPos']>(state => state.map.mapCenterPos)
    const mapZoomLevel = useSelector<AppState, AppState['map']['mapZoomLevel']>(state => state.map.mapZoomLevel)

    const dispatch = useDispatch<AppDispatch>()

    const setMapCenterPos = (newPos: object): any => dispatch( updateMapCenterPos( { newPos } ) )
    const setMapZoomLevel = (newLevel: number): any => dispatch( updateMapZoomLevel( { newLevel } ) )

    const [ expand, setExpand ] = useState(true)
    const [ showMiniMap, setShowMiniMap ] = useState(true)

    const zoomIn = () => {
        setMapZoomLevel( mapZoomLevel + 1 )
    }

    const zoomOut = () => {
        setMapZoomLevel( mapZoomLevel - 1 )
    }

    const onChangeZoomLevel = ( e: any ) => {
        setMapZoomLevel( parseInt(e.target.value) )
    }

    return (
        <div className='flex h-full'>
            <FilterPanel expand={ expand } className='h-full relative z-10 overflow-auto' style={{ fontSize: 35, color: 'rgb(255 59 177)', display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                {/* filter content will be placed here */}
                Fitler content will be placed here!
            </FilterPanel>

            <FilterExpandButton onClick={() => setExpand(prev => !prev)} className='flex flex-row justify-center items-center cursor-pointer z-10'>
                <ArrowImg src={ ghostArrow } expand={ expand } className='max-w-full max-h-full italic align-middle box-border m-0 p-0'/>
            </FilterExpandButton>

            <MiniMapContainer isShow={ showMiniMap } className='flex-row justify-start items-center relative z-10 overflow-hidden'>
                <MiniMapCanvas className='relative' id='miniMapCanvas'>
                    <MiniMap
                        mapCenterPos={ mapCenterPos }
                        updateMapCenterPos={ setMapCenterPos }
                        mapZoomLevel={ mapZoomLevel }
                    />
                </MiniMapCanvas>

                <ZoomButtons className='flex flex-col justify-between items-center absolute z-10'>
                    <ZoomButtonsWrapper className='flex flex-1 flex-col justify-between items-center'>
                        <ZoomButton className='flex justify-center items-center text-center text-white cursor-pointer' onClick={() => zoomIn()}>+</ZoomButton>

                        <ZoomRangeWrapper className='overflow-hidden flex flex-row justify-center items-center'>
                            <ZoomRange 
                                type="range" 
                                step="1" 
                                max={ zoomRange.max } 
                                min={ zoomRange.min } 
                                className='w-full m-0' 
                                value={ mapZoomLevel }
                                onChange={(e) => onChangeZoomLevel(e)}
                            />
                        </ZoomRangeWrapper>

                        <ZoomButton className='flex justify-center items-center text-center text-white cursor-pointer' onClick={() => zoomOut()}>-</ZoomButton>
                    </ZoomButtonsWrapper>
                </ZoomButtons>
            </MiniMapContainer>

            <MiniMapBtnGroup className='flex h-0 z-10'>
                <FilterExpandButton onClick={() => setShowMiniMap(prev => !prev)} className='flex flex-row justify-center items-center cursor-pointer z-10 button'>
                    <ArrowImg src={ ghostArrow } expand={ showMiniMap } className='max-w-full max-h-full italic align-middle box-border m-0 p-0'/>
                </FilterExpandButton>
            </MiniMapBtnGroup>
        </div>
    )
}

export default MapFilter;