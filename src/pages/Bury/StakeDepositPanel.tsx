import { useActiveWeb3React } from 'hooks'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useShibaSwapTokenBalance from 'shiba-hooks/useShibaSwapTokenBalance'
import { formatFromBalance, formatToBalance } from '../../utils'
import { TYPE } from '../../theme'
import { BigNumber } from '@ethersproject/bignumber'
import { Dots } from '../Pool/styleds'

import useBury from 'hooks/useBury'
import { useIsTransactionPending } from 'state/transactions/hooks'

const PercentContainer = styled.div`
    width: 95%;
    height: auto;
    // border:2px solid white;
    display: inline-block;
    margin: auto;
    margin-left: 10px;
    padding-left: 10px;
    padding-right: 10px;

    @media (max-width: 500px) {
        text-align: center;
        display: block;
    }
`
// const AvailableSectionBlock = styled.div`
//   @media (max-width: 620px) {
//     width:100%;
//     display:block;
//   }
// `;

// const PercentSectionBlock = styled.div`
//   @media (max-width: 620px) {
//     display:block;
//     width:100%;
//   }
// `;

const PercentAvailable = styled.div`
    color: white;
    margin: 5px;
    display: inline-block;
    float: right;
    cursor: pointer;
    font-weight: 800;
    font-size: 18px;
    font-family: 'Heebo' !important;
    @media (max-width: 1366px) {
        font-size: 13px;
    }
    @media (max-width: 610px) {
        text-align: left;
        display: block;
        width: 100%;
    }
`

const Percent = styled.div`
    color: white;
    margin: 5px;
    display: inline-block;
    float: right;
    cursor: pointer;
    font-weight: 800;
    font-size: 18px;
    font-family: 'Heebo' !important;
    @media (max-width: 1366px) {
        font-size: 13px;
    }
    @media (max-width: 500px) {
        text-align: center;
        display: block;
    }
`

const Input = styled.input<{ error?: boolean }>`
    width: 90%;
    height: 60px;
    margin: auto;
    margin-top: 0px;
    box-shadow: inset 0 0 7px 1px rgba(0, 0, 0, 0.45);
    border-radius: 10px;
    background-color: #161825;
    font-family: 'Heebo' !important;
    opacity: 0.76;
    border-color: #161825;
`

const ButtonSelect = styled.button`
    width: 90%;
    height: 52px;
    margin: auto;
    margin-top: 20px;
    border-radius: 10px;
    background-color: #d5d5d5;
    text-align: center;
    color: #292c37;
    line-height: 60px;
    cursor: pointer;
    font-size: 1rem;
    line-height: 15px;
    font-family: 'Metric - Semibold';
`

export default function StakeDepositPanel(props: any) {
    const { t } = useTranslation()
    const { account } = useActiveWeb3React()

    const tokenType = props.tokenType
    const tokenAddress = props.tokenAddress

    //Token Balance
    const shibaBalanceBigInt = useShibaSwapTokenBalance(tokenAddress ? tokenAddress : '')
    const shibaBalanceValue = parseFloat(formatFromBalance(shibaBalanceBigInt?.value, shibaBalanceBigInt?.decimals))
    const decimals = shibaBalanceBigInt?.decimals

    const maxDepositAmountInput = shibaBalanceBigInt

    const { allowance, approve, enter } = useBury({ tokenType, tokenAddress })

    const [activePercent, setActivePercent] = useState('')
    const [input, setInput] = useState('')

    //Token
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [pendingTx, setPendingTx] = useState<string | null>(null)

    function handlePercentSelect(selectedPercentKey: string) {
        setActivePercent(selectedPercentKey)
        const percentVal = parseFloat(selectedPercentKey) * (shibaBalanceValue / 100)
        setInput(String(percentVal))
    }

    function handleInputChange(event: any) {
        setInput(event.target.value)
    }

    function handleInputClick() {
        setActivePercent('')
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

    const isPending = useIsTransactionPending(pendingTx ?? undefined)

    return (
        <>
            <div>
                <PercentContainer>
                    <PercentAvailable style={{ float: 'left' }}>
                        Available:{' '}
                        {shibaBalanceValue ? shibaBalanceValue : shibaBalanceBigInt.isLoading ? 'Loading...' : 0}
                    </PercentAvailable>
                    <Percent
                        style={{ color: activePercent === '100' ? '#fea31c' : '', marginRight: '20px' }}
                        onClick={() => {
                            handlePercentSelect('100')
                        }}
                    >
                        100%
                    </Percent>
                    <Percent
                        style={{ color: activePercent === '75' ? '#fea31c' : '' }}
                        onClick={() => {
                            handlePercentSelect('75')
                        }}
                    >
                        75%
                    </Percent>
                    <Percent
                        style={{ color: activePercent === '50' ? '#fea31c' : '' }}
                        onClick={() => {
                            handlePercentSelect('50')
                        }}
                    >
                        50%
                    </Percent>
                    <Percent
                        style={{ color: activePercent === '25' ? '#fea31c' : '' }}
                        onClick={() => {
                            handlePercentSelect('25')
                        }}
                    >
                        25%
                    </Percent>
                </PercentContainer>

                <Input
                    className="recipient-address-input italic"
                    type="number"
                    placeholder="Type an amount to stake"
                    onChange={event => {
                        handleInputChange(event)
                    }}
                    onClick={() => handleInputClick()}
                    value={input}
                />

                <div>
                    {!allowance || Number(allowance) === 0 ? (
                        <ButtonSelect
                            disabled={requestedApproval}
                            onClick={() => {
                                handleApprove()
                            }}
                            className="bury_approve"
                        >
                            <TYPE.white fontWeight={700} fontSize={'1rem'}>
                                Approve
                            </TYPE.white>
                        </ButtonSelect>
                    ) : (
                        <ButtonSelect
                            disabled={
                                isPending ||
                                !shibaBalanceValue ||
                                Number(input) === 0 ||
                                Number(input) > Number(shibaBalanceValue)
                            }
                            onClick={async () => {
                                if (activePercent === '100') {
                                    const tx = await enter(maxDepositAmountInput)
                                    setPendingTx(tx.hash)
                                } else {
                                    const tx = await enter(formatToBalance(input, decimals))
                                    setPendingTx(tx.hash)
                                }
                                setInput('')
                            }}
                            className="bury_approve"
                        >
                            {!isPending ? (
                                <TYPE.white fontWeight={700} fontSize={'1rem'}>
                                    Stake
                                </TYPE.white>
                            ) : (
                                <TYPE.white fontWeight={700} fontSize={'1rem'}>
                                    <Dots>Staking</Dots>
                                </TYPE.white>
                            )}
                        </ButtonSelect>
                    )}
                </div>
            </div>
        </>
    )
}
