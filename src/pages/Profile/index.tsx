import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import etherIcon from 'assets/images/profile/ether.svg'
import { ModalToggleButton, PrimaryButton } from 'theme'
import BidHistoryModal from 'components/BidHistoryModal'
import thumbnail from 'assets/images/map/thumbnail.png'
import locationImg from 'assets/images/map/location.svg'
import MintModal from './mintModal'
import { useWeb3React } from '@web3-react/core'
import { useETHBalances } from 'state/wallet/hooks'
import { NETWORK_LABEL } from 'constants/networks'
import { shortenDouble } from 'utils'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
import { Events } from 'constants/map'
import useShiberseStakeToken from 'hooks/useShiberseStakeToken'
import useShiberseStakeNFT from 'hooks/useShiberseStakeNFT'
import BidModal from 'components/Map/bidModal'
import { mapLandDataUrl } from 'constants/map'
import useLandMap from 'hooks/useLandMap'

const ProfileWrapper = styled.div`
    position: relative;
    padding: 5rem;
    padding-top: 8rem;

    @media (max-width: 1200px) {
        padding: 3rem;
        padding-top: 6rem;
    }

    @media (max-width: 576px) {
        padding: 1rem;
        padding-top: 4rem;
    }
`

const SubTitle = styled.div`
    font-weight: 700;
    font-size: 24px;
    line-height: 36px;
    color: #FFFFFF;
    text-transform: uppercase;
    margin-bottom: 1rem;
`

const SubTitleSmall = styled(SubTitle)`
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #F8A93E;
    text-transform: none;
`

const WalletStatusWrapper = styled.div`
    background: #312624;
    border-radius: 24px;
    
    width: 387px;
    max-width: 100%;
    padding: 1.5rem 2rem;
`

const DescText = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #FFFFFF;
`

const NoneContentWrapper = styled(WalletStatusWrapper)`
    border-radius: 8px;
    padding: 1rem 2rem;
`

const ItemWrapper = styled(WalletStatusWrapper)`
    border-radius: 8px;
    padding: 1rem 2rem;
    width: 280px;
    margin-right: 2rem;
    margin-bottom: 2rem;

    @media(max-width: 576px) {
        margin-right: 0;
        margin-bottom: 1rem;
    }

    @media(max-width: 400px) {
        width: 100%;
    }
`

const ViewBidHistoryButton = styled(ModalToggleButton)`
    margin-left: 2rem;
    color: #F8A93E;

    :hover {
        color: #d18f36;
    }
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

const CurrentBid = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #FFFFFF;
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
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #FFD59D;
`

const OpenType = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    color: rgb(255, 255, 255, 0.5);
`

const MintButton = styled(PrimaryButton)`
    border-radius: 50px;
    font-size: 16px;
    line-height: 24px;
`

const TotalLocked = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #FFD59D;
`

const LockRewards = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #FFFFFF;
`

