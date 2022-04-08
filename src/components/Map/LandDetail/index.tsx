import React, { useCallback, useState } from 'react';
import styled, { ThemeContext } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { setSelectedLandInfo } from 'state/map/actions'
import thumbnail from 'assets/images/map/thumbnail.png'
import locationImg from 'assets/images/map/location.svg'
import { NormalButton } from 'theme';
import useShiberseLandAuction from 'hooks/useShiberseLandAuction';
import { Events, EventsText } from 'constants/map';
import BidModal from '../bidModal';
import useShiberseStakeToken from 'hooks/useShiberseStakeToken';
import useShiberseStakeNFT from 'hooks/useShiberseStakeNFT';

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
    const [ showBidModal, setShowBidModal ] = useState(false)
    
    const { currentStage, currentBidCount, isShiboshiHolder } = useShiberseLandAuction()
    const { stakedBalance: leashStakedBalance } = useShiberseStakeToken({ tokenType: 'leash' })
    const { stakedBalance: shiboshiStakedBalance } = useShiberseStakeNFT({ tokenType: 'shiboshi' })

    const isShiberseLocker = (Number(leashStakedBalance) > 0 || Number(shiboshiStakedBalance) > 0)

    const maxBidCount = 400

    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)

    const toggleBidModal = () => setShowBidModal(prev => !prev)

    const canShowButton = useCallback(() => {
        if( currentStage === Events['Public'] )
            return true

        if( selectedInfo.isShiboshiZone && isShiboshiHolder )
            return true
        if( !selectedInfo.isShiboshiZone && isShiberseLocker )
            return true
        
        return false
    }, [ currentStage, selectedInfo, isShiboshiHolder, isShiberseLocker ])

    return (
        <LandDetailPanel show={ selectedInfo?.show }>
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
                X: { selectedInfo?.coordinates?.x }   Y: { selectedInfo?.coordinates?.y }
            </LandCoordinates>

            <LandType className='mb-4'>Owner:</LandType>

            <LandName className='mb-1'>Current price</LandName>
            <BidBalance className='mb-2'>{ selectedInfo?.price } ETH</BidBalance>
            <OpenType className='mb-4'>{ EventsText[ currentStage ] }</OpenType>

            { canShowButton() ? (
                <div className='text-center'>
                    { currentStage === Events['Bid'] ? (
                        <NormalButton 
                            disabled={ !selectedInfo?.isShiboshiZone && currentBidCount === 0 ? true : false }
                            className={`px-10 font-bold ${ selectedInfo?.noBidAllowedOnLand ? 'hidden' : '' }`}
                            onClick={toggleBidModal}
                        >
                            Bid
                        </NormalButton>
                    ) : (
                        <NormalButton 
                            disabled={ !selectedInfo?.isShiboshiZone && currentBidCount === 0 ? true : false }
                            className={`px-10 font-bold ${ selectedInfo?.noBidAllowedOnLand ? 'hidden' : '' }`}
                            // onClick={toggleBidModal}
                        >
                            Mint
                        </NormalButton>
                    ) }
                </div>
            ) : ''}


            <BidModal 
                isOpen={ showBidModal }
                onDismiss={ toggleBidModal }
                selectedInfo={ selectedInfo }
            />
        </LandDetailPanel>
    )
}

export default LandDetail;