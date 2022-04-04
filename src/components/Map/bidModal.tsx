import React, { useEffect } from 'react'
import styled from 'styled-components'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { NormalButton } from 'theme'
import confirmIcon from '../../assets/images/map/confirmIcon.svg'
import Loader from '../Loader'

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 500;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`

const ConnectWalletWrapper = styled.div`
    padding: 1rem;
    text-align: center;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
    `};
`

const CloseIcon = styled.div`
    position: absolute;
    right: .5rem;
    top: 0;
    z-index: 10;
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`

const CloseColor = styled(Close)`
    path {
        stroke: ${({ theme }) => theme.text4};
    }
`

const HeaderText = styled.div`
    padding: 1rem 0;

    :hover {
        cursor: pointer;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        font-size: 1.5rem !important;
        line-height: 1.7rem !important;
        margin-top: 1rem;
    `};

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
        font-size: 1.3rem !important;
        line-height: 1.5rem !important;
        margin-top: 1rem;
    `};
`

const HeaderDescription = styled.div`
    color: rgb(255, 255, 255, 0.5);
    font-size: 14px;
    line-height: 21px;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
    `};

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
        font-size: 0.9rem !important;
    `};
`

const ContentWrapper = styled.div`
    padding: 1.5rem 0;
    width: 384px;
    max-width: 100%;
`

const InputDesc = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 120%;
    color: #FFD59D;
`

const BidInput = styled.input`
    width: 100%;
    height: 50px;
    padding: 1rem;
    padding-right: 45px;
    background: rgb(78, 58, 38, 0.3);
    border-radius: 8px;

    font-weight: 400;
    font-size: 16px;
    line-height: 19.2px;
    color: #FFFFFF;
    border: none;

    &:active, &:focus {
        border: 1px solid rgba(185, 106, 5, 0.8);
    }
`

const ScaleText = styled.span`
    position: absolute;
    right: .5rem;
    font-weight: 400;
    font-size: 16px;
    line-height: 19.2px;
    color: #FFD59D;
    transform: translateY(-50%);
    top: 50%;
`

const BalanceWrapper = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #FFFFFF;
    margin: 1rem 0;
    margin-bottom: 0;
`

const HeaderIcon = styled.div`
    padding: 2rem 0;
    padding-bottom: 0;

    img {
        width: 40px;
    }
`

const BidValue = styled.div`
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    text-align: center;
    color: #FFD59D;
`

export const BidModal = (props: any) => {
    return (
        <Modal isOpen={ props.isOpen } onDismiss={ props.onDismiss } minHeight={false} maxHeight={80}>
            <UpperSection>
                <CloseIcon onClick={ props.onDismiss }>
                    <CloseColor />
                </CloseIcon>

                <ConnectWalletWrapper className='relative flex flex-col items-center'>
                    <>
                        <HeaderText className='text-center text-3xl'>Place a bid</HeaderText>
                        <HeaderDescription className='text-center'>You are about to bid for a Land.</HeaderDescription>
                        <HeaderDescription className='text-center'>Bids will close in 3 days.</HeaderDescription>
                    </>

                    <ContentWrapper className='relative'>
                       <InputDesc className='text-left mb-2'>Amount</InputDesc>

                       <div className='relative'>
                           <BidInput type='text' />
                           <ScaleText>ETH</ScaleText>
                       </div>
                       
                        <BalanceWrapper className='flex justify-between w-full'>
                            <span>Your balance</span>
                            <span>1.254689 ETH</span>
                        </BalanceWrapper>
                    </ContentWrapper>


                    <NormalButton className='px-14' onClick={ props.onDismiss }>
                        BID
                    </NormalButton>
                </ConnectWalletWrapper>

                {/* <ConnectWalletWrapper className='relative flex flex-col items-center'>
                    <>
                        <HeaderIcon><img src={confirmIcon}/></HeaderIcon>
                        <HeaderText className='text-center text-3xl'>Bid confirmed</HeaderText>
                        <HeaderDescription className='text-center'>Your ETH have been locked until the end of the event.</HeaderDescription>
                        <HeaderDescription className='text-center'>If you are outbid, your locked ETH will be returned to your wallet.</HeaderDescription>
                    </>

                    <div className='py-4 pt-8'>
                        <HeaderDescription className='text-center'>Your bid</HeaderDescription>
                        <BidValue>1.2625 ETH</BidValue>
                    </div>
                </ConnectWalletWrapper> */}
            </UpperSection>
        </Modal>
    )
}

export default BidModal