import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { Fraction } from '../entities'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useShiberseStakeContract, useShiberseTokenContract } from './useContract'
import { mainNetworkChainId } from '../constants'
import { useBlockNumber } from 'state/application/hooks'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

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
        "https://eth-ropsten.alchemyapi.io/v2/98S0aeOjT9paE0bz4424qsAk9QndTBUi",
    );

    const getNftMetadata = async (contractaddress: any, tokenid: any) => {
        return await web3.alchemy.getNftMetadata({
            contractAddress: contractaddress,
            tokenId: tokenid
        });
    }

    const fetchWalletNFT = useCallback(async () => {
        // const fetchNFTData = await fetch(
        //     `https://api.opensea.io/api/v1/assets?owner=${ account }&asset_contract_address=${ tokenContract?.address }&order_direction=desc&offset=0`,
        //     {
        //         headers: {
        //             'X-API-KEY': '8ca8a415ac814e25ba4e81fbc0659f30'
        //         }
        //     }
        // )

        // const response = await fetchNFTData.json()

        if( account && chainId === mainNetworkChainId ) {
            const fetchNFTData = await web3.alchemy.getNfts({ owner : account! });

            const contractNFTs = fetchNFTData.ownedNfts.filter((item: any) => item.contract.address === tokenContract?.address.toLowerCase())
    
            return contractNFTs
        }

        return []
    }, [account, chainId, tokenContract])

    return {isApproved, approve, stake, stakedBalance, fetchWalletNFT}
}

export default useShiberseStakeNFT