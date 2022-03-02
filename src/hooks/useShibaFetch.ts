import { signERC2612Permit } from 'eth-permit'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import ReactGA from 'react-ga'
import {
    useActiveWeb3React,
    useShibaSwapUniV2FetchContract,
    useShibaSwapSushiFetchContract,
    useTokenFetch
} from '../hooks'
import LPToken from '../types/LPToken'

const useShibaFetch = (tokenFetchKey:string) => {
    const { library, account } = useActiveWeb3React()
    const shibaFetch = useTokenFetch(tokenFetchKey);
    const ttl = 60 * 20

    const migrate = useCallback(
        async (lpToken: LPToken, amount: ethers.BigNumber) => {
            if (shibaFetch) {
                const deadline = Math.floor(new Date().getTime() / 1000) + ttl
                const args = [
                    lpToken.tokenA.address,
                    lpToken.tokenB.address,
                    amount,
                    ethers.constants.Zero,
                    ethers.constants.Zero,
                    deadline
                ]

                const gasLimit = await shibaFetch.estimateGas.migrate(...args)
                const tx = shibaFetch.migrate(...args, {
                    gasLimit: gasLimit.mul(120).div(100)
                })

                ReactGA.event({
                    category: 'Migrate',
                    action: 'Uniswap->ShibaSwap',
                    label: 'migrate'
                })

                return tx
            }
        },
        [shibaFetch, ttl]
    )

    const migrateWithPermit = useCallback(
        async (lpToken: LPToken, amount: ethers.BigNumber) => {
            if (account && shibaFetch) {
                const deadline = Math.floor(new Date().getTime() / 1000) + ttl
                const permit = await signERC2612Permit(
                    library,
                    lpToken.address,
                    account,
                    shibaFetch.address,
                    amount.toString(),
                    deadline
                )
                const args = [
                    lpToken.tokenA.address,
                    lpToken.tokenB.address,
                    amount,
                    ethers.constants.Zero,
                    ethers.constants.Zero,
                    deadline,
                    permit.v,
                    permit.r,
                    permit.s
                ]

                const gasLimit = await shibaFetch.estimateGas.migrateWithPermit(...args)
                const tx = await shibaFetch.migrateWithPermit(...args, {
                    gasLimit: gasLimit.mul(120).div(100)
                })

                ReactGA.event({
                    category: 'Migrate',
                    action: 'Uniswap->ShibaSwap',
                    label: 'migrateWithPermit'
                })

                return tx
            }
        },
        [account, library, shibaFetch, ttl]
    )

    return {
        migrate,
        migrateWithPermit
    }
}

export default useShibaFetch
