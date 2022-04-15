import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { NormalButton } from 'theme'
import Modal from 'components/Modal'
import ShiberseLoader from 'components/Loader/loader'
import confirmIcon from '../../assets/images/map/confirmIcon.svg'
import { formatFromBalance, shortenDouble } from 'utils'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useWeb3React } from '@web3-react/core'
import { useETHBalances } from 'state/wallet/hooks'
import Loader from 'components/Loader'

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
    padding: 1.5rem 1.5rem;
    background: #312624;
    border-radius: 24px;
    width: 460px;
    max-width: 100%;
    margin: 2rem 0;
`

const BalanceWrapper = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: rgb(255, 255, 255, 0.5);
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

const MintWrapper = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #FFFFFF;
`

const ControlButton = styled.button`
    border: 1px solid #785838;
    box-sizing: border-box;
    border-radius: 2px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
        color: #B96A05;
    }

    :disabled {
        cursor: not-allowed;
        color: white;
        opacity: 0.5;
    }
`

const ValidationText = styled.p`
    font-size: 14px;
`

export const MintModal = (props: any) => {
    const { account } = useWeb3React()
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    const currentBalance = parseFloat(userEthBalance?.toSignificant() as any)

    const [validateText, setValidateText] = useState(null) as any
    const [ pendingTx, setPendingTx ] = useState<string | null>(null)

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

    const isConfirmedTx = pendingTx !== null && !isPending

    const { mintPrivate, mintPrivateShiboshiZone } = useShiberseLandAuction({})

    useEffect(() => {
        if( props.isOpen ) {
            setPendingTx(null)
            setValidateText(null)
        }
    }, [props.isOpen])

    const handleMint = async () => {

        if( Number(currentBalance) < Number(props.landInfo.price) ) {
            setValidateText('Insufficient ETH balance!')
            return
        }

        setValidateText(null)

        const inputData = {
            x: props.landInfo?.coordinates?.x,
            y: props.landInfo?.coordinates?.y,
            amount: props.landInfo?.bigNumPrice,
        } as any

        let tx
        if( props.landInfo?.isShiboshiZone ) { /* Show shiboshizone */
            tx = await mintPrivateShiboshiZone(inputData)
            if( tx.hash )
                setPendingTx(tx.hash)
        } else {
            tx = await mintPrivate( inputData )
            if( tx.hash )
                setPendingTx(tx.hash)
        }

        if( !tx.hash ) {
            if( JSON.stringify(tx.message).includes('ERR_INSUFFICIENT_AMOUNT_SENT') ) {
                setValidateText('Minimum bid amount not met, try some higher amount')
            }
        }
    }

    return (
        <Modal isOpen={ props.isOpen } onDismiss={ props.onDismiss } minHeight={false} maxHeight={80}>
            <UpperSection>
                <CloseIcon onClick={ props.onDismiss }>
                    <CloseColor />
                </CloseIcon>

                { !isConfirmedTx && !isPending ? (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <>
                            <HeaderText className='text-center text-3xl'>Mint Land</HeaderText>
                            <HeaderDescription className='text-center'>You are about to mint for a Land.</HeaderDescription>
                        </>

                        <ContentWrapper className='relative'>
                            <MintWrapper className='flex justify-between w-full'>
                                <div>Mint Land</div>
                                <div className='flex justify-center items-center'>
                                    ({`${ props.landInfo.coordinates?.x }, ${ props.landInfo.coordinates?.y }`})
                                </div>
                            </MintWrapper>
                            
                            <BalanceWrapper className='flex justify-between w-full'>
                                <span>{ shortenDouble( Number(props.landInfo.price), 2 ) } ETH</span>
                                <span>Current Balance: { shortenDouble( Number(currentBalance), 2 ) } ETH</span>
                            </BalanceWrapper>

                            <ValidationText className={`text-red ${!validateText ? 'hidden' : ''}`}>{ validateText }</ValidationText>
                        </ContentWrapper>

                        <NormalButton className='px-12' onClick={ handleMint }>
                            MINT
                        </NormalButton>
                    </ConnectWalletWrapper>
                ) : isPending ? (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <div className='my-4 mt-8'>
                            <ShiberseLoader size='30px' />
                        </div>
                        <>
                            <HeaderText className='text-center text-3xl'>Minting in progress</HeaderText>
                            <HeaderDescription className='text-center'>This process can take few minutes.</HeaderDescription>
                            <HeaderDescription className='text-center mb-8'>Once transaction is over, it will be added to your wallet.</HeaderDescription>
                        </>
                    </ConnectWalletWrapper>
                ) : (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <>
                            <HeaderIcon><img src={confirmIcon}/></HeaderIcon>
                            <HeaderText className='text-center text-3xl'>Minting succesful</HeaderText>
                            <HeaderDescription className='text-center'>WOOF!</HeaderDescription>
                            <HeaderDescription className='text-center mb-8'>Your lands have been minted and they are available in your wallet.</HeaderDescription>
                        </>
                    </ConnectWalletWrapper>
                ) }
            </UpperSection>
        </Modal>
    )
}

