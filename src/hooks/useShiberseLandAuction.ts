import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { Fraction } from '../entities'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseLandAuctionContract } from './useContract'
import { mainNetworkChainId } from '../constants'
import { useBlockNumber } from 'state/application/hooks'
import { formatFromBalance, formatToBalance } from 'utils'

const { BigNumber } = ethers

const useShiberseLandAuction = () => {
    const { account, chainId, library } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const currentBlockNumber = useBlockNumber()

    const landContract = useShiberseLandAuctionContract(true)
    
    const [currentStage, setCurrentStage] = useState(1)
    const [currentBidCount, setCurrentBidCount] = useState(0)
    const [allPlacedBids, setAllPlacedBids] = useState([])
    const [winningBids, setWinningBids] = useState([])

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

    const fetchCurrentBidCapacity = useCallback(async() => {
        if( account && landContract && chainId === mainNetworkChainId ) {
            try {
                const capacity = await landContract?.availableCapacityOf( account )
                setCurrentBidCount( Number(formatFromBalance( capacity, 0 )) )
            } catch(e) {
                console.error( 'fetchCurrentBidCapaity: ', e)
            }            
        }
    }, [account, landContract])

    useEffect(() => {
        if (account && landContract && chainId === mainNetworkChainId) {
            fetchCurrentBidCapacity()
        }

        const refreshInterval = setInterval(fetchCurrentBidCapacity, 10000)
        return () => clearInterval(refreshInterval)
    }, [account, fetchCurrentBidCapacity, landContract])

    const fetchBidsInfo = useCallback(async () => {
        try {
            const allBids = await landContract?.allBidInfoOf( account )
            const result = allBids[0].map((item: any, index: number) => [ item, allBids[1][index] ])

            setAllPlacedBids( result )

            const winning = await landContract?.bidInfoOf( account )
            const win_result = winning[0].map((item: any, index: number) => [ item, winning[1][index] ])
            setWinningBids( win_result )
        } catch(e) {
            console.error('fetchbidsInfo: ', e)
        }
    }, [account, landContract])

    useEffect(() => {
        if( account && landContract && chainId === mainNetworkChainId ) {
            fetchBidsInfo()
        }
    }, [account, fetchBidsInfo, landContract])

    const bidOne = useCallback(
        async ( input: any ) => {
            if( input?.bidOne && input?.x && input?.y ) {
                try {
                    const tx = await landContract?.bidOne(input?.x, input?.y, {
                        from: account,
                        value: formatToBalance(input?.bidOne).value
                    })
                    addTransaction(tx, { summary: `Bid placed!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landContract]
    )

    const signMessage = async (provider: any, account: any, message: any) => {
        /**
         * Wallet Connect does not sign the message correctly unless you use their method
         * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
         */
        if (provider.provider?.wc) {
            const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
            const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
            return signature
        }

        return provider.getSigner(account).signMessage(message)
    }

    // const signMsg = await signMessage(library, account, 'Test Sign Message')
    // console.error(signMsg)


    // const bidShiboshiZone = useCallback(
    //     async ( input: any ) => {
    //         if( input?. )
    //     }
    // )

    return { currentBidCount, currentStage, allPlacedBids, winningBids, bidOne, }

}

export default useShiberseLandAuction