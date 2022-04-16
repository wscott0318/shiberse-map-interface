import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React, useShiberseLandRegistryContract } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseLandAuctionContract, useShiberseLandAuctionV2Contract } from './useContract'
import { alchemyApi, mainNetworkChainId, shiberseContractAddresses } from '../constants'
import { useBlockNumber } from 'state/application/hooks'
import { formatFromBalance, formatToBalance } from 'utils'
import axios from 'axios'
import { apiServer } from 'constants/map'
import { ethers } from 'ethers'
import { getFixedValue } from 'utils/mapHelper'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const useShiberseLandAuction = (props: any) => {
    const { account, chainId } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const currentBlockNumber = useBlockNumber()

    const landContract = useShiberseLandAuctionContract(true)
    const landV2Contract = useShiberseLandAuctionV2Contract(true)
    const landRegistry  = useShiberseLandRegistryContract(true);

    const [currentStage, setCurrentStage] = useState(1)
    const [currentBidCount, setCurrentBidCount] = useState(0)
    const [allPlacedBids, setAllPlacedBids] = useState([])
    const [winningBids, setWinningBids] = useState([])
    const [isShiboshiHolder, setIsShiboshiHolder] = useState(null) as any
    const [loadingBidsInfo, setLoadingBidsInfo] = useState(true)
    const [landNFTs, setLandNFTs] = useState([]) as any

    // fetch current event stage
    const fetchCurrentStage = useCallback(async () => {
        try {
            const current = await landV2Contract?.currentStage()

            // setCurrentStage(2)
            
            setCurrentStage(Number(current))
        } catch(e) {
            console.error('fetch current stage error occured', e)
        }
    }, [account, landV2Contract])

    const getSignature = async () => {
        const response = (await axios.get(`${apiServer}/shiboshis?address=${account?.toLowerCase()}`)).data
        if( response.data.length > 0 ) {
            return response.data[0].signature
        }
        return null
    }

    const fetchLandPrice = useCallback(async ({ x: posX, y: posY }) => {
        if(account && landV2Contract && chainId === mainNetworkChainId) {
            if( (posX === 0 || posX) && (posY === 0 || posY) ) {
                const price = await landV2Contract?.getPriceOf( posX, posY )
                return price
            }
        }
    }, [account, landV2Contract])

    const fetchLandCurrentWinner = useCallback(async({ x: posX, y: posY }) => {
        if(account && landContract && chainId === mainNetworkChainId) {
            if( (posX === 0 || posX) && (posY === 0 || posY) ) {
                const currentBid = await landContract?.getCurrentBid( posX, posY )
                return currentBid.bidder
            }
        }
    }, [account, landContract])

    const fetchLandCurrentOwner = useCallback(async({ landId }) => {
        if(account && landRegistry && chainId === mainNetworkChainId) {
            if( landId ) {
                try {
                    const currentOwner = await landRegistry?.ownerOf( landId )
                    return currentOwner
                } catch (err) {
                    // console.error('Owner does not exists', err)
                    return ""
                }

            }
        }
    }, [account, landRegistry])

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
        if( account && landV2Contract && chainId === mainNetworkChainId ) {
            try {
                const capacity = await landV2Contract?.availableCapacityOf( account )
                setCurrentBidCount( Number(formatFromBalance( capacity, 0 )) )
            } catch(e) {
                console.error( 'fetchCurrentBidCapaity: ', e)
            }            
        }
    }, [account, landV2Contract])

    useEffect(() => {
        if (account && landContract && chainId === mainNetworkChainId) {
            fetchCurrentBidCapacity()
        }

        const refreshInterval = setInterval(fetchCurrentBidCapacity, 10000)
        return () => clearInterval(refreshInterval)
    }, [account, fetchCurrentBidCapacity, landContract, currentBlockNumber])

    const fetchBidsInfo = useCallback(async () => {
        try {
            const allBids = await landV2Contract?.allBidInfoOf( account )
            const result = allBids[0].map((item: any, index: number) => [ item, allBids[1][index] ])

            for( let i = 0; i < result.length; i++ ) {
                const price = await fetchLandPrice({ x: result[i][0], y: result[i][1] })
                result[i].push(price)
            }

            setAllPlacedBids( result )

            const winning = await landV2Contract?.bidInfoOf( account )
            const win_result = winning[0].map((item: any, index: number) => [ item, winning[1][index] ])

            for( let i = 0; i < win_result.length; i++ ) {
                const price = await fetchLandPrice({ x: win_result[i][0], y: win_result[i][1] })
                win_result[i].push(price)
            }

            setWinningBids( win_result )

            setLoadingBidsInfo(false)
        } catch(e) {
            console.error('fetchbidsInfo: ', e)
        }
    }, [account, landV2Contract])

    useEffect(() => {
        if( account && landContract && chainId === mainNetworkChainId ) {
            fetchBidsInfo()
            fetchLandNFT()
        }
    }, [account, fetchBidsInfo, landContract, currentBlockNumber])

    const bidOne = useCallback(
        async ( input: any ) => {
            if( input ) {
                try {
                    const tx = await landContract?.bidOne(input?.x, input?.y, {
                        from: account,
                        value: input?.value
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

            if( input && signature ) {
                try {
                    const tx = await landContract?.bidShiboshiZoneOne(input?.x, input?.y, signature, {
                        from: account,
                        value: input?.value
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

    const bidMulti = useCallback(
        async ( input: any ) => {
            if( input ) {
                try {
                    const tx = await landContract?.bidMulti(input?.xArray, input?.yArray, input?.priceArray, {
                        from: account,
                        value: input?.totalAmount
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
    
    const bidShiboshiZoneMulti = useCallback(
        async( input: any ) => {
            const signature = await getSignature()

            if( input && signature ) {
                try {
                    const tx = await landContract?.bidShiboshiZoneMulti(input?.xArray, input?.yArray, input?.priceArray, signature, {
                        from: account,
                        value: input?.totalAmount
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
            if( input ) {
                try {
                    const tx = await landV2Contract?.mintPrivate(input?.x, input?.y, {
                        from: account,
                        value: input?.amount
                    })
                    addTransaction(tx, { summary: `Mint succeed!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landV2Contract]
    )

    const mintPrivateShiboshiZone = useCallback(
        async( input: any ) => {
            const signature = await getSignature()

            if( input && signature ) {
                try {
                    const tx = await landV2Contract?.mintPrivateShiboshiZone(input?.x, input?.y, signature, {
                        from: account,
                        value: input?.amount
                    })
                    addTransaction(tx, { summary: `Mint succeed on Shiboshi Zone!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landV2Contract]
    )

    const mintPrivateMulti = useCallback(
        async ( input: any ) => {
            if( input ) {
                try {
                    const tx = await landV2Contract?.mintPrivateMulti(input?.xArray, input?.yArray, input?.priceArray, {
                        from: account,
                        value: input?.totalAmount
                    })
                    addTransaction(tx, { summary: `Mint placed!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landV2Contract]
    )

    const mintPrivateShiboshiZoneMulti = useCallback(
        async( input: any ) => {
            const signature = await getSignature()

            if( input && signature ) {
                try {
                    const tx = await landV2Contract?.mintPrivateShiboshiZoneMulti(input?.xArray, input?.yArray, input?.priceArray, signature, {
                        from: account,
                        value: input?.totalAmount
                    })
                    addTransaction(tx, { summary: `Mint placed on Shiboshi Zone!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landV2Contract]
    )

    const mintPublic = useCallback(
        async( input: any ) => {
            if( input ) {
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
                    const tx = await landV2Contract?.mintWinningBid(input?.xArray, input?.yArray)
                    addTransaction(tx, { summary: `Mint Winning Bid succeed!` })
                    return tx
                } catch(e) {
                    return e
                }
            }
        },
        [addTransaction, landV2Contract]
    )

    const web3 = createAlchemyWeb3(
        alchemyApi[ mainNetworkChainId ].https
    );

    const fetchLandNFT = useCallback(async () => {
        if( account && chainId === mainNetworkChainId ) {
            let pageKey = null
            let contractNFTs = [] as any
            while(true) {
                const nftParam = {
                    owner : account!,
                    contractAddresses: [ shiberseContractAddresses[mainNetworkChainId].LAND_NFT ]
                } as any

                if( pageKey )
                    nftParam.pageKey = pageKey

                const response = await web3.alchemy.getNfts( nftParam ) as any

                const temp = response.ownedNfts
                contractNFTs = [ ...contractNFTs, ...temp ]

                pageKey = response.pageKey
                if( response.error || !response.pageKey )
                    break
            }
            const resultArray = [] as any

            for( let i = 0; i < contractNFTs.length; i++ ) {
                const newValue = { ...contractNFTs[i] } as any
                // const tokenId = parseInt( contractNFTs[i].id.tokenId )
                // newValue.metaInfo = await fetch( metadataURL + tokenId )
                // newValue.metaInfo = await newValue.metaInfo.json()
                resultArray.push(newValue)
            }

            setLandNFTs(resultArray)
        }
    }, [account, chainId])

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

    return { currentBidCount, currentStage, allPlacedBids, winningBids, isShiboshiHolder, bidOne, bidShiboshiZone, bidMulti, bidShiboshiZoneMulti, mintPrivate, mintPrivateShiboshiZone, mintPrivateMulti, mintPrivateShiboshiZoneMulti, mintPublic, mintWinningBid, fetchLandPrice, loadingBidsInfo, fetchLandCurrentWinner, fetchLandCurrentOwner, landNFTs }

}

export default useShiberseLandAuction