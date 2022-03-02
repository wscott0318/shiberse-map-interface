import { TransactionResponse } from '@ethersproject/providers'
import { ChainId, JSBI, TokenAmount } from '@shibaswap/sdk'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useShibaMerkleDistributorContract } from '../../hooks/useContract'
import { calculateGasMargin, isAddress } from '../../utils'
import { useSingleCallResult } from '../multicall/hooks'
import { useTransactionAdder } from '../transactions/hooks'
import { MERKLE_ROOT, SUSHI } from './../../constants/index'
import { MerkleAmountAndProofs } from '../../constants'

interface UserClaimData {
    index: number
    amount: string
    proof: string[]
    flags?: {
        isSOCKS: boolean
        isLP: boolean
        isUser: boolean
    }
}

const CLAIM_PROMISES: { [key: string]: Promise<UserClaimData | null> } = {}

// returns the claim for the given address, or null if not valid
function fetchClaim(account: string, chainId: ChainId, merkel: MerkleAmountAndProofs): Promise<UserClaimData | null> {
    const formatted = isAddress(account)
    if (!formatted) return Promise.reject(new Error('Invalid address'))
    const key = `${chainId}:${account}:${merkel.uniqueId}`
    //console.log('CLAIM_PROMISE:', CLAIM_PROMISES[key], key)
    return Promise.resolve(CLAIM_PROMISES[key] =
        CLAIM_PROMISES[key] ?? 
        // fetch(merkel.merkel_root)
        fetch(merkel.merkel_root+merkel.fileName+"-"+account+".json")
            .then(response => response.json())
            .then(data => {
                // const claim: typeof data.claims[0] | undefined = data.claims[account] ?? undefined
                const claim: any = data?? undefined
                if (!claim) return null

                // console.log('claim:', claim)
                return {
                    index: claim.index,
                    amount: claim.amount,
                    proof: claim.proof
                }
            })
            .catch(error => {
                console.log(error)
            })
        )
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export function useUserClaimData(account: string | null | undefined, merkel: MerkleAmountAndProofs ): UserClaimData | null | undefined {
    const { chainId } = useActiveWeb3React()

    const key = `${chainId}:${account}:${merkel.uniqueId}`
    const [claimInfo, setClaimInfo] = useState<{ [key: string]: UserClaimData | null }>({})

    useEffect(() => {
        if (!account || !chainId) return
         fetchClaim(account, chainId, merkel).then(accountClaimInfo =>
            setClaimInfo(claimInfo => {
                // console.log('claimInfo:', claimInfo, accountClaimInfo, key)
                return {
                    ...claimInfo,
                    [key]: accountClaimInfo
                }
            })
        )
    }, [account, chainId, key, merkel])
    return account && chainId ? claimInfo[key] : undefined
}

// check if user is in blob and has not yet claimed UNI
export function useUserHasAvailableClaim(account: string | null | undefined, merkel: MerkleAmountAndProofs): boolean {
    const userClaimData = useUserClaimData(account, merkel)
    const distributorContract = useShibaMerkleDistributorContract(merkel.distributorAddress)
    const isClaimedResult = useSingleCallResult(distributorContract, 'isClaimed', [userClaimData?.index])
    // user is in blob and contract marks as unclaimed 
    return Boolean(userClaimData && !isClaimedResult.loading && isClaimedResult.result?.[0] === false)
}

export function useUserUnclaimedAmount(account: string | null | undefined, merkel: MerkleAmountAndProofs): TokenAmount | undefined {
    const { chainId } = useActiveWeb3React()
    const userClaimData = useUserClaimData(account, merkel)
    const canClaim = useUserHasAvailableClaim(account, merkel)

    const token = chainId ? merkel.tokenAddress[chainId] : undefined

    // console.log('claimStats:', {
    //   canClaim: canClaim,
    //   userClaimData: userClaimData
    // })

    if (!token) return undefined
    if (!canClaim || !userClaimData) {
        return new TokenAmount(token, JSBI.BigInt(0))
    }
    return new TokenAmount(token, JSBI.BigInt(userClaimData.amount))
}

export function useClaimCallback(
    account: string | null | undefined,
    merkel: MerkleAmountAndProofs
): {
    claimCallback: () => Promise<string>
} {
    // get claim data for this account
    const { library, chainId } = useActiveWeb3React()
    const claimData = useUserClaimData(account, merkel)

    // used for popup summary
    const unClaimedAmount: TokenAmount | undefined = useUserUnclaimedAmount(account, merkel)
    const addTransaction = useTransactionAdder()
    const distributorContract = useShibaMerkleDistributorContract(merkel.distributorAddress)

    const claimCallback = async function() {
        if (!claimData || !account || !library || !chainId || !distributorContract) return

        const args = [claimData.index, account, claimData.amount, claimData.proof]

        return distributorContract.estimateGas['claim'](...args, {}).then(estimatedGasLimit => {
            return distributorContract
                .claim(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
                .then((response: TransactionResponse) => {
                    addTransaction(response, {
                        summary: `Claimed ${unClaimedAmount?.toSignificant(4)} ${merkel.rewardTokenName}`,
                        claim: { recipient: account }
                    })
                    return response.hash
                })
        })
    }

    return { claimCallback }
}
