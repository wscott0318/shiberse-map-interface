import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { NormalButton } from 'theme'
import confirmIcon from '../../assets/images/map/confirmIcon.svg'
import { useWeb3React } from '@web3-react/core'
import { useETHBalances } from 'state/wallet/hooks'
import { formatBalance, formatFromBalance, formatToBalance, parseBalance, shortenDouble } from 'utils'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
import { useIsTransactionPending } from 'state/transactions/hooks'
import ShiberseLoader from 'components/Loader/loader'
import Loader from 'components/Loader'
import { ethers } from 'ethers'

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

const ValidationText = styled.p`
    font-size: 14px;
`

export const BidMultiModal = (props: any) => {
    const { account } = useWeb3React()
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    const currentBalance = parseFloat(userEthBalance?.toSignificant() as any)

    const { bidMulti, bidShiboshiZoneMulti, fetchLandPrice } = useShiberseLandAuction({})

    const [bidPrice, setBidPrice] = useState(Number(props.selectedInfo.price))
    const [totalPrice, setTotalPrice] = useState()

    const [isLoading, setIsLoading] = useState(true)

    const [ priceArray, setPriceArray ] = useState([]) as any

    useEffect(() => {
        const getPrice = async () => {
            if (props.isOpen && props.selectedInfo.length > 0) {
                setIsLoading(true)

                let totalPrice
                const pArray = [] as any
                for( let i = 0; i < props.selectedInfo.length; i++ ) {
                    const price = await fetchLandPrice({ x: props.selectedInfo[i].coordinates.x, y: props.selectedInfo[i].coordinates.y })
                    if( !totalPrice )
                        totalPrice = price
                    else
                        totalPrice = totalPrice.add(price)

                    pArray.push( price )
                }
    
                setBidPrice( Number( formatFromBalance(totalPrice, 18) ) )
                setTotalPrice( totalPrice )
                setPriceArray( [ ...pArray ] )
                setIsLoading(false)
            }
        }

        getPrice()
    }, [props.isOpen]);
    
    const [validateText, setValidateText] = useState(null) as any
    const [ pendingTx, setPendingTx ] = useState<string | null>(null)

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

    const isConfirmedBid = pendingTx !== null && !isPending

    const handleBid = async () => {
        
        if( Number(bidPrice) > Number(currentBalance) )
            setValidateText('Insufficient ETH balance!')
        else {
            setValidateText(null)

            const inputData = {
                totalAmount: totalPrice, 
                xArray: [],
                yArray: [],
                priceArray: priceArray
            } as any

            for( let i = 0; i < props.selectedInfo.length; i++ ) {
                inputData.xArray.push( props.selectedInfo[i].coordinates.x )
                inputData.yArray.push( props.selectedInfo[i].coordinates.y )
            }

            let tx
            if( props.selectedInfo.findIndex((item: any) => item.isShiboshiZone) !== -1 ) { /* Show shiboshizone */
                tx = await bidShiboshiZoneMulti(inputData)
                if( tx.hash )
                    setPendingTx(tx.hash)
            } else {
                tx = await bidMulti(inputData)
                if( tx.hash )
                    setPendingTx(tx.hash)
            }

            if( !tx.hash ) {
                if( JSON.stringify(tx.message).includes('ERR_INSUFFICIENT_AMOUNT_SENT') ) {
                    setValidateText('Minimum bid amount not met, try some higher amount')
                } else if( JSON.stringify(tx.message).includes('ERR_CANNOT_OUTBID_YOURSELF') ) {
                    setValidateText('You cannot outbid yourself')
                }
            }
        }
    }

    const handleOnDismiss = () => {
        setValidateText(null)
        setPendingTx(null)

        props.onDismiss()
    }

    useEffect(() => {
        if( isConfirmedBid ) {
            if( props.handleCloseAction ) {
                setTimeout(() => {
                    props.handleCloseAction()
                }, 1500)
            }
        }
    }, [isConfirmedBid])

    return (
        <Modal isOpen={ props.isOpen } onDismiss={ handleOnDismiss } minHeight={false} maxHeight={80}>
            <UpperSection>
                <CloseIcon onClick={ handleOnDismiss }>
                    <CloseColor />
                </CloseIcon>

                { !isConfirmedBid ? (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <>
                            <HeaderText className='text-center text-3xl'>Place a bid</HeaderText>
                            <HeaderDescription className='text-center'>You are about to bid for a Land.</HeaderDescription>
                            <HeaderDescription className='text-center'>Bids will close in 3 days.</HeaderDescription>
                        </>

                        <ContentWrapper className='relative'>
                            <InputDesc className='text-left mb-2'>Lands To Bid</InputDesc>
                            <p className='text-left'>{ props.selectedInfo.map((item: any) => `(${ item.coordinates.x }, ${ item.coordinates.y }) `) }</p>

                            <InputDesc className='text-left mb-2 mt-4'>Total Bid Amount</InputDesc>
                            <p className='text-left'>{ isLoading ? <Loader stroke="white" /> : `${shortenDouble(bidPrice, 2)} ETH` }</p>
                        
                            <BalanceWrapper className='flex justify-between w-full'>
                                <span>Your balance</span>
                                <span>{ currentBalance ? shortenDouble( currentBalance, 5) : 0 } ETH</span>
                            </BalanceWrapper>

                            <ValidationText className={`text-red ${!validateText ? 'hidden' : ''}`}>{ validateText }</ValidationText>
                        </ContentWrapper>

                        <NormalButton className='px-14 flex justify-center items-center' onClick={ handleBid } disabled={ isPending || isLoading ? true : false }>
                            BID { isPending ? <ShiberseLoader className='ml-1' /> : null }
                        </NormalButton>
                    </ConnectWalletWrapper>
                ) : (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <>
                            <HeaderIcon><img src={confirmIcon}/></HeaderIcon>
                            <HeaderText className='text-center text-3xl'>Bid confirmed</HeaderText>
                            <HeaderDescription className='text-center'>Your ETH have been locked until the end of the event.</HeaderDescription>
                            <HeaderDescription className='text-center'>If you are outbid, your locked ETH will be returned to your wallet.</HeaderDescription>
                        </>

                        <div className='py-4 pt-8'>
                            <HeaderDescription className='text-center'>Your bid</HeaderDescription>
                            <BidValue>{ bidPrice } ETH</BidValue>
                        </div>
                    </ConnectWalletWrapper>
                ) }
            </UpperSection>
        </Modal>
    )
}

export default BidMultiModal