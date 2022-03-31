import React, { useCallback, useEffect, useState } from "react"
import styled from 'styled-components'
import RangeInput from 'components/RangeInput'
import { GradientButton, PrimaryButton } from 'theme'
import { useWalletModalToggle } from "state/application/hooks"
import { useWeb3React } from "@web3-react/core"
import useShiberseStakeNFT from "hooks/useShiberseStakeNFT"
import useShiberseTokenBalance from "shiba-hooks/useShiberseTokenBalance"
import { formatFromBalance, formatToBalance, parseBalance } from "utils"
import { useIsTransactionPending } from "state/transactions/hooks"
import { Dots } from "pages/Pool/styleds"
import { BigNumber } from '@ethersproject/bignumber'
import ShiboshiSelectModal from "./shiboshiSelectModal"

const ProgressCaption = styled.div`
    font-weight: 600;
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 10px;

    span {
        color: ${({theme}) => theme.brown1};
        text-transform: uppercase;
    }

    @media( max-width: 576px ) {
        margin: 5px 0;
    }
`

const Parameters = styled.span`
    background: #201F31;
    border-radius: 100px;
    font-size: 18px;
    padding: 10px 20px;
    border: 1px solid #BE6D06;
`

export default function StakeShiboshi() {
    const tokenType = 'shiboshi'

    const { active } = useWeb3React()

    const toggleWalletModal = useWalletModalToggle()
    const { isApproved, approve, stake, stakedBalance, lockDays, fetchWalletNFT, stakeLimitInfo } = useShiberseStakeNFT({ tokenType })

    //Token Balance
    const shibaBalanceBigInt = useShiberseTokenBalance({ tokenType })
    const shibaBalanceValue = parseFloat(formatFromBalance(shibaBalanceBigInt?.value, shibaBalanceBigInt?.decimals))

    const [ showSelectModal, setShowSelectModal ] = useState(false)
    const [ lockPeriod, setLockPeriod ] = useState(1)
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [ pendingTx, setPendingTx ] = useState<string | null>(null)
    const [ myNFTs, setMyNFTs ] = useState([])
    const [ selectedNFTs, setSelectedNFTs ] = useState([])
    const [ loadingNFTs, setLoadingNFTs ] = useState(true)

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

    const handleStake = async () => {
        setSelectedNFTs([])

        const ids = selectedNFTs.map((nftId: any) => BigNumber.from(parseInt(nftId)))

        const inputData = {
            ids: ids,
            numDaysToAdd: BigNumber.from( lockPeriod )
        }
        const tx = await stake(inputData)
        setPendingTx(tx.hash)
    }

    const handleApprove = useCallback(async () => {
        try {
            const txHash = await approve()
            // user rejected tx or didn't go thru
            if (!txHash || txHash.code !== 4001) {
                setRequestedApproval(true)
            }
        } catch (e) {
            console.log(e)
        }
    }, [approve, setRequestedApproval])

    const setWalletNFT = async () => {
        setLoadingNFTs( true )
        const result = await fetchWalletNFT()
        setMyNFTs(result as any)
        setLoadingNFTs( false )
    }

    const handleSelectNFT = ( id: number ) => {
        const selected = [ ...selectedNFTs ] as any
        if( selected.length > (stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) ) {
            return;
        }

        const index = selected.indexOf(id)
        if( index === -1 )
            selected.push( id )
        else
            selected.splice( index, 1 )

        setSelectedNFTs( selected )
    }

    const handleClickSelectToken = () => {
        setWalletNFT()
        setShowSelectModal(prev => !prev)
    }

    const checkBelowZero = ( value: any ) => value <= 0 ? 0 : value

    useEffect(() => {
        if( lockPeriod < checkBelowZero(stakeLimitInfo.DAYS_MIN - lockDays) )
            setLockPeriod( checkBelowZero(stakeLimitInfo.DAYS_MIN - lockDays) )
        if( lockPeriod > checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) )
            setLockPeriod( checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) )
    }, [ lockPeriod, stakeLimitInfo ])

    const calcLandCount = () => {
        const score = Number(stakedBalance) * lockDays + selectedNFTs.length * lockPeriod

        const breakPoints = [ 45, 90, 151, 251, 351, 481, 601, 701, 801, 851, 901 ]
        const landCounts = [ 1, 5, 10, 20, 50, 80, 100, 140, 180, 200 ]

        for( let i = 0; i < breakPoints.length - 1; i++ ) {
            if( score < breakPoints[i + 1] )
                return landCounts[i]
        }

        return 0
    }

    return (
        <>
            <div className="flex justify-around flex-wrap">
                <ProgressCaption>
                    { 'Current Balance' }:
                    <span> { `${ shibaBalanceValue } ${ tokenType }` } </span>
                </ProgressCaption>

                <ProgressCaption>
                    { 'Locked Shiboshi' }:
                    <span> { `${ stakedBalance } ${ tokenType }` } </span>
                </ProgressCaption>
            </div>

            <div className='w-10/12 rangeBar'>
                <ProgressCaption>
                    { 'Select tokens you want to lock.' }
                </ProgressCaption>

                { selectedNFTs.length > 0 || true
                    ? (<span className="text-lg">{`${ selectedNFTs.length } Shiboshis selected`}</span>) : null }

                <GradientButton 
                    onClick={ handleClickSelectToken }
                    disabled={ checkBelowZero(stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) === 0 }
                >
                    { selectedNFTs.length > 0 ? 'EDIT' : 'SELECT TOKENS'}
                </GradientButton>
            </div>

            <div className='w-10/12 rangeBar'>
                { checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) === 0
                    ? ( <ProgressCaption> Max Days Locked </ProgressCaption> )
                    : ( <ProgressCaption>
                            { 'Locking period' }:
                            <span> { `${ lockPeriod } days` } </span>
                        </ProgressCaption> )
                }

                <RangeInput 
                    min={ checkBelowZero(stakeLimitInfo.DAYS_MIN - lockDays) }
                    max={ checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) }
                    value={ [ lockPeriod ] }
                    setValue={ setLockPeriod }
                    disable={ checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) === 0 }
                />
            </div>

            <p className='mt-2 mb-3'>
                { `These parameters give you access to bid/purchase` }:
            </p>

            <div className='mt-6 mb-6'>
                <Parameters>
                    { `${calcLandCount()} land${calcLandCount() > 1 ? 's' : ''} of 200 max` }
                </Parameters>
            </div>

            <div className='w-full flex flex-row-reverse'>
                {!isApproved ? (
                    <PrimaryButton
                        className='right-0'
                        disabled={requestedApproval}
                        onClick={() => {
                            if( !active ) {
                                toggleWalletModal()
                                return
                            }
                            
                            handleApprove()
                        }}
                    >
                        { !requestedApproval ? 'APPROVE' : <Dots>APPROVING</Dots> }
                    </PrimaryButton>
                ) : (
                    <PrimaryButton 
                        className='right-0' 
                        onClick={() => {
                            if( !active ) {
                                toggleWalletModal()
                                return
                            }
                            handleStake()
                        }}
                        disabled={
                            isPending ||
                            !shibaBalanceValue ||
                            Number(selectedNFTs.length) === 0 || 
                            Number(lockPeriod) === 0 ||
                            Number(selectedNFTs.length) > Number(shibaBalanceValue)
                        }
                    >
                        { !isPending ? 'LOCK' : <Dots>LOCKING</Dots> }
                    </PrimaryButton>
                )}
            </div>

            <ShiboshiSelectModal 
                isOpen={ showSelectModal } 
                onDismiss={() => setShowSelectModal(prev => !prev)} 
                myNFTs={ myNFTs } 
                selectedNFTs={ selectedNFTs }
                loadingNFTs={ loadingNFTs }
                handleSelectNFT={ handleSelectNFT }
                />
        </>
    )
}