export const Profile = () => {
    const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)
    const [showMintModal, setShowMintModal] = useState(false)
    const [showBidModal, setShowBidModal] = useState(false)
    const [landInfo, setLandInfo] = useState({})

    const { account, chainId } = useWeb3React()

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    const currentBalance = parseFloat(userEthBalance?.toSignificant() as any)
    const chainLabel = NETWORK_LABEL[(chainId as keyof typeof NETWORK_LABEL)]

    const { allPlacedBids, winningBids, currentStage } = useShiberseLandAuction()

    const { landData, landPriceData, updatePriceData, isLandDataLoaded, minPrice, maxPrice } = useLandMap()

    const allBids = allPlacedBids.map((bidPos: any) => {
        const index = landData.findIndex((item: any) => Number(item.coordinates.x) === Number(bidPos[0]) && Number(item.coordinates.y) === Number(bidPos[1]))

        return {
            ...(landData[index] as any),
            ...landPriceData[ landData[index]['id'] ]
        }
    })

    const winBids = winningBids.map((bidPos: any) => {
        const index = landData.findIndex((item: any) => Number(item.coordinates.x) === Number(bidPos[0]) && Number(item.coordinates.y) === Number(bidPos[1]))

        return {
            ...(landData[index] as any),
            ...landPriceData[ landData[index]['id'] ]
        }
    })

    const lostBids = allBids.filter((item: any) => {
        const index = winBids.findIndex((wonbid: any) => wonbid.id === item.id)
        return index === -1 ? true : false
    })

    const { stakedBalance: leashStakedBalance, unlockAt: leashUnlockAt } = useShiberseStakeToken({ tokenType: 'leash' })
    const { stakedBalance: shiboshiStakedBalance, unlockAt: shiboshiUnlockAt } = useShiberseStakeNFT({ tokenType: 'shiboshi' })

    const getRemainingDays = ( timestamp: any ) => (Number( timestamp ) - (new Date().getTime()) < 0 ? 0 : Math.ceil( Number( timestamp ) - (new Date().getTime()) / 60 / 60 / 24))

    const toggleBidModal = () => setShowBidModal(prev => !prev)

    const handleBidMore = (item: any) => {
        setLandInfo({
            ...item
        })
        toggleBidModal()
    }

    return (
        <ProfileWrapper className='container'>
            <div className='relative mb-12'>
                <SubTitle>wallet</SubTitle>
                <WalletStatusWrapper className='flex flex-col'>
                    <DescText className='mb-2'>{chainLabel} Network</DescText>
                    <div className='flex'>
                        <img src={etherIcon} width='12' className='mr-2'></img>
                        <span className='text-base'>{ shortenDouble(currentBalance, 2) } ETH</span>
                    </div>
                </WalletStatusWrapper>
            </div>

            <div className='relative mb-12'>
                <SubTitle>
                    bids placed
                    <ViewBidHistoryButton onClick={() => setShowBidHistoryModal(prev => !prev)}>View Bidding History</ViewBidHistoryButton>
                </SubTitle>

                { !allBids.length ? (
                    <NoneContentWrapper>
                        <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                    </NoneContentWrapper>
                ): ( 
                    <div className='flex flex-wrap'>
                        { allBids.map((item: any, index: number) => (
                            <ItemWrapper key={`allbids${index}`}>
                                <LandInfo className='flex'>
                                    <LandImage>
                                        <img src={thumbnail} alt='pic'></img>
                                    </LandImage>

                                    <DetailInfo>
                                        <LandName>Name of Land</LandName>
                                        <LandType>{ item.tierName }</LandType>
                                        <LandCoordinates className='flex items-center mb-2'>
                                            <img src={locationImg}></img>
                                            { item.coordinates.x }, { item.coordinates.y }
                                        </LandCoordinates>
                                    </DetailInfo>
                                </LandInfo>

                                <CurrentBid className='mb-1'>Current bid placed</CurrentBid>
                                <BidBalance className='mb-2'>{ item.price } ETH</BidBalance>
                                {/* <OpenType className='mb-4'>Bid closing in 2 days</OpenType> */}
                            </ItemWrapper>
                        )) }
                    </div>
                ) }

                <BidHistoryModal 
                    isOpen={showBidHistoryModal}
                    onDismiss={() => setShowBidHistoryModal(prev => !prev)}
                    allPlacedBids={allBids}
                />
            </div>

            <div className='relative mb-12'>
                <SubTitle>
                    lost bids
                </SubTitle>

                { !lostBids.length ? (
                    <NoneContentWrapper>
                        <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                    </NoneContentWrapper>
                ): ( 
                    <div className='flex flex-wrap'>
                        { lostBids.map((item: any, index: number) => (
                            <ItemWrapper key={`allbids${index}`}>
                                <LandInfo className='flex'>
                                    <LandImage>
                                        <img src={thumbnail} alt='pic'></img>
                                    </LandImage>

                                    <DetailInfo>
                                        <LandName>Name of Land</LandName>
                                        <LandType>{ item.tierName }</LandType>
                                        <LandCoordinates className='flex items-center mb-2'>
                                            <img src={locationImg}></img>
                                            { item.coordinates.x }, { item.coordinates.y }
                                        </LandCoordinates>
                                    </DetailInfo>
                                </LandInfo>

                                <CurrentBid className='mb-1'>Current bid placed</CurrentBid>
                                <BidBalance className='mb-2'>{item.price} ETH</BidBalance>
                                {/* <OpenType className='mb-4'>Bid closing in 2 days</OpenType> */}

                                <MintButton
                                    className={`mt-2`}
                                    onClick={() => handleBidMore(item)}
                                >
                                    BID
                                </MintButton>
                            </ItemWrapper>
                        )) }
                    </div>
                ) }

                <BidModal 
                    isOpen={ showBidModal }
                    onDismiss={ toggleBidModal }
                    selectedInfo={ landInfo }
                />
            </div>

            <div className='relative mb-12'>
                <SubTitle>
                    LANDS OWNED
                    <ViewBidHistoryButton 
                        onClick={() => setShowMintModal(prev => !prev)}
                        className={`${ currentStage === Events['Bid'] ? 'hidden': '' }`}
                    >
                        Mint all at once
                    </ViewBidHistoryButton>
                </SubTitle>

                { !winBids.length ? (
                    <NoneContentWrapper>
                        <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                    </NoneContentWrapper>
                ): (
                    <div className='flex flex-wrap'>
                        { winBids.map((item: any, index: number) => (
                            <ItemWrapper key={`winBids${index}`}>
                                <LandInfo className='flex'>
                                    <LandImage>
                                        <img src={thumbnail} alt='pic'></img>
                                    </LandImage>

                                    <DetailInfo>
                                        <LandName>Name of Land</LandName>
                                        <LandType>{ item.tierName }</LandType>
                                        <LandCoordinates className='flex items-center'>
                                            <img src={locationImg}></img>
                                            { item.coordinates.x }, { item.coordinates.y }
                                        </LandCoordinates>
                                    </DetailInfo>
                                </LandInfo>

                                <MintButton
                                    className={`mt-2 ${ currentStage === Events['Bid'] ? 'hidden': '' }`}
                                >
                                        MINT
                                </MintButton>
                            </ItemWrapper>
                        )) }
                    </div>
                ) }

                <MintModal 
                    isOpen={showMintModal}
                    onDismiss={() => setShowMintModal(prev => !prev)}
                />
            </div>

            <div className='relative'>
                <SubTitleSmall>
                    Unlock
                </SubTitleSmall>

                {/* <NoneContentWrapper>
                    <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                </NoneContentWrapper> */}

                <div className='flex flex-wrap'>
                    <ItemWrapper>
                        <TotalLocked className='mb-4'>Total LEASH locked: { leashStakedBalance }</TotalLocked>
                        {/* <LockRewards className='flex justify-between mb-4'>
                            <span>Rewards</span>
                            <span>0.2 LEASH</span>
                        </LockRewards> */}

                        <MintButton 
                            disabled={ Number(leashStakedBalance) === 0 || (new Date().getTime()) <= Number( leashUnlockAt ) ? true : false }
                            className='mb-4'>
                                UNLOCK
                        </MintButton>

                        <OpenType>Your locking will end in { getRemainingDays( leashUnlockAt ) } days</OpenType>
                    </ItemWrapper>

                    <ItemWrapper className='flex flex-col justify-between'>
                        <TotalLocked className='mb-4'>Total Shiboshis locked: { shiboshiStakedBalance }</TotalLocked>
                        <div>
                            <MintButton 
                                disabled={ Number(shiboshiStakedBalance) === 0 || (new Date().getTime()) <= Number( shiboshiUnlockAt ) ? true : false }
                                className='mb-4'>
                                    UNLOCK
                            </MintButton>

                            <OpenType>Your locking will end in { getRemainingDays( shiboshiUnlockAt ) } days</OpenType>
                        </div>
                    </ItemWrapper>
                </div>
            </div>
        </ProfileWrapper>
    )
}

export default Profile