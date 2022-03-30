import { BigNumber } from '@ethersproject/bignumber'
import { mainNetworkChainId } from '../constants'
import { Contract } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useShiberseTokenContract } from '../hooks'
import { useBlockNumber } from '../state/application/hooks'

export interface BalanceProps {
    value: BigNumber
    decimals: number
    isLoading?: boolean
}

const useShiberseTokenBalance = (props: any) => {
    const [balance, setBalance] = useState<BalanceProps>({ value: BigNumber.from(0), decimals: 18 , isLoading: true })
    const { account, chainId } = useActiveWeb3React()
    const currentBlockNumber = useBlockNumber()

    let tokenType = props.tokenType? props.tokenType.toUpperCase() : "LEASH";

    const tokenContract = useShiberseTokenContract( tokenType, true )

    const getBalance = async (contract: Contract | null, owner: string | null | undefined): Promise<BalanceProps> => {
        try {
            const balance = await contract?.balanceOf(owner)
            const decimals = tokenType === 'LEASH' ? await contract?.decimals() : 0
            return { value: BigNumber.from(balance), decimals: decimals, isLoading: false }
        } catch (e) {
            console.error('getBalance_error:', e)
            return { value: BigNumber.from(0), decimals: 18, isLoading: false }
        }
    }

    const fetchBalance = useCallback(async () => {
        const balance = await getBalance(tokenContract, account)
        setBalance(balance)
    }, [account, tokenContract])

    useEffect(() => {
        if (account && tokenContract && chainId === mainNetworkChainId) {
            fetchBalance()
        }
    }, [account, setBalance, currentBlockNumber, fetchBalance, tokenContract])

    return balance
}

export default useShiberseTokenBalance
