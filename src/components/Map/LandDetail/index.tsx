import React from 'react';
import styled, { ThemeContext } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { setSelectedLandInfo } from 'state/map/actions'
import closeIcon from 'assets/images/map/icons/close.svg'
import thumbnail from 'assets/images/map/thumbnail.png'

const LandDetailPanel = styled.div<{ show: boolean }>`
    display: ${({ show }) => (show ? 'block' : 'none')};
    opacity: ${({ show }) => (show ? 1 : 0)};
    background: #201F31;
    border-radius: 8px;
    width: 240px;
    height: 255px;
    transition: all .5s ease;

    position: absolute;
    top: 5rem;
    right: 2rem;
`

const LandInfo = styled.div`
`

const LandImage = styled.div`
`

export const LandDetail = () => {
    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)

    const dispatch = useDispatch<AppDispatch>()

    const updateSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )

    const closeAction = () => {
        updateSelectedInfo( { ...selectedInfo, show: false } )
    }

    return (
        <LandDetailPanel show={ selectedInfo.show }>
            <LandInfo>
                <LandImage>
                    <img src={thumbnail} alt='pic'></img>
                </LandImage>
            </LandInfo>
        </LandDetailPanel>
    )
}

export default LandDetail;