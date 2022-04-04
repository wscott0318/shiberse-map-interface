import React, { useState } from 'react'
import styled from 'styled-components'
import etherIcon from 'assets/images/profile/ether.svg'
import { ModalToggleButton, PrimaryButton } from 'theme'
import BidHistoryModal from 'components/BidHistoryModal'
import thumbnail from 'assets/images/map/thumbnail.png'
import locationImg from 'assets/images/map/location.svg'
import MintModal from './mintModal'

const ProfileWrapper = styled.div`
    position: relative;
    padding: 5rem;
    padding-top: 8rem;
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

const LandName = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #FFFFFF;
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

    return (
        <ProfileWrapper className='container'>
            <div className='relative mb-12'>
                <SubTitle>wallet</SubTitle>
                <WalletStatusWrapper className='flex flex-col'>
                    <DescText className='mb-2'>Mainnet Network</DescText>
                    <div className='flex'>
                        <img src={etherIcon} width='12' className='mr-2'></img>
                        <span className='text-base'>0.00 ETH</span>
                    </div>
                </WalletStatusWrapper>
            </div>

            <div className='relative'>
                <SubTitle>
                    bids placed
                    <ViewBidHistoryButton onClick={() => setShowBidHistoryModal(prev => !prev)}>View Bidding History</ViewBidHistoryButton>
                </SubTitle>

                {/* <NoneContentWrapper>
                    <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                </NoneContentWrapper> */}

                <div className='flex flex-wrap'>
                    <ItemWrapper>
                        <LandInfo className='flex'>
                            <LandImage>
                                <img src={thumbnail} alt='pic'></img>
                            </LandImage>

                            <DetailInfo>
                                <LandName>Name of Land</LandName>
                                <LandType>Tier 1</LandType>
                                <LandCoordinates className='flex items-center mb-2'>
                                    <img src={locationImg}></img>
                                    Coordinates
                                </LandCoordinates>
                            </DetailInfo>
                        </LandInfo>

                        <LandName className='mb-1'>Current bid placed</LandName>
                        <BidBalance className='mb-2'>1.2625 ETH</BidBalance>
                        <OpenType className='mb-4'>Bid closing in 2 days</OpenType>
                    </ItemWrapper>
                </div>

                <BidHistoryModal 
                    isOpen={showBidHistoryModal}
                    onDismiss={() => setShowBidHistoryModal(prev => !prev)}
                />
            </div>

            <div className='relative'>
                <SubTitle>
                    LANDS OWNED
                    <ViewBidHistoryButton onClick={() => setShowMintModal(prev => !prev)}>Mint all at once</ViewBidHistoryButton>
                </SubTitle>

                {/* <NoneContentWrapper>
                    <div className='text-base' style={{ color: 'rgb(255, 255, 255, 0.5)' }}>None</div>
                </NoneContentWrapper> */}

                <div className='flex flex-wrap'>
                    <ItemWrapper>
                        <LandInfo className='flex'>
                            <LandImage>
                                <img src={thumbnail} alt='pic'></img>
                            </LandImage>

                            <DetailInfo>
                                <LandName>Name of Land</LandName>
                                <LandType>Tier 1</LandType>
                                <LandCoordinates className='flex items-center mb-2'>
                                    <img src={locationImg}></img>
                                    Coordinates
                                </LandCoordinates>
                            </DetailInfo>
                        </LandInfo>

                        <MintButton>MINT</MintButton>
                    </ItemWrapper>
                </div>

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
                        <TotalLocked className='mb-4'>Total LEASH locked: 5</TotalLocked>
                        <LockRewards className='flex justify-between mb-4'>
                            <span>Rewards</span>
                            <span>0.2 LEASH</span>
                        </LockRewards>

                        <MintButton disabled className='mb-4'>UNLOCK</MintButton>

                        <OpenType>Your locking will end in 90 days</OpenType>
                    </ItemWrapper>

                    <ItemWrapper className='flex flex-col justify-between'>
                        <TotalLocked className='mb-4'>Total Shiboshis locked: 10</TotalLocked>
                        <div>
                            <MintButton disabled className='mb-4'>UNLOCK</MintButton>

                            <OpenType>Your locking will end in 90 days</OpenType>
                        </div>
                    </ItemWrapper>
                </div>
            </div>
        </ProfileWrapper>
    )
}

export default Profile