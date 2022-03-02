import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import ERC20_ABI from 'constants/abis/shibaswap_erc20.json'
import { useActiveWeb3React, useContract } from '../hooks'
import { useBlockNumber } from '../state/application/hooks'
import { isAddress } from '../utils'

export interface BalanceProps {
    value: BigNumber
    decimals: number
    isLoading?: boolean
}

const useShibaSwapTokenBalance = (tokenAddress: string) => {
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 , isLoading: true })
    const { account } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()
    const addressCheckSum = isAddress(tokenAddress)
    const tokenContract = useContract(addressCheckSum ? addressCheckSum : undefined, ERC20_ABI, false)

    const getBalance = async (contract: Contract | null, owner: string | null | undefined): Promise<BalanceProps> => {
        try {
            const balance = await contract?.balanceOf(owner)
            const decimals = await contract?.decimals()
            return { value: BigNumber.from(balance), decimals: decimals, isLoading: false }
        } catch (e) {
            console.log('getBalance_error:', e)
            return { value: BigNumber.from(0), decimals: 18, isLoading: false }
        }
    }

    const fetchBalance = useCallback(async () => {
        const balance = await getBalance(tokenContract, account)
        setBalance(balance)
    }, [account, tokenContract])

    useEffect(() => {
        if (account && tokenContract) {
            fetchBalance()
        }
    }, [account, setBalance, currentBlockNumber, tokenAddress, fetchBalance, tokenContract])

    return balance
}

export default useShibaSwapTokenBalance
