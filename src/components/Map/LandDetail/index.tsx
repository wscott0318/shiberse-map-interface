import React from 'react';
import styled, { ThemeContext } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { setSelectedLandInfo } from 'state/map/actions'
import thumbnail from 'assets/images/map/thumbnail.png'
import locationImg from 'assets/images/map/location.svg'
import { NormalButton } from 'theme';

const LandDetailPanel = styled.div<{ show: boolean }>`
    display: ${({ show }) => (show ? 'block' : 'none')};
    opacity: ${({ show }) => (show ? 1 : 0)};
    background: #201F31;
    border-radius: 8px;
    width: 240px;
    transition: all 1s ease;

    position: absolute;
    top: 5rem;
    right: 2rem;

    padding: 1.5rem;
`

const LandInfo = styled.div`
    position: relative;
    width: 100%;
`

const LandImage = styled.div`
    margin-right: 1rem;

    width: 50px;
`

const DetailInfo = styled.div`
    display: flex
    flex-direction: column;
    justify-content: space-between;

    height: 75px;
    margin-bottom: 1rem;
`

const LandName = styled.div`
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #FFD59D;
`

const LandType = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #FFFFFF;
`

const LandCoordinates = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    img {
        width: 14px;
        margin-right: .5rem;
    }
`

const BidBalance = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
`

const OpenType = styled.div`
    font-style: italic;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;

    color: #FFFFFF;
`

export const LandDetail = () => {
    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)

    const dispatch = useDispatch<AppDispatch>()

    const updateSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )

    const closeAction = () => {
        updateSelectedInfo( { ...selectedInfo, show: false } )
    }

    return (
        <LandDetailPanel show={ selectedInfo.show || true }>
            <LandInfo className='flex'>
                <LandImage>
                    <img src={thumbnail} alt='pic'></img>
                </LandImage>

                <DetailInfo>
                    <LandName>Name of Land</LandName>
                    <LandType>Tier 1</LandType>
                    <LandType>District:</LandType>
                </DetailInfo>
            </LandInfo>

            <LandCoordinates className='flex items-center mb-2'>
                <img src={locationImg}></img>
                X: 0,0   Y: 0,0
            </LandCoordinates>

            <LandType className='mb-4'>Owner:</LandType>

            <LandName className='mb-1'>Current price</LandName>
            <BidBalance className='mb-2'>1 ETH</BidBalance>
            <OpenType className='mb-4'>Open all</OpenType>

            <div className='text-center'>
                <NormalButton className='px-10 font-bold'>Bid</NormalButton>
            </div>
        </LandDetailPanel>
    )
}

export default LandDetail;