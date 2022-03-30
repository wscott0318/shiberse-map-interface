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
`

const Parameters = styled.span`
    background: #201F31;
    border-radius: 100px;
    font-size: 18px;
    padding: 10px 20px;
    border: 1px solid #BE6D06;
`

export default function StakeLeash() {
    const tokenType = 'leash'

    const { active } = useWeb3React()

    const toggleWalletModal = useWalletModalToggle()

    const { allowance, approve, stake, stakedBalance, stakeLimitInfo } = useShiberseStakeToken({ tokenType })

    //Token Balance
    const shibaBalanceBigInt = useShiberseTokenBalance({ tokenType })
    const shibaBalanceValue = parseFloat(formatFromBalance(shibaBalanceBigInt?.value, shibaBalanceBigInt?.decimals))
    const decimals = shibaBalanceBigInt?.decimals

    const [ lockAmount, setLockAmount ] = useState(1)
    const [ lockPeriod, setLockPeriod ] = useState(1)
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [ pendingTx, setPendingTx ] = useState<string | null>(null)

    // const stakeLeashInfo = {
    //     stakeMin: 1,
    //     stakeMax: 1000,
    //     dayMin: 1,
    //     dayMax: 100,
    // }

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

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

    return (
        <>
            <div className="flex justify-around flex-wrap">
                <ProgressCaption>
                    { 'Current Balance' }:
                    <span> { `${ shibaBalanceValue } ${ tokenType }` } </span>
                </ProgressCaption>

                <ProgressCaption>
                    { 'Staked Balance' }:
                    <span> { `${ stakedBalance } ${ tokenType }` } </span>
                </ProgressCaption>
            </div>

            <div className='w-10/12 rangeBar'>
                <ProgressCaption>
                    { 'Amount to lock' }:
                    <span> { `${ lockAmount } ${ tokenType }` } </span>
                </ProgressCaption>

                <RangeInput 
                    min={ stakeLimitInfo.AMOUNT_MIN }
                    max={ stakeLimitInfo.AMOUNT_MAX }
                    value={ [ lockAmount ] }
                    setValue={ setLockAmount }
                    step={ 1 }
                />
            </div>

            <div className='w-10/12 rangeBar'>
                <ProgressCaption>
                    { 'Locking period' }:
                    <span> { `${ lockPeriod } days` } </span>
                </ProgressCaption>

                <RangeInput 
                    min={ stakeLimitInfo.DAYS_MIN }
                    max={ stakeLimitInfo.DAYS_MAX }
                    value={ [ lockPeriod ] }
                    setValue={ setLockPeriod }
                />
            </div>

            <p className='mt-5 mb-3'>
                { `These parameters give you access to bid/purchase` }:
            </p>

            <div className='mt-6 mb-6'>
                <Parameters>
                    { '7 of max. 200 lands' }
                </Parameters>
            </div>

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
                        onClick={ lockToken }
                        disabled={
                            isPending ||
                            !shibaBalanceValue ||
                            Number(lockAmount) === 0 || 
                            Number(lockPeriod) === 0 ||
                            Number(lockAmount) > Number(shibaBalanceValue)
                        }
                    >
                        { !isPending ? 'LOCK' : <Dots>LOCKING</Dots> }
                    </PrimaryButton>
                )}
                
            </div>
        </>
    )
}