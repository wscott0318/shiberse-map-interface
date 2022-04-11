import React, { useCallback, useEffect, useState } from 'react';
import styled, { ThemeContext } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { setSelectedLandInfo } from 'state/map/actions'
import locationImg from 'assets/images/map/location.svg'
import { ModalToggleButton, NormalButton } from 'theme';
import useShiberseLandAuction from 'hooks/useShiberseLandAuction';
import { apiServer, Events, EventsText } from 'constants/map';
import BidModal from '../bidModal';
import useShiberseStakeToken from 'hooks/useShiberseStakeToken';
import useShiberseStakeNFT from 'hooks/useShiberseStakeNFT';
import useLandMap from 'hooks/useLandMap';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { formatFromBalance, shortenAddress } from 'utils';
import { useBlockNumber } from 'state/application/hooks';
import LandBidHistoryModal from 'components/BidHistoryModal/landHistory';
import { getLandName, getLandImage } from 'utils/mapHelper';
import { ReactComponent as Close } from 'assets/images/x.svg'
import ShiberseLoader from 'components/Loader/loader'

const LandDetailPanel = styled.div<{ show: boolean }>`
    display: ${({ show }) => (show ? 'block' : 'none')};
    opacity: ${({ show }) => (show ? 1 : 0)};
    background: #201F31;
    border-radius: 8px;
    width: 250px;
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

const BidHistory = styled(ModalToggleButton)`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    color: #F8A93E;

    :hover {
        color: #d18f36;
    }
`

const CloseIcon = styled.div`
    position: absolute;
    right: .7rem;
    top: 0.4rem;
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }

    svg {
        width: 15px;
    }
`

const CloseColor = styled(Close)`
    path {
        stroke: ${({ theme }) => theme.text4};
    }
