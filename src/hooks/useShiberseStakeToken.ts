import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { Fraction } from '../entities'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseStakeContract, useShiberseTokenContract } from './useContract'
import { mainNetworkChainId } from '../constants'
import { useBlockNumber } from 'state/application/hooks'
import { formatFromBalance } from 'utils'

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
    const [lockDays, setLockDays] = useState(0)
    const [stakeLimitInfo, setStakeLimitInfo] = useState({
        AMOUNT_MAX: 5.0,
        AMOUNT_MIN: 0.2,
        DAYS_MAX: 90,
        DAYS_MIN: 45,
    })
    const [unlockAt, setUnlockAt] = useState(null)

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
        
        if (account && tokenContract && stakeContract && chainId === mainNetworkChainId) {
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

    const unlock = useCallback(async() => {
        try {
            const tx = await stakeContract?.unlock()
            return addTransaction(tx, { summary: 'Unlock Succeed' })
        } catch(e) {
            console.error('Unlock error: ', e)
            return e
        }
    }, [addTransaction, stakeContract])

    const stake = useCallback(
        // todo: this should be updated with BigNumber as opposed to string
        async (input: any | undefined) => {
            if (input?.amount && input?.numDaysToAdd) {
                try {
                    const tx = await stakeContract?.lock(input?.amount, input?.numDaysToAdd)
                    addTransaction(tx, { summary: `Locked ${ tokenType } Token!` })
                    return tx;
                } catch (e) {
                    return e
                }
            }
        },
        [addTransaction, stakeContract]
    )

    const fetchLockInfo = useCallback(async () => {
        try {
            const lockInfo = await stakeContract?.lockInfoOf(account)
            if(lockInfo){
                const formatted = Fraction.from(BigNumber.from(lockInfo.amount), BigNumber.from(10).pow(18)).toString()
                const result = Number(formatted).toFixed(1)
                setStakedBalance( result )

                const numDays = Number( formatFromBalance( lockInfo.numDays, 0 ) )
                setLockDays( numDays )
            } else {
                setStakedBalance('0')
            }

            const unlockTime = await stakeContract?.unlockAt( account )
            setUnlockAt( unlockTime )
        } catch(e) {
            console.error(e)
            return e
        }
    }, [account, chainId, stakeContract, currentBlockNumber])

    useEffect(() => {
        if( account && chainId === mainNetworkChainId )
            fetchLockInfo()
    }, [ account, chainId, fetchLockInfo ])

    const fetchStakeLimitInfo = useCallback(async () => {
        const decimals = await tokenContract?.decimals()

        const amount_max = await stakeContract?.AMOUNT_MAX()
        const amount_min = await stakeContract?.AMOUNT_MIN()

        const days_max = await stakeContract?.DAYS_MAX()
        const days_min = await stakeContract?.DAYS_MIN()

        setStakeLimitInfo({
            AMOUNT_MAX: Number(formatFromBalance(amount_max, decimals)),
            AMOUNT_MIN: Number(formatFromBalance(amount_min, decimals)),
            DAYS_MAX: Number(formatFromBalance(days_max, 0)),
            DAYS_MIN: Number(formatFromBalance(days_min, 0)),
        })
    }, [account, chainId, stakeContract, tokenContract])

    useEffect(() => {
        if( account && chainId === mainNetworkChainId )
            fetchStakeLimitInfo()
    }, [account, chainId, fetchStakeLimitInfo])

    return {allowance, approve, stake, stakedBalance, lockDays, stakeLimitInfo, unlockAt, unlock}

}

export default useShiberseStakeToken