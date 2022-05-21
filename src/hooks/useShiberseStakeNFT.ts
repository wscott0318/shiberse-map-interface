import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { Fraction } from '../entities'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseStakeContract, useShiberseTokenContract } from './useContract'
import { alchemyApi, mainNetworkChainId, metadataURL } from '../constants'
import { useBlockNumber } from 'state/application/hooks'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { formatFromBalance } from 'utils'

const { BigNumber } = ethers

const useShiberseStakeNFT = (props:any) => {
    const { account, chainId } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const currentBlockNumber = useBlockNumber()

    let tokenType = props.tokenType? props.tokenType.toUpperCase() : "SHIBOSHI";

    const tokenContract = useShiberseTokenContract( tokenType, true )
    const stakeContract = useShiberseStakeContract( tokenType, true )
    
    //allowance state variable
    const [isApproved, setIsApproved] = useState(false)
    const [stakedBalance, setStakedBalance] = useState('0')
    const [lockDays, setLockDays] = useState(0)
    const [stakeLimitInfo, setStakeLimitInfo] = useState({
        AMOUNT_MAX: 10,
        AMOUNT_MIN: 1,
        DAYS_MAX: 90,
        DAYS_MIN: 45,
    })
    const [unlockAt, setUnlockAt] = useState(null)

    //Fetch Sushi Allowance
    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const approved = await tokenContract?.isApprovedForAll(account, stakeContract?.address)
                setIsApproved(approved)
            } catch {
                setIsApproved(false)
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
            const tx = await tokenContract?.setApprovalForAll(stakeContract?.address, true)
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
            if (input?.ids && input?.numDaysToAdd) {
                try {
                    const tx = await stakeContract?.lock(input?.ids, input?.numDaysToAdd)
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
                const formatted = lockInfo.ids.length
                setStakedBalance(formatted.toString())

                const numDays = Number( formatFromBalance( lockInfo.numDays, 0 ) )
                setLockDays( numDays )
            } else {
                setStakedBalance('0')
            }

            const unlockTime = await stakeContract?.unlockAt( account )
            setUnlockAt( unlockTime )
        } catch(e) {
            return e
        }
    }, [account, chainId, stakeContract, currentBlockNumber])

    useEffect(() => {
        if( account && chainId === mainNetworkChainId )
            fetchLockInfo()
    }, [ account, chainId, fetchLockInfo ])

    const web3 = createAlchemyWeb3(
        alchemyApi[ mainNetworkChainId ].https
    );

    const fetchWalletNFT = useCallback(async () => {
        if( account && chainId === mainNetworkChainId ) {
            let pageKey = null
            let contractNFTs = [] as any
            while(true) {
                const nftParam = {
                    owner : account!,
                    contractAddresses: [ tokenContract?.address as any ]
                } as any

                if( pageKey )
                    nftParam.pageKey = pageKey

                const response = await web3.alchemy.getNfts( nftParam ) as any

                const temp = response.ownedNfts.filter((item: any) => item.contract.address === tokenContract?.address.toLowerCase())
                contractNFTs = [ ...contractNFTs, ...temp ]

                pageKey = response.pageKey
                if( response.error || !response.pageKey )
                    break
            }
            const resultArray = [] as any

            for( let i = 0; i < contractNFTs.length; i++ ) {
                const newValue = { ...contractNFTs[i] } as any
                const tokenId = parseInt( contractNFTs[i].id.tokenId )
                newValue.metaInfo = await fetch( metadataURL + tokenId )
                newValue.metaInfo = await newValue.metaInfo.json()
                resultArray.push(newValue)
            }

            return resultArray
        }

        return []
    }, [account, chainId, tokenContract])

    const fetchStakeLimitInfo = useCallback(async () => {
        const amount_max = await stakeContract?.AMOUNT_MAX()
        const amount_min = await stakeContract?.AMOUNT_MIN()

        const days_max = await stakeContract?.DAYS_MAX()
        const days_min = await stakeContract?.DAYS_MIN()

        setStakeLimitInfo({
            AMOUNT_MAX: Number(formatFromBalance(amount_max, 0)),
            AMOUNT_MIN: Number(formatFromBalance(amount_min, 0)),
            DAYS_MAX: Number(formatFromBalance(days_max, 0)),
            DAYS_MIN: Number(formatFromBalance(days_min, 0)),
        })
    }, [account, chainId, stakeContract, tokenContract])

    useEffect(() => {
        if( account && chainId === mainNetworkChainId )
            fetchStakeLimitInfo()
    }, [ account, chainId, fetchStakeLimitInfo ])

    return {isApproved, approve, stake, stakedBalance, fetchWalletNFT, lockDays, stakeLimitInfo, unlockAt, unlock}
}

export default useShiberseStakeNFT