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
    const [stakeLimitInfo, setStakeLimitInfo] = useState({
        AMOUNT_MAX: 1,
        AMOUNT_MIN: 0,
        DAYS_MAX: 1,
        DAYS_MIN: 0,
    })

    //Fetch Sushi Allowance
    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const approved = await tokenContract?.isApprovedForAll(account, stakeContract?.address)
                // const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
                setIsApproved(approved)
            } catch {
                setIsApproved(false)
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
            const tx = await tokenContract?.setApprovalForAll(stakeContract?.address, true)
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, stakeContract, tokenContract])

    const stake = useCallback(
        // todo: this should be updated with BigNumber as opposed to string
        async (input: any | undefined) => {
            if (input?.ids && input?.numDaysToAdd) {
                try {
                    const tx = await stakeContract?.lock(input?.ids, input?.numDaysToAdd)
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
                const formatted = balance.ids.length
                setStakedBalance(formatted.toString())
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

    const web3 = createAlchemyWeb3(
        alchemyApi.https
    );

    const fetchWalletNFT = useCallback(async () => {
        if( account && chainId === mainNetworkChainId ) {
            const fetchNFTData = await web3.alchemy.getNfts({ owner : account! });

            const contractNFTs = fetchNFTData.ownedNfts.filter((item: any) => item.contract.address === tokenContract?.address.toLowerCase())

            return contractNFTs
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
    })

    return {isApproved, approve, stake, stakedBalance, fetchWalletNFT, stakeLimitInfo}
}

export default useShiberseStakeNFT