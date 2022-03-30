import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { Fraction } from '../entities'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseStakeContract, useShiberseTokenContract } from './useContract'
import { mainNetworkChainId } from '../constants'
import { useBlockNumber } from 'state/application/hooks'

const { BigNumber } = ethers

const useShiberseStakeToken = (props:any) => {
    const { account, chainId } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const currentBlockNumber = useBlockNumber()

    let tokenType = props.tokenType? props.tokenType.toUpperCase() : "LEASH";

    const tokenContract = useShiberseTokenContract( tokenType, true )
    const stakeContract = useShiberseStakeContract( tokenType, true )
    
    //allowance state variable
    const [allowance, setAllowance] = useState('0')
    const [stakedBalance, setStakedBalance] = useState('0')

    //Fetch Sushi Allowance
    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const allowance = await tokenContract?.allowance(account, stakeContract?.address)
                const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
                setAllowance(formatted)
            } catch {
                setAllowance('0')
            }
        }
    }, [account, stakeContract, tokenContract])

    useEffect(() => {
        
        if (account && tokenContract && stakeContract) {
            fetchAllowance()
        }
        const refreshInterval = setInterval(fetchAllowance, 10000)
        return () => clearInterval(refreshInterval)


    }, [account, stakeContract, fetchAllowance, tokenContract])

    const approve = useCallback(async () => {
        try {
            const tx = await tokenContract?.approve(stakeContract?.address, ethers.constants.MaxUint256.toString())
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, stakeContract, tokenContract])

    const stake = useCallback(
        // todo: this should be updated with BigNumber as opposed to string
        async (input: any | undefined) => {
            if (input?.amount && input?.numDaysToAdd) {
                try {
                    const tx = await stakeContract?.lock(input?.amount, input?.numDaysToAdd)
                    addTransaction(tx, { summary: `Staked ${ tokenType } Token!` })
                    return tx;
                } catch (e) {
                    return e
                }
            }
        },
        [addTransaction, stakeContract]
    )

    const fetchStakedBalance = useCallback(async () => {
        try {
            const balance = await stakeContract?.lockInfoOf(account)
            if(balance){
                const formatted = Fraction.from(BigNumber.from(balance.amount), BigNumber.from(10).pow(18)).toString()
                setStakedBalance(formatted)
            } else {
                setStakedBalance('0')
            }
        } catch(e) {
            return e
        }
    }, [account, chainId, stakeContract, currentBlockNumber])

    useEffect(() => {
        if( account && chainId === mainNetworkChainId )
            fetchStakedBalance()
    }, [ account, chainId, fetchStakedBalance ])

    return {allowance, approve, stake, stakedBalance}

}

export default useShiberseStakeToken