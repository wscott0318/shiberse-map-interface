import { BigNumber } from '@ethersproject/bignumber'
import {useActiveWeb3React, useShibaSwapTopDogContract} from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

const useShibaSwapStakedBalance = (pid: number, decimals = 18) => {
    // SLP is usually 18, KMP is 6
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 })
    const { account } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()
    const topDogContract = useShibaSwapTopDogContract()

    const fetchBalance = useCallback(async () => {
        const getStaked = async (pid: number, owner: string | null | undefined): Promise<BalanceProps> => {
            try {
                const { amount } = await topDogContract?.userInfo(pid, owner)
                return { value: BigNumber.from(amount), decimals: decimals }
            } catch (e) {
                return { value: BigNumber.from(0), decimals: decimals }
            }
        }
        const balance = await getStaked(pid, account)
        setBalance(balance)
    }, [account, decimals, topDogContract, pid])

    useEffect(() => {
        if (account && topDogContract) {
            fetchBalance()
        }
        const refreshInterval = setInterval(fetchBalance, 3000)
        return () => clearInterval(refreshInterval)
    }, [account, setBalance, currentBlockNumber, fetchBalance, topDogContract])

    return balance
}

export default useShibaSwapStakedBalance
