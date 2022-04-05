import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import RangeInput from 'components/RangeInput'
import { PrimaryButton } from 'theme'
import { useWalletModalToggle } from "state/application/hooks"
import { useWeb3React } from "@web3-react/core"
import useShiberseStakeToken from "hooks/useShiberseStakeToken"
import useShiberseTokenBalance from "shiba-hooks/useShiberseTokenBalance"
import { formatFromBalance, formatToBalance, parseBalance } from "utils"
import { useIsTransactionPending } from "state/transactions/hooks"
import { Dots } from "pages/Pool/styleds"
import { BigNumber } from '@ethersproject/bignumber'

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
    background: #201f3185;
    border-radius: 100px;
    font-size: 18px;
    padding: 10px 20px;
    border: 1px solid #BE6D06;
`

const BalanceInfoWrapper = styled.div`
    width: 83.3333%;
    justify-content: space-between;

    @media (max-width: 992px) {
        width: 100%;
    }
` 

export default function StakeLeash() {
    const tokenType = 'leash'

    const { active } = useWeb3React()

    const toggleWalletModal = useWalletModalToggle()

    const { allowance, approve, stake, stakedBalance, lockDays, stakeLimitInfo } = useShiberseStakeToken({ tokenType })

    //Token Balance
    const shibaBalanceBigInt = useShiberseTokenBalance({ tokenType })
    const shibaBalanceValue = parseFloat(formatFromBalance(shibaBalanceBigInt?.value, shibaBalanceBigInt?.decimals))
    const decimals = shibaBalanceBigInt?.decimals

    const [ lockAmount, setLockAmount ] = useState(stakeLimitInfo.AMOUNT_MIN)
    const [ lockPeriod, setLockPeriod ] = useState(stakeLimitInfo.DAYS_MIN)
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [ pendingTx, setPendingTx ] = useState<string | null>(null)

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

    useEffect(() => {
        if( lockAmount < checkBelowZero(stakeLimitInfo.AMOUNT_MIN - Number(stakedBalance)) )
            setLockAmount( checkBelowZero(stakeLimitInfo.AMOUNT_MIN - Number(stakedBalance)) )
        if( lockAmount > checkBelowZero(stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) )
            setLockAmount( checkBelowZero(stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) )

        if( lockPeriod < checkBelowZero(stakeLimitInfo.DAYS_MIN - lockDays) )
            setLockPeriod( checkBelowZero(stakeLimitInfo.DAYS_MIN - lockDays) )
        if( lockPeriod > checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) )
            setLockPeriod( checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) )
    }, [ lockAmount, lockPeriod, stakeLimitInfo ])

    const handleStake = async () => {
        const inputData = {
            amount: parseBalance(lockAmount.toString(), decimals), 
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

    const lockToken = async () => {
        if( !active ) {
            toggleWalletModal()
            return
        }
        handleStake()
    }

    const checkBelowZero = ( value: any ) => value <= 0 ? 0 : parseFloat(Number(value).toFixed(1))

    const calcLandCount = () => {
        const score = (Number(stakedBalance) + Number(lockAmount)) * (Number(lockDays) + Number(lockPeriod))

        const breakPoints = [ 9, 31, 61, 101, 131, 181, 221, 301, 371, 420, 451 ]
        const landCounts = [ 1, 5, 10, 20, 50, 80, 100, 140, 180, 200 ]

        for( let i = 0; i < breakPoints.length - 1; i++ ) {
            if( score < breakPoints[i + 1] )
                return landCounts[i]
        }

        return 0
    }

    const isMaxLands = () => checkBelowZero(stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) === 0 && checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) === 0

    return (
        <>
            <BalanceInfoWrapper className="flex flex-wrap">
                <ProgressCaption>
                    { 'Current Balance' }:
                    <span> { `${ Number(shibaBalanceValue).toFixed(1) } ${ tokenType }` } </span>
                </ProgressCaption>

                <ProgressCaption>
                    { 'Locked Leash' }:
                    <span> { `${ stakedBalance } ${ tokenType }` } </span>
                </ProgressCaption>
            </BalanceInfoWrapper>

            <div className='w-10/12 rangeBar'>
                { checkBelowZero(stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) === 0
                    ? ( <ProgressCaption> 
                            { isMaxLands()
                                ? ''
                                : 'This wallet has maxed out on LEASH to lock, but you can still lock more days to get more land!' }
                        </ProgressCaption> )
                    : ( <ProgressCaption>
                            { 'Amount to lock' }:
                            <span> { `${ Number(lockAmount).toFixed(1) } ${ tokenType }` } </span>
                        </ProgressCaption> )
                }

                <RangeInput 
                    min={ checkBelowZero(stakeLimitInfo.AMOUNT_MIN - Number(stakedBalance)) }
                    max={ checkBelowZero(stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) }
                    value={ [ lockAmount ] }
                    setValue={ setLockAmount }
                    step={ 0.1 }
                    disable={ checkBelowZero(stakeLimitInfo.AMOUNT_MAX - Number(stakedBalance)) === 0 }
                />
            </div>

            <div className='w-10/12 rangeBar'>
                { checkBelowZero(stakeLimitInfo.DAYS_MAX - lockDays) === 0
                    ? ( <ProgressCaption>
                            { isMaxLands()
                                ? ''
                                : 'This wallet has maxed out on days to lock, but you can still lock more LEASH to get more land!' }
                        </ProgressCaption> )
                    : ( <ProgressCaption>
                            { 'Locking period' }:
                            <span> { `${ lockPeriod } day${ Number(lockPeriod) > 1 ? 's' : '' }` } </span>
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

            <ProgressCaption>
                { isMaxLands() ? 'This wallet has access to max lands, wait for the Bid Event to start!' : '' }
            </ProgressCaption>

            { !isMaxLands() ? (
                <>
                    <p className='mt-2 mb-3'>
                        { `These parameters give you access to bid/purchase` }:
                    </p>

                    <div className='mt-6 mb-6'>
                        <Parameters>
                            { `${calcLandCount()} land${calcLandCount() > 1 ? 's' : ''} of 200 max` }
                        </Parameters>
                    </div>
                </>
            ): null }

            <div className='w-full flex flex-row-reverse'>
                {!allowance || Number(allowance) === 0 ? (
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
                        style={{
                            display: ((Number(lockAmount) === 0 && Number(lockPeriod) === 0) ||
                                Number(lockAmount) > Number(shibaBalanceValue)) ? 'none' : 'block'
                        }}
                        onClick={ lockToken }
                        disabled={
                            (Number(lockAmount) === 0 && Number(lockPeriod) === 0) ||
                            Number(lockAmount) > Number(shibaBalanceValue)
                        }
                    >
                        LOCK
                    </PrimaryButton>
                )}
                
                {(allowance && Number(allowance) !== 0 && Number(lockAmount) > Number(shibaBalanceValue)) ? (
                    <a target='_blank' rel="noreferrer" href='https://shibaswap.com/#/swap?outputCurrency=0x27C70Cd1946795B66be9d954418546998b546634&inputCurrency=ETH'>
                        <PrimaryButton 
                            className='right-0' 
                            onClick={ lockToken }
                        >
                            { 'Buy more $Leash' }
                        </PrimaryButton>
                    </a>
                ) : null}
            </div>
        </>
    )
}