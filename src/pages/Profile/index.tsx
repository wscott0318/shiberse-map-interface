import React, { useState } from 'react'
import styled from 'styled-components'
import etherIcon from 'assets/images/profile/ether.svg'
import { ModalToggleButton, PrimaryButton } from 'theme'
import BidHistoryModal from 'components/BidHistoryModal'
import locationImg from 'assets/images/map/location.svg'
import {MintWinningModal, MintWinningMultiModal} from './mintWinningModal'
import { useWeb3React } from '@web3-react/core'
import { useETHBalances } from 'state/wallet/hooks'
import { NETWORK_LABEL } from 'constants/networks'
import { formatFromBalance, shortenDouble } from 'utils'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
import { Events } from 'constants/map'
import useShiberseStakeToken from 'hooks/useShiberseStakeToken'
import useShiberseStakeNFT from 'hooks/useShiberseStakeNFT'
import BidModal from 'components/Map/bidModal'
import useLandMap from 'hooks/useLandMap'
import { getLandImage, getLandName } from 'utils/mapHelper'
import ShiberseLoader from 'components/Loader/loader'
import { useIsTransactionPending } from 'state/transactions/hooks'

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
    const [showMintMultiModal, setShowMintMultiModal] = useState(false)
    const [showBidModal, setShowBidModal] = useState(false)
    const [landInfo, setLandInfo] = useState({})

    const { account, chainId } = useWeb3React()

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    const currentBalance = parseFloat(userEthBalance?.toSignificant() as any)
    const chainLabel = NETWORK_LABEL[(chainId as keyof typeof NETWORK_LABEL)]

    const { allPlacedBids, winningBids, currentStage, loadingBidsInfo, landNFTs } = useShiberseLandAuction({})

    const { landData, landPriceData, accountBidsInfo, isLandDataLoaded } = useLandMap()

    const allBids = isLandDataLoaded ? allPlacedBids.map((bidPos: any) => {
        const index = landData.findIndex((item: any) => Number(item.coordinates.x) === Number(bidPos[0]) && Number(item.coordinates.y) === Number(bidPos[1]))

        return {
            ...(landData[index] as any),
            ...landPriceData[ landData[index]['id'] ],
            price: Number( formatFromBalance(bidPos[2], 18) )
        }
    }): []

    const winBids = isLandDataLoaded ? winningBids.map((bidPos: any) => {
        const index = landData.findIndex((item: any) => Number(item.coordinates.x) === Number(bidPos[0]) && Number(item.coordinates.y) === Number(bidPos[1]))

        return {
            ...(landData[index] as any),
            ...landPriceData[ landData[index]['id'] ],
            price: Number( formatFromBalance(bidPos[2], 18) )
        }
    }): []

    const lostBids = allBids.filter((item: any) => {
        const index = winBids.findIndex((wonbid: any) => wonbid.id === item.id)
        return index === -1 ? true : false
    })

    const toMintLands = winBids.filter((item: any) => {
        const index = landNFTs.findIndex((land: any) => Number(land.id.tokenId) === Number(item.id))
        return index === -1 ? true : false
    })

    const mintedLands = winBids.filter((item: any) => {
        const index = landNFTs.findIndex((land: any) => Number(land.id.tokenId) === Number(item.id))
        return index !== -1 ? true : false
    })

    const { stakedBalance: leashStakedBalance, unlockAt: leashUnlockAt, unlock: unLockLeash } = useShiberseStakeToken({ tokenType: 'leash' })
    const { stakedBalance: shiboshiStakedBalance, unlockAt: shiboshiUnlockAt, unlock: unLockShiboshi } = useShiberseStakeNFT({ tokenType: 'shiboshi' })

    const getRemainingDays = ( timestamp: any ) => ( Number( timestamp ) * 1000 - new Date().getTime()) < 0 ? 0 : Math.ceil( (Number( timestamp ) * 1000 - new Date().getTime()) / 1000 / 60 / 60 / 24)

    const toggleBidModal = () => setShowBidModal(prev => !prev)

    const toggleMintModal = () => setShowMintModal(prev => !prev)
    const toggleMintMultiModal = () => setShowMintMultiModal(prev => !prev)

    const handleBidMore = (item: any) => {
        setLandInfo({
            ...item
        })
        toggleBidModal()
    }

    const handleMintOne = (item: any) => {
        setLandInfo({
            ...item
        })
        toggleMintModal()
    }

    const isBidEvent = currentStage === Events['Bid']

    const [ pendingUnlockLeashTx, setPendingUnlockLeashTx ] = useState<string | null>(null)
    const [ pendingUnlockShiboshiTx, setPendingUnlockShiboshiTx ] = useState<string | null>(null)

    const isPendingUnlockLeash = useIsTransactionPending(pendingUnlockLeashTx ?? undefined)
    const isPendingUnlockShiboshi = useIsTransactionPending(pendingUnlockShiboshiTx ?? undefined)

    const isConfirmedUnlockLeashTx = pendingUnlockLeashTx !== null && !isPendingUnlockLeash
    const isConfirmedUnlockShiboshiTx = pendingUnlockShiboshiTx !== null && !isPendingUnlockShiboshi

    const handleUnLockLeash = async () => {
        const tx = await unLockLeash()

        if( tx.hash )
            setPendingUnlockLeashTx(tx.hash)
    }

    const handleUnLockShiboshi = async () => {
        const tx = await unLockShiboshi()

        if( tx.hash )
            setPendingUnlockShiboshiTx(tx.hash)
    }

    return (
        <ProfileWrapper className='container'>
            <div className='relative mb-12'>
                <SubTitle>wallet</SubTitle>
                <WalletStatusWrapper className='flex flex-col'>
                    <DescText className='mb-2'>{chainLabel} Network</DescText>
                    <div className='flex'>
                        <img src={etherIcon} width='12' className='mr-2' alt='pic'></img>
                        <span className='text-base'>{ shortenDouble(currentBalance, 2) } ETH</span>
                    </div>
                </WalletStatusWrapper>
            </div>

            {( isBidEvent ? (
                <div className='relative mb-12'>
                    <SubTitle>
                        lost bids

                        <span className='ml-4 text-sm font-normal normal-case'>You can bid again on the lost bids</span>
                    </SubTitle>

                    { loadingBidsInfo ? (
                        <NoneContentWrapper className='flex justify-center'>
                            <ShiberseLoader size='36px'/>
                        </NoneContentWrapper>
                    ): !lostBids.length ? (
                        <NoneContentWrapper>
                            <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                        </NoneContentWrapper>
                    ): ( 
                        <div className='flex flex-wrap'>
                            { lostBids.map((item: any, index: number) => (
                                <ItemWrapper key={`allbids${index}`}>
                                    <LandInfo className='flex'>
                                        <LandImage>
                                            <img src={getLandImage(item?.tierName)} alt='pic'></img>
                                        </LandImage>

                                        <DetailInfo>
                                            <LandName>Land</LandName>
                                            <LandType>{ getLandName(item.tierName, item) }</LandType>
                                            <a target={'_blank'} rel="noreferrer" href={`/#/map?x=${item.coordinates.x}&y=${item.coordinates.y}`}>
                                                <LandCoordinates className='flex items-center mb-2'>
                                                    <img src={locationImg}></img>
                                                    { item.coordinates.x }, { item.coordinates.y }
                                                </LandCoordinates>
                                            </a>
                                        </DetailInfo>
                                    </LandInfo>

                                    <CurrentBid className='mb-1'>Current bid</CurrentBid>
                                    <BidBalance className='mb-2'>{Number(item.price).toFixed(2)} ETH</BidBalance>
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
            ): null )}

            { isBidEvent ? (
                <div className='relative mb-12'>
                    <SubTitle>
                        { isBidEvent ? 'leading bids' : 'won bids' }
                    </SubTitle>

                    { loadingBidsInfo ? (
                        <NoneContentWrapper className='flex justify-center'>
                            <ShiberseLoader size='36px'/>
                        </NoneContentWrapper>
                    ): !winBids.length ? (
                        <NoneContentWrapper>
                            <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                        </NoneContentWrapper>
                    ): (
                        <div className='flex flex-wrap'>
                            { winBids.map((item: any, index: number) => (
                                <ItemWrapper key={`winBids${index}`}>
                                    <LandInfo className='flex'>
                                        <LandImage>
                                            <img src={getLandImage(item?.tierName)} alt='pic'></img>
                                        </LandImage>

                                        <DetailInfo>
                                            <LandName>Land</LandName>
                                            <LandType>{ getLandName(item.tierName, item) }</LandType>
                                            <a target={'_blank'} rel="noreferrer" href={`/#/map?x=${item.coordinates.x}&y=${item.coordinates.y}`}>
                                                <LandCoordinates className='flex items-center'>
                                                    <img src={locationImg} alt='pic'></img>
                                                    { item.coordinates.x }, { item.coordinates.y }
                                                </LandCoordinates>
                                            </a>
                                        </DetailInfo>
                                    </LandInfo>
                                </ItemWrapper>
                            )) }
                        </div>
                    ) }
                </div>
            ): null }

            { !isBidEvent ? (
                <>
                    <div className='relative mb-12'>
                        <SubTitle>
                            To Mint Lands

                            <ViewBidHistoryButton 
                                onClick={() => toggleMintMultiModal()}
                                className={`${ loadingBidsInfo || !toMintLands.length ? 'hidden': '' }`}
                            >
                                Mint all at once
                            </ViewBidHistoryButton>
                        </SubTitle>

                        { loadingBidsInfo ? (
                            <NoneContentWrapper className='flex justify-center'>
                                <ShiberseLoader size='36px'/>
                            </NoneContentWrapper>
                        ): !toMintLands.length ? (
                            <NoneContentWrapper>
                                <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                            </NoneContentWrapper>
                        ): (
                            <div className='flex flex-wrap'>
                                { toMintLands.map((item: any, index: number) => (
                                    <ItemWrapper key={`toMintLands${index}`}>
                                        <LandInfo className='flex'>
                                            <LandImage>
                                                <img src={getLandImage(item?.tierName)} alt='pic'></img>
                                            </LandImage>

                                            <DetailInfo>
                                                <LandName>Land</LandName>
                                                <LandType>{ getLandName(item.tierName, item) }</LandType>
                                                <a target={'_blank'} rel="noreferrer" href={`/#/map?x=${item.coordinates.x}&y=${item.coordinates.y}`}>
                                                    <LandCoordinates className='flex items-center'>
                                                        <img src={locationImg} alt='pic'></img>
                                                        { item.coordinates.x }, { item.coordinates.y }
                                                    </LandCoordinates>
                                                </a>
                                            </DetailInfo>
                                        </LandInfo>

                                        <MintButton
                                            className={`mt-2 ${ isBidEvent ? 'hidden': '' }`}
                                            onClick={ () => handleMintOne(item) }
                                        >
                                            MINT
                                        </MintButton>
                                    </ItemWrapper>
                                )) }
                            </div>
                        ) }

                        <MintWinningMultiModal 
                            isOpen={showMintMultiModal}
                            onDismiss={toggleMintMultiModal}
                            winBids={toMintLands}
                        />

                        <MintWinningModal 
                            isOpen={showMintModal}
                            onDismiss={toggleMintModal}
                            landInfo={ landInfo }
                        />
                    </div>

                    <div className='relative mb-12'>
                        <SubTitle>
                            Minted Lands

                            <ViewBidHistoryButton 
                                onClick={() => toggleMintMultiModal()}
                                className={`${ loadingBidsInfo || mintedLands.length < 2 ? 'hidden': '' }`}
                            >
                                Mint all at once
                            </ViewBidHistoryButton>
                        </SubTitle>

                        { loadingBidsInfo ? (
                            <NoneContentWrapper className='flex justify-center'>
                                <ShiberseLoader size='36px'/>
                            </NoneContentWrapper>
                        ): !mintedLands.length ? (
                            <NoneContentWrapper>
                                <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                            </NoneContentWrapper>
                        ): (
                            <div className='flex flex-wrap'>
                                { mintedLands.map((item: any, index: number) => (
                                    <ItemWrapper key={`mintedLands${index}`}>
                                        <LandInfo className='flex'>
                                            <LandImage>
                                                <img src={getLandImage(item?.tierName)} alt='pic'></img>
                                            </LandImage>

                                            <DetailInfo>
                                                <LandName>Land</LandName>
                                                <LandType>{ getLandName(item.tierName, item) }</LandType>
                                                <a target={'_blank'} rel="noreferrer" href={`/#/map?x=${item.coordinates.x}&y=${item.coordinates.y}`}>
                                                    <LandCoordinates className='flex items-center'>
                                                        <img src={locationImg} alt='pic'></img>
                                                        { item.coordinates.x }, { item.coordinates.y }
                                                    </LandCoordinates>
                                                </a>
                                            </DetailInfo>
                                        </LandInfo>
                                    </ItemWrapper>
                                )) }
                            </div>
                        ) }
                    </div>
                </>
            ): null }


            <div className='relative mb-12'>
                <SubTitle>
                    bids placed
                    <ViewBidHistoryButton onClick={() => setShowBidHistoryModal(prev => !prev)}>View Bidding History</ViewBidHistoryButton>
                </SubTitle>

                { loadingBidsInfo ? (
                    <NoneContentWrapper className='flex justify-center'>
                        <ShiberseLoader size='36px'/>
                    </NoneContentWrapper>
                ): !allBids.length ? (
                    <NoneContentWrapper>
                        <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                    </NoneContentWrapper>
                ): ( 
                    <div className='flex flex-wrap'>
                        { allBids.map((item: any, index: number) => (
                            <ItemWrapper key={`allbids${index}`}>
                                <LandInfo className='flex'>
                                    <LandImage>
                                        <img src={getLandImage(item?.tierName)} alt='pic'></img>
                                    </LandImage>

                                    <DetailInfo>
                                        <LandName>Land</LandName>
                                        <LandType>{ getLandName(item.tierName, item) }</LandType>
                                        <a target={'_blank'} rel="noreferrer" href={`/#/map?x=${item.coordinates.x}&y=${item.coordinates.y}`}>
                                            <LandCoordinates className='flex items-center mb-2'>
                                                <img src={locationImg}></img>
                                                { item.coordinates.x }, { item.coordinates.y }
                                            </LandCoordinates>
                                        </a>
                                    </DetailInfo>
                                </LandInfo>

                                <CurrentBid className='mb-1'>Current bid</CurrentBid>
                                <BidBalance className='mb-2'>{ Number(item.price).toFixed(2) } ETH</BidBalance>
                                {/* <OpenType className='mb-4'>Bid closing in 2 days</OpenType> */}
                            </ItemWrapper>
                        )) }
                    </div>
                ) }

                <BidHistoryModal 
                    isOpen={showBidHistoryModal}
                    onDismiss={() => setShowBidHistoryModal(prev => !prev)}
                    allPlacedBids={allBids}
                    bidsInfo={accountBidsInfo}
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
                            onClick={ handleUnLockLeash }
                            disabled={ ((!isConfirmedUnlockLeashTx && pendingUnlockLeashTx) || Number(leashStakedBalance) === 0 || ( new Date().getTime() <= Number(leashUnlockAt) * 1000 )) ? true : false }
                            className='mb-4'>
                                { (isConfirmedUnlockLeashTx || !pendingUnlockLeashTx) ? 'UNLOCK' : <ShiberseLoader size='30px' /> }
                        </MintButton>

                        <OpenType>Your locking will end in { getRemainingDays( leashUnlockAt ) } days</OpenType>
                    </ItemWrapper>

                    <ItemWrapper className='flex flex-col justify-between'>
                        <TotalLocked className='mb-4'>Total Shiboshis locked: { shiboshiStakedBalance }</TotalLocked>
                        <div>
                            <MintButton 
                                onClick={ handleUnLockShiboshi }
                                disabled={ ((!isConfirmedUnlockShiboshiTx && pendingUnlockShiboshiTx) || Number(shiboshiStakedBalance) === 0 || ( new Date().getTime() <= Number(shiboshiUnlockAt) * 1000 )) ? true : false }
                                className='mb-4'>
                                    { (isConfirmedUnlockShiboshiTx || !pendingUnlockShiboshiTx) ? 'UNLOCK' : <ShiberseLoader size='30px' /> }
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