`

export const LandDetail = () => {
    const [ showBidModal, setShowBidModal ] = useState(false)
    const [ currentLandInfo, setCurrentLandInfo ] = useState({}) as any
    
    const { account } = useWeb3React()

    const { stakedBalance: leashStakedBalance } = useShiberseStakeToken({ tokenType: 'leash' })
    const { stakedBalance: shiboshiStakedBalance } = useShiberseStakeNFT({ tokenType: 'shiboshi' })

    const currentBlockNumber = useBlockNumber()

    const isShiberseLocker = (Number(leashStakedBalance) > 0 || Number(shiboshiStakedBalance) > 0)

    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)

    const dispatch = useDispatch<AppDispatch>()

    const setSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )

    const toggleBidModal = () => setShowBidModal(prev => !prev)

    const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const { currentStage, currentBidCount, isShiboshiHolder, fetchLandPrice } = useShiberseLandAuction({})

    const canShowButton = useCallback(() => {
        if( currentStage === Events['Public'] )
            return true

        if( selectedInfo.isShiboshiZone && isShiboshiHolder )
            return true
        if( !selectedInfo.isShiboshiZone && isShiberseLocker )
            return true
        
        return false
    }, [ currentStage, selectedInfo, isShiboshiHolder, isShiberseLocker ])

    const checkDistrict = function (x: number, y: number ) {
        if(x >= -96 && x < 0) {
            if( y <= 99 && y > 0) {
                return "Defense"
            } else {
                return "Technology"
            }
        } else {
            if(x > 0 && x <= 96) {
                if( y < 0 && y >= -99) {
                    return "Currency"
                } else {
                    return "Growth"
                }
            }
        }
        return ""
    }

    useEffect(() => {
        const getLandPrice = async () => {
            setIsLoading(true)

            const response = await axios.get(`${apiServer}/yards?id=${selectedInfo.id}`)
            const data = response.data

            const newInfo = data.length > 0 ? { ...data[0] } : {}
            if( selectedInfo?.tierName && selectedInfo?.tierName !== 'hub' && selectedInfo?.tierName !== 'road' ) {
                const price = await fetchLandPrice({ x: selectedInfo.coordinates.x, y: selectedInfo.coordinates.y })
                newInfo.price = Number( formatFromBalance(price, 18) )
            }
    
            setCurrentLandInfo( newInfo )

            setIsLoading(false)
        }

        getLandPrice()
    }, [fetchLandPrice, selectedInfo])

    const isCurrentOwner = account?.toUpperCase() === currentLandInfo?.currentBidWinner?.toUpperCase()

    const handleClose = () => {
        const newInfo = { ...selectedInfo }
        newInfo.show = false
        setSelectedInfo(newInfo)
    }

    const hideDetail = (info: any) => info?.tierName === 'road' || info?.tierName === 'hub'

    return (
        <LandDetailPanel show={ selectedInfo?.show }>
            <CloseIcon onClick={handleClose}>
                <CloseColor />
            </CloseIcon>

            { isLoading ? (
                <div className='flex justify-center py-24'>
                    <ShiberseLoader size='50px'/>
                </div>
            ): (
                <>
                    <LandInfo className='flex'>
                        <LandImage>
                            <img src={getLandImage(currentLandInfo?.tierName)} alt='pic'></img>
                        </LandImage>

                        <DetailInfo>
                            <LandName>Land</LandName>
                            <LandType>{ getLandName(currentLandInfo?.tierName, currentLandInfo) }</LandType>
                            <LandType>District: { checkDistrict( Number(currentLandInfo?.coordinates?.x), Number(currentLandInfo?.coordinates?.y) ) }</LandType>
                        </DetailInfo>
                    </LandInfo>

                    <LandCoordinates className='flex items-center mb-2'>
                        <img src={locationImg}></img>
                        X: { currentLandInfo?.coordinates?.x }   Y: { currentLandInfo?.coordinates?.y }
                    </LandCoordinates>

                    { hideDetail(currentLandInfo) ? '' : (
                        <>
                            <LandType className='mb-2'>
                                Highest Bid By:
                                { currentLandInfo?.currentBidWinner 
                                    ? <a className='font-normal ml-1' target='_blank' rel="noreferrer" href={`https://etherscan.io/address/${ currentLandInfo?.currentBidWinner }`} >{shortenAddress(currentLandInfo?.currentBidWinner, 8)}</a> 
                                    : ' none' }
                            </LandType>

                            <BidHistory className='mb-4' onClick={() => setShowBidHistoryModal(prev => !prev)}>Bid history</BidHistory>

                            <LandBidHistoryModal 
                                isOpen={showBidHistoryModal}
                                onDismiss={() => setShowBidHistoryModal(prev => !prev)}
                                allPlacedBids={ currentLandInfo?.bids ? currentLandInfo?.bids.sort((a: any,b: any) => b.bidPrice - a.bidPrice) : [] }
                            />

                            <LandName className='mb-1'>Current price</LandName>
                            <BidBalance className='mb-2'>{ currentLandInfo?.price } ETH</BidBalance>
                            <OpenType className='mb-4'>{ EventsText[ currentStage ] }</OpenType>

                            { canShowButton() ? (
                                <div className='text-center'>
                                    { currentStage === Events['Bid'] ? (
                                        <NormalButton 
                                            disabled={ !currentLandInfo?.isShiboshiZone && currentBidCount === 0 ? true : false }
                                            className={`px-10 font-bold ${ currentLandInfo?.noBidAllowedOnLand || isCurrentOwner ? 'hidden' : '' }`}
                                            onClick={toggleBidModal}
                                        >
                                            Bid
                                        </NormalButton>
                                    ) : (
                                        <NormalButton 
                                            disabled={ !currentLandInfo?.isShiboshiZone && currentBidCount === 0 ? true : false }
                                            className={`px-10 font-bold ${ currentLandInfo?.noBidAllowedOnLand ? 'hidden' : '' }`}
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
                                selectedInfo={ currentLandInfo }
                                handleCloseAction={ handleClose }
                            />
                        </>
                    )}
                </>
            ) }

        </LandDetailPanel>
    )
}

export default LandDetail;