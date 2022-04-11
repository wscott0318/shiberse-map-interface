import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseLandAuctionContract } from './useContract'
import { mainNetworkChainId } from '../constants'
import { useBlockNumber } from 'state/application/hooks'
import { formatFromBalance, formatToBalance } from 'utils'
import axios from 'axios'
import { apiServer } from 'constants/map'

const useShiberseLandAuction = (props: any) => {
    const { account, chainId } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const currentBlockNumber = useBlockNumber()

    const landContract = useShiberseLandAuctionContract(true)

    const [currentStage, setCurrentStage] = useState(1)
    const [currentBidCount, setCurrentBidCount] = useState(0)
    const [allPlacedBids, setAllPlacedBids] = useState([])
    const [winningBids, setWinningBids] = useState([])
    const [isShiboshiHolder, setIsShiboshiHolder] = useState(null) as any

    // fetch current event stage
    const fetchCurrentStage = useCallback(async () => {
        try {
            const current = await landContract?.currentStage()
            setCurrentStage(Number(current))
        } catch(e) {
            console.error('fetch current stage error occured', e)
        }
    }, [account, landContract])

    const getSignature = async () => {
        const response = (await axios.get(`${apiServer}/shiboshis?address=${account}`)).data
        if( response.data.length > 0 ) {
            return response.data[0].signature
        }
        return null
    }

    const fetchLandPrice = useCallback(async ({ x: posX, y: posY }) => {
        if(account && landContract && chainId === mainNetworkChainId) {
            if( (posX === 0 || posX) && (posY === 0 || posY) ) {
                const price = await landContract?.getPriceOf( posX, posY )
                return price
            }
        }
    }, [account, landContract])

    // useEffect(() => {
    //     if (account && landContract && chainId === mainNetworkChainId) {
    //         fetchLandPrice()
    //     }

    //     const refreshInterval = setInterval(fetchLandPrice, 10000)
    //     return () => clearInterval(refreshInterval)
    // }, [fetchLandPrice, account, landContract])

    const fetchIfShiboshiHolder = useCallback(async () => {
        try {
            const signature = await getSignature()

            setIsShiboshiHolder(signature)
        } catch(e) {
            console.error('fetchIfShiboshiHolder error occured', e)
        }
    }, [account])

    useEffect(() => {
        if (account && landContract && chainId === mainNetworkChainId) {
            fetchCurrentStage()
            fetchIfShiboshiHolder()
        }
    }, [account, fetchCurrentStage, fetchIfShiboshiHolder, landContract, currentBlockNumber])

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
    }, [account, fetchCurrentBidCapacity, landContract, currentBlockNumber])

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
    }, [account, fetchBidsInfo, landContract, currentBlockNumber])

    const bidOne = useCallback(
        async ( input: any ) => {
            if( input?.value && input?.x && input?.y ) {
                try {
                    const tx = await landContract?.bidOne(input?.x, input?.y, {
                        from: account,
                        value: formatToBalance(input?.value).value
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
    
    const bidShiboshiZone = useCallback(
        async( input: any ) => {
            const signature = await getSignature()

            if( input?.value && input?.x && input?.y && signature ) {
                try {
                    const tx = await landContract?.bidShiboshiZone(input?.x, input?.y, signature, {
                        from: account,
                        value: formatToBalance(input?.value).value
                    })
                    addTransaction(tx, { summary: `Bid placed on Shiboshi Zone!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landContract]
    )

    const mintPrivate = useCallback(
        async( input: any ) => {
            if( input?.value && input?.x && input?.y ) {
                try {
                    const tx = await landContract?.mintPrivate(input?.x, input?.y, {
                        from: account,
                        value: formatToBalance(input?.value).value
                    })
                    addTransaction(tx, { summary: `Mint succeed!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landContract]
    )

    const mintPrivateShiboshiZone = useCallback(
        async( input: any ) => {
            const signature = await getSignature()

            if( input?.value && input?.x && input?.y && signature ) {
                try {
                    const tx = await landContract?.mintPrivateShiboshiZone(input?.x, input?.y, signature, {
                        from: account,
                        value: formatToBalance(input?.value).value
                    })
                    addTransaction(tx, { summary: `Mint succeed on Shiboshi Zone!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landContract]
    )

    const mintPublic = useCallback(
        async( input: any ) => {
            if( input?.value && input?.x && input?.y ) {
                try {
                    const tx = await landContract?.mintPublic(input?.x, input?.y, {
                        from: account,
                        value: formatToBalance(input?.value).value
                    })
                    addTransaction(tx, { summary: `Mint Public succeed!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landContract]
    )

    const mintWinningBid = useCallback(
        async( input: any ) => {
            if( input?.xArray && input?.yArray ) {
                try {
                    const tx = await landContract?.mintWinningBid(input?.xArray, input?.yArray)
                    addTransaction(tx, { summary: `Mint Winning Bid succeed!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landContract]
    )

    // const signMessage = async (provider: any, account: any, message: any) => {
    //     /**
    //      * Wallet Connect does not sign the message correctly unless you use their method
    //      * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
    //      */
    //     if (provider.provider?.wc) {
    //         const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
    //         const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
    //         return signature
    //     }

    //     return provider.getSigner(account).signMessage(message)
    // }

    // const signMsg = await signMessage(library, account, 'Test Sign Message')
    // console.error(signMsg)

    return { currentBidCount, currentStage, allPlacedBids, winningBids, isShiboshiHolder, bidOne, bidShiboshiZone, mintPrivate, mintPrivateShiboshiZone, mintPublic, mintWinningBid, fetchLandPrice }

}

export default useShiberseLandAuction