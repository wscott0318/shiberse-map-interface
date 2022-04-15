import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { NormalButton } from 'theme'
import Modal from 'components/Modal'
import ShiberseLoader from 'components/Loader/loader'
import confirmIcon from '../../assets/images/map/confirmIcon.svg'
import { shortenDouble } from 'utils'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useWeb3React } from '@web3-react/core'
import { useETHBalances } from 'state/wallet/hooks'

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

// export const MintWinningMultiModal = (props: any) => {
//     const [ mintCount, setMintCount ] = useState(1)

//     const [ pendingTx, setPendingTx ] = useState<string | null>(null)

//     const isPending = useIsTransactionPending(pendingTx ?? undefined)

//     const isConfirmedTx = pendingTx !== null && !isPending

//     const { mintWinningBid } = useShiberseLandAuction({})

//     useEffect(() => {
//         if( props.isOpen ) {
//             setMintCount(1)
//             setPendingTx(null)
//         }
//     }, [props.isOpen])

//     const increaseMintCount = () => {
//         if( mintCount >= props.winBids.length )
//             return

//         setMintCount(prev => prev + 1)
//     }

//     const decreaseMintCount = () => {
//         if( mintCount <= 1 )
//             return
        
//         setMintCount(prev => prev - 1)
//     }

//     const totalPrice = () => {
//         if( !props.winBids || !props.winBids.length )
//             return 0

//         const currentSelected = props.winBids.slice(0, mintCount)

//         let value = 0
//         currentSelected.forEach((item: any) => {
//             value += item.price
//         })
        
//         return shortenDouble(Number(value), 2)
//     }

//     const handleMultiMint = async () => {
//         const currentSelected = props.winBids.slice(0, mintCount)

//         const inputData = {
//             xArray: [],
//             yArray: []
//         } as any

//         currentSelected.forEach((item: any) => {
//             inputData.xArray.push( item.coordinates.x )
//             inputData.yArray.push( item.coordinates.y )
//         })

//         const tx = await mintWinningBid( inputData )
//         if( tx.hash )
//             setPendingTx(tx.hash)
//     }

//     return (
//         <Modal isOpen={ props.isOpen } onDismiss={ props.onDismiss } minHeight={false} maxHeight={80}>
//             <UpperSection>
//                 <CloseIcon onClick={ props.onDismiss }>
//                     <CloseColor />
//                 </CloseIcon>

//                 { !isConfirmedTx && !isPending ? (
//                     <ConnectWalletWrapper className='relative flex flex-col items-center'>
//                         <>
//                             <HeaderText className='text-center text-3xl'>Mint Lands</HeaderText>
//                             <HeaderDescription className='text-center'>Select the amount of Lands you would like to mint.</HeaderDescription>
//                         </>

//                         <ContentWrapper className='relative'>
//                             <MintWrapper className='flex justify-between w-full'>
//                                 <div>Mint Lands</div>
//                                 <div className='flex justify-center items-center'>
//                                     <ControlButton onClick={increaseMintCount}> + </ControlButton>
//                                     <span className='mx-2'>{mintCount}</span>
//                                     <ControlButton onClick={decreaseMintCount}> - </ControlButton>
//                                 </div>
//                             </MintWrapper>
                            
//                             <BalanceWrapper className='flex justify-between w-full'>
//                                 <span>{ totalPrice() } ETH</span>
//                                 <div>Owned lands: { props.winBids.length } Lands <span>MAX</span></div>
//                             </BalanceWrapper>
//                         </ContentWrapper>

//                         <NormalButton className='px-12' onClick={ handleMultiMint }>
//                             MINT
//                         </NormalButton>
//                     </ConnectWalletWrapper>
//                 ) : isPending ? (
//                     <ConnectWalletWrapper className='relative flex flex-col items-center'>
//                         <div className='my-4 mt-8'>
//                             <ShiberseLoader size='30px' />
//                         </div>
//                         <>
//                             <HeaderText className='text-center text-3xl'>Minting in progress</HeaderText>
//                             <HeaderDescription className='text-center'>This process can take few minutes.</HeaderDescription>
//                             <HeaderDescription className='text-center mb-8'>Once transaction is over, it will be added to your wallet.</HeaderDescription>
//                         </>
//                     </ConnectWalletWrapper>    
//                 ): (
//                     <ConnectWalletWrapper className='relative flex flex-col items-center'>
//                         <>
//                             <HeaderIcon><img src={confirmIcon}/></HeaderIcon>
//                             <HeaderText className='text-center text-3xl'>Minting succesful</HeaderText>
//                             <HeaderDescription className='text-center'>WOOF!</HeaderDescription>
//                             <HeaderDescription className='text-center mb-8'>Your lands have been minted and they are available in your wallet.</HeaderDescription>
//                         </>
//                     </ConnectWalletWrapper>
//                 ) }
                
//             </UpperSection>
//         </Modal>
//     )
// }

export default MintModal