export const MintMultiModal = (props: any) => {
    const { account } = useWeb3React()
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    const currentBalance = parseFloat(userEthBalance?.toSignificant() as any)

    const [validateText, setValidateText] = useState(null) as any
    const [ pendingTx, setPendingTx ] = useState<string | null>(null)

    const [formattedTotalPrice, setFormattedTotalPrice] = useState(0)
    const [totalPrice, setTotalPrice] = useState()

    const [isLoading, setIsLoading] = useState(true)

    const [ priceArray, setPriceArray ] = useState([]) as any

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

    const isConfirmedTx = pendingTx !== null && !isPending

    const {mintPrivateMulti, mintPrivateShiboshiZoneMulti, fetchLandPrice } = useShiberseLandAuction({})

    useEffect(() => {
        if( props.isOpen ) {
            setPendingTx(null)
            setValidateText(null)
        }
    }, [props.isOpen])

    const handleMint = async () => {

        if( Number(currentBalance) < Number(formattedTotalPrice) ) {
            setValidateText('Insufficient ETH balance!')
            return
        }

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
            tx = await mintPrivateShiboshiZoneMulti(inputData)
            if( tx.hash )
                setPendingTx(tx.hash)
        } else {
            tx = await mintPrivateMulti(inputData)
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

    useEffect(() => {
        const getPrice = async () => {
            if (props.isOpen && props.selectedInfo && props.selectedInfo.length > 0) {
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
    
                setFormattedTotalPrice( Number( formatFromBalance(totalPrice, 18) ) )
                setTotalPrice( totalPrice )
                setPriceArray( [ ...pArray ] )
                setIsLoading(false)
            }
        }

        getPrice()
    }, [props.isOpen]);

    return (
        <Modal isOpen={ props.isOpen } onDismiss={ props.onDismiss } minHeight={false} maxHeight={80}>
            <UpperSection>
                <CloseIcon onClick={ props.onDismiss }>
                    <CloseColor />
                </CloseIcon>

                { !isConfirmedTx && !isPending ? (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <>
                            <HeaderText className='text-center text-3xl'>Mint Lands</HeaderText>
                            <HeaderDescription className='text-center'>You are about to mint for Lands.</HeaderDescription>
                        </>

                        <ContentWrapper className='relative'>
                            <MintWrapper className='flex justify-between w-full'>
                                <div>Mint Lands</div>
                            </MintWrapper>

                            <div className='text-left mt-2'>
                                { props.selectedInfo && props.selectedInfo.map((item: any) => `(${ item.coordinates.x }, ${ item.coordinates.y }) `) }
                            </div>
                            
                            <BalanceWrapper className='flex justify-between w-full'>
                                <span>{ isLoading ? <Loader stroke="white" /> : `Total Price: ${shortenDouble( Number(formattedTotalPrice), 2 )} ETH` }</span>
                                <span>Current Balance: { shortenDouble( Number(currentBalance), 2 ) } ETH</span>
                            </BalanceWrapper>

                            <ValidationText className={`text-red ${!validateText ? 'hidden' : ''}`}>{ validateText }</ValidationText>
                        </ContentWrapper>

                        <NormalButton className='px-12' onClick={ handleMint }>
                            MINT
                        </NormalButton>
                    </ConnectWalletWrapper>
                ) : isPending ? (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <div className='my-4 mt-8'>
                            <ShiberseLoader size='30px' />
                        </div>
                        <>
                            <HeaderText className='text-center text-3xl'>Minting in progress</HeaderText>
                            <HeaderDescription className='text-center'>This process can take few minutes.</HeaderDescription>
                            <HeaderDescription className='text-center mb-8'>Once transaction is over, it will be added to your wallet.</HeaderDescription>
                        </>
                    </ConnectWalletWrapper>
                ) : (
                    <ConnectWalletWrapper className='relative flex flex-col items-center'>
                        <>
                            <HeaderIcon><img src={confirmIcon}/></HeaderIcon>
                            <HeaderText className='text-center text-3xl'>Minting succesful</HeaderText>
                            <HeaderDescription className='text-center'>WOOF!</HeaderDescription>
                            <HeaderDescription className='text-center mb-8'>Your lands have been minted and they are available in your wallet.</HeaderDescription>
                        </>
                    </ConnectWalletWrapper>
                ) }
            </UpperSection>
        </Modal>
    )
}

export default MintModal