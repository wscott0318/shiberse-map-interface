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
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { formatFromBalance, shortenAddress, shortenDouble } from 'utils';
import LandBidHistoryModal from 'components/BidHistoryModal/landHistory';
import { getLandName, getLandImage } from 'utils/mapHelper';
import { ReactComponent as Close } from 'assets/images/x.svg'
import ShiberseLoader from 'components/Loader/loader'
import BidMultiModal from '../bidMultiModal';
import MintModal, { MintMultiModal } from '../mintModal';

const LandDetailPanel = styled.div<{ show: boolean }>`
    display: ${({ show }) => (show ? 'block' : 'none')};
    opacity: ${({ show }) => (show ? 1 : 0)};
    background: #201F31;
    border-radius: 8px;
    width: 250px;
    transition: all 1s ease;

    position: absolute;
    top: 8rem;
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
    const [ showMintModal, setShowMintModal ] = useState(false)
    const [ currentLandInfo, setCurrentLandInfo ] = useState({}) as any
    const [ mintType, setMintType ] = useState('eth')

    const { account } = useWeb3React()

    const { stakedBalance: leashStakedBalance } = useShiberseStakeToken({ tokenType: 'leash' })
    const { stakedBalance: shiboshiStakedBalance } = useShiberseStakeNFT({ tokenType: 'shiboshi' })

    const isShiberseLocker = (Number(leashStakedBalance) > 0 || Number(shiboshiStakedBalance) > 0)

    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)

    const dispatch = useDispatch<AppDispatch>()

    const setSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )

    const toggleBidModal = () => setShowBidModal(prev => !prev)

    const toggleMintModal = () => setShowMintModal(prev => !prev)

    const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const { currentStage, currentBidCount, isShiboshiHolder, fetchLandPrice, fetchLandCurrentWinner, fetchLandCurrentOwner, fetchLandShibPrice } = useShiberseLandAuction({})

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
            if( selectedInfo.length === 1 ) {   // single select
                const selected = selectedInfo[0]
                setIsLoading(true)
                const response = await axios.get(`${apiServer}/yards?id=${selected.id}`)
                const data = response.data
    
                const newInfo = data.length > 0 ? { ...data[0] } : {}
                if( selected?.tierName && selected?.tierName !== 'hub' && selected?.tierName !== 'road' && !selected?.reserved ) {
                    const price = await fetchLandPrice({ x: selected.coordinates.x, y: selected.coordinates.y })
                    newInfo.price = Number( formatFromBalance(price, 18) )
                    newInfo.bigNumPrice = price

                    const currentBidWinner = await fetchLandCurrentWinner({ x: selected.coordinates.x, y: selected.coordinates.y })
                    const currentBidOwner = await fetchLandCurrentOwner({ landId : selected.id.toString()})
                    newInfo.currentBidWinner = currentBidOwner || currentBidWinner
                    newInfo.currentBidOwner = currentBidOwner

                    if( !currentBidWinner || !Number(currentBidWinner) ) {
                        const shibPrice = await fetchLandShibPrice({ x: selected.coordinates.x, y: selected.coordinates.y })
                        newInfo.shibPrice = Number( formatFromBalance(shibPrice, 18) )
                        newInfo.bigNumbShibPrice = shibPrice
                    }
                }
                setCurrentLandInfo( newInfo )
            }
            setIsLoading(false)
        }

        getLandPrice()
    }, [fetchLandPrice, selectedInfo])

    const isCurrentOwner = account?.toUpperCase() === currentLandInfo?.currentBidWinner?.toUpperCase()

    const handleClose = () => {
        setSelectedInfo([])

        setShowBidModal(false)
        setShowMintModal(false)
    }

    const hideDetail = (info: any) => info?.tierName === 'road' || info?.tierName === 'hub' || info?.reserved


    const isMultiplePossible = () => {
        if( currentStage !== Events['Public'] && selectedInfo.findIndex((item: any) => !item.isShiboshiZone) !== -1 && selectedInfo.length > currentBidCount )
            return false

        if( selectedInfo.findIndex((item: any) => item.isShiboshiZone) !== -1 && selectedInfo.findIndex((item: any) => !item.isShiboshiZone) !== -1 )
            return false

        return true
    }

    return (
        <LandDetailPanel show={ ( selectedInfo.length === 1 && selectedInfo[0].show ) || (selectedInfo.length > 1) }>
            <CloseIcon onClick={handleClose}>
                <CloseColor />
            </CloseIcon>

            { isLoading ? (
                <div className='flex justify-center py-24'>
                    <ShiberseLoader size='50px'/>
                </div>
            ) : selectedInfo.length === 1 ? (
                <>
                    <LandInfo className='flex'>
                        <LandImage>
                            <img src={getLandImage(currentLandInfo?.tierName)} alt='pic'></img>
                        </LandImage>

                        <DetailInfo>
                            <LandName>{ currentLandInfo?.isRoad ? 'Road' : currentLandInfo?.tierName === 'hub' ? 'HUB' : 'Land'}</LandName>
                            <LandType className="text-red">{ currentLandInfo?.reserved ? 'Reserved' : '' }</LandType>
                            <LandType>{ getLandName(currentLandInfo?.tierName, currentLandInfo) }</LandType>
                            <LandType>District: { checkDistrict( Number(currentLandInfo?.coordinates?.x), Number(currentLandInfo?.coordinates?.y) ) }</LandType>
                        </DetailInfo>
                    </LandInfo>

                    <LandCoordinates className='flex items-center mb-2'>
                        <img src={locationImg}></img>
                        X: { currentLandInfo?.coordinates?.x }   Y: { currentLandInfo?.coordinates?.y }
                    </LandCoordinates>

                    { currentLandInfo?.tierName === 'hub' ? (
                        <div className='text-center mt-4'>
                            <a href='https://en3t77relo9.typeform.com/to/gUBkkRxh' target='_blank' rel="noreferrer">
                                <NormalButton 
                                    className={`px-8 font-bold`}
                                >
                                    For Leasing Contact us
                                </NormalButton>
                            </a>
                        </div>
                    ): null }

                    { hideDetail(currentLandInfo) ? '' : (
                        <>
                            <LandType className='mb-2'>
                                { currentStage === Events['Bid'] ? 'Highest Bid By:' : 'Owner:' } 
                                { Number(currentLandInfo?.currentBidWinner)
                                    ? <a className='font-normal ml-1' target='_blank' rel="noreferrer" href={`https://etherscan.io/address/${ currentLandInfo?.currentBidWinner }`} >{shortenAddress(currentLandInfo?.currentBidWinner, 8)}</a> 
                                    : ' None' }
                            </LandType>

                            { currentStage === Events['Bid'] ? (
                                <>
                                    <BidHistory className='mb-4' onClick={() => setShowBidHistoryModal(prev => !prev)}>Bid history</BidHistory>

                                    <LandBidHistoryModal 
                                        isOpen={showBidHistoryModal}
                                        onDismiss={() => setShowBidHistoryModal(prev => !prev)}
                                        allPlacedBids={ currentLandInfo?.bids ? currentLandInfo?.bids.sort((a: any,b: any) => b.bidPrice - a.bidPrice) : [] }
                                    />

                                    <LandName className='mb-1'>Current price</LandName>
                                    <BidBalance className='mb-2'>{ shortenDouble(Number(currentLandInfo?.price), 2) } ETH</BidBalance>
                                </>
                            ): null }

                            <OpenType className='mb-4'>{ EventsText[ currentStage ] }</OpenType>

                            { Number(currentLandInfo?.currentBidOwner) ? (
                                <div className='text-center'>
                                    <a href={`https://opensea.io/assets/0xEfAEd650f1a94801806BB110019d9B0dc79531A8/${currentLandInfo.id}`} target='_blank' rel="noreferrer">
                                        <NormalButton
                                            className={`px-6 m-0 font-bold`}
                                        >
                                            Bid on Opensea
                                        </NormalButton>
                                    </a>
                                </div>
                            ): null }

                            { canShowButton() ? (
                                <div className='text-center'>
                                    { currentStage === Events['Bid'] ? (
                                        <NormalButton 
                                            disabled={ !currentLandInfo?.isShiboshiZone && currentBidCount === 0 ? true : false }
                                            className={`px-10 font-bold ${ isCurrentOwner ? 'hidden' : '' }`}
                                            onClick={toggleBidModal}
                                        >
                                            Bid
                                        </NormalButton>
                                    ) : currentStage === Events['Holder'] ? (
                                        <NormalButton 
                                            disabled={ !currentLandInfo?.isShiboshiZone && currentBidCount === 0 ? true : false }
                                            className={`px-10 font-bold ${ Number(currentLandInfo?.currentBidWinner) ? 'hidden' : '' }`}
                                            onClick={toggleMintModal}
                                        >
                                            Mint
                                        </NormalButton>
                                    ) : currentStage === Events['Public'] ? (
                                        <>
                                            <NormalButton 
                                                className={`px-6 mb-2 font-bold ${ Number(currentLandInfo?.currentBidWinner) ? 'hidden' : '' }`}
                                                onClick={() => { toggleMintModal(); setMintType('eth') }}
                                            >
                                                Mint With Eth
                                            </NormalButton>

                                            <NormalButton 
                                                className={`px-5 font-bold ${ Number(currentLandInfo?.currentBidWinner) ? 'hidden' : '' }`}
                                                onClick={() => { toggleMintModal(); setMintType('shib') }}
                                            >
                                                Mint With Shib
                                            </NormalButton>
                                        </>
                                    ) : null }
                                </div>
                            ) : ''}

                            <BidModal 
                                isOpen={ showBidModal }
                                onDismiss={ toggleBidModal }
                                selectedInfo={ currentLandInfo }
                                handleCloseAction={ handleClose }
                            />

                            <MintModal 
                                isOpen={ showMintModal }
                                onDismiss={ toggleMintModal }
                                landInfo={ currentLandInfo }
                                handleCloseAction={ handleClose }
                                mintType={ mintType }
                            />
                        </>
                    )}
                </>
            ) : (
                <div className='text-center'>
                    { currentStage === Events['Bid'] ? (
                        <>
                            <NormalButton 
                                className={`px-10 font-bold`}
                                disabled={ !isMultiplePossible() ? true : false }
                                onClick={toggleBidModal}
                            >
                                Submit Multibid({ selectedInfo.length })
                            </NormalButton>

                            <BidMultiModal 
                                isOpen={ showBidModal }
                                onDismiss={ toggleBidModal }
                                selectedInfo={ selectedInfo }
                                handleCloseAction={ handleClose }
                            />
                        </>
                    ) : (
                        <>
                            <NormalButton 
                                className={`px-3 m-0 mb-2 font-bold`}
                                disabled={ !isMultiplePossible() ? true : false }
                                onClick={() => { toggleMintModal(); setMintType('eth') }}
                            >
                                Submit Multimint With Eth({ selectedInfo.length })
                            </NormalButton>

                            <NormalButton 
                                className={`px-3 m-0 font-bold`}
                                disabled={ !isMultiplePossible() ? true : false }
                                onClick={() => { toggleMintModal(); setMintType('shib') }}
                            >
                                Submit Multimint With Shib({ selectedInfo.length })
                            </NormalButton>

                            <MintMultiModal 
                                isOpen={ showMintModal }
                                onDismiss={ toggleMintModal }
                                selectedInfo={ selectedInfo }
                                handleCloseAction={ handleClose }
                                mintType={ mintType }
                            />
                        </>
                    ) }
                </div>
            ) }

        </LandDetailPanel>
    )
}

export default LandDetail;