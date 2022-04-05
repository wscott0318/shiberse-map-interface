import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { Fraction } from '../entities'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseLandAuctionContract } from './useContract'
import { mainNetworkChainId } from '../constants'
import { useBlockNumber } from 'state/application/hooks'
import { formatFromBalance } from 'utils'

const { BigNumber } = ethers

const useShiberseLandAuction = () => {
    const { account, chainId } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const currentBlockNumber = useBlockNumber()

    const landContract = useShiberseLandAuctionContract(true)
    
    const [currentStage, setCurrentStage] = useState(1)

    // fetch current event stage
    const fetchCurrentStage = useCallback(async () => {
        try {
            const current = await landContract?.currentStage()
            setCurrentStage(Number(current))
        } catch {
            console.error('fetch current stage error occured')
        }
    }, [account, landContract])

    useEffect(() => {
        if (account && landContract && chainId === mainNetworkChainId) {
            fetchCurrentStage()
        }
    }, [account, fetchCurrentStage, landContract])

    return { currentStage }

}

export default useShiberseLandAuction