import { BigNumber } from '@ethersproject/bignumber'
import sushiData from '@sushiswap/sushi-data'
import shibaData from '@shibaswap/shibaswap-data-snoop'
import { useActiveWeb3React } from 'hooks'
import { useBoringHelperContract, useShibaHelperContract } from 'hooks/useContract'
import _, { chain } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { exchange, masterchef, shibaExchange, topDog } from 'apollo/client'
import { getAverageBlockTime } from 'apollo/getAverageBlockTime'
import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery, shibaSwapPoolsQuery } from 'apollo/queries'
import { POOL_DENY } from '../constants'
import { Fraction } from '../entities'
import { SHIBASWAP_TOPDOG_ADDRESS } from '@shibaswap/sdk'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useShibaSwapFarms = () => {
    const [farms, setFarms] = useState<any | undefined>()
    const { account, chainId } = useActiveWeb3React()
    const shibaHelperContract = useShibaHelperContract()

    const fetchAllFarms = useCallback(async () => {
        const results = await Promise.all([
            topDog.query({
                // results[0]
                query: shibaSwapPoolsQuery
            }),
            getAverageBlockTime(), // results[1]
            shibaData.bone.priceUSD() // results[2]
        ])

        const liquidityPosition = chainId
            ? await shibaExchange.query({
                  // results[1]
                  query: liquidityPositionSubsetQuery,
                  variables: { user: SHIBASWAP_TOPDOG_ADDRESS[chainId].toLowerCase() }
              })
            : undefined

        const pools = results[0]?.data.pools
        const pairAddresses = pools
            .map((pool: any) => {
                return pool.pair
            })
            .sort()
        const pairsQuery = await shibaExchange.query({
            query: pairSubsetQuery,
            variables: { pairAddresses }
        })

        const liquidityPositions = liquidityPosition?.data.liquidityPositions
        const averageBlockTime = results[1]
        const bonePrice = results[2]
        // const kashiPairs = results[4].filter(result => result !== undefined) // filter out undefined (not in onsen) from all kashiPairs

        const pairs = pairsQuery?.data.pairs
        const flterPools = pools.filter((pool: any) => {
            return !!pairs.some((pair: any) => pair.id === pool.pair)
        })
        // const KASHI_PAIRS = _.range(190, 230, 1) // kashiPair pids 189-229
        const farms = flterPools.map((pool: any) => {
            const pair: any = pairs.find((pair: any) => pair.id === pool.pair)
            const liquidityPosition = liquidityPositions.find(
                (liquidityPosition: any) => liquidityPosition.pair.id === pair.id
            )
            const blocksPerHour = 3600 / averageBlockTime
            const balance = Number(pool.balance / 1e18) > 0 ? Number(pool.balance / 1e18) : 0.1
            const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
            const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
            const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
            // const rewardPerBlock =  ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.bonePerBlock) / 1e18
            const rewardPerBlock = ((pool.allocPoint / pool.owner.totalAllocPoint) * 20000000000000000000) / 1e18
            const roiPerBlock = (rewardPerBlock * bonePrice) / balanceUSD
            const roiPerHour = roiPerBlock * blocksPerHour
            const roiPerDay = roiPerHour * 24
            const roiPerMonth = roiPerDay * 30
            const roiPerYear = roiPerMonth * 12

            return {
                ...pool,
                type: 'SSLP',
                symbol: pair?.token0.symbol + '-' + pair?.token1.symbol,
                name: pair?.token0.name + ' ' + pair?.token1.name,
                pid: Number(pool.id),
                allocation: Number(pool.allocPoint),
                pairAddress: pair?.id,
                sslpBalance: pool.balance,
                liquidityPair: pair,
                balanceUSD: balanceUSD,
                rewardPerBlock: rewardPerBlock,
                roiPerBlock: roiPerBlock,
                roiPerHour: roiPerHour,
                roiPerDay: roiPerDay,
                roiPerMonth: roiPerMonth,
                roiPerYear: roiPerYear,
                rewardPerThousand: 1 * roiPerDay * (1000 / bonePrice),
                tvl: liquidityPosition?.liquidityTokenBalance
                    ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
                    : 0.1
            }
        })

        const sorted = _.orderBy(farms, ['pid'], ['desc'])

        const pids = sorted.map(pool => {
            return pool.pid
        })

        // if (account) {
        //     const userFarmDetails = await shibaHelperContract?.pollPools(account, pids)
        //     const userFarms = userFarmDetails
        //         .filter((farm: any) => {
        //             return farm.balance.gt(BigNumber.from(0)) || farm.pending.gt(BigNumber.from(0))
        //         })
        //         .map((farm: any) => {

        //             const pid = farm.pid.toNumber()
        //             const farmDetails = sorted.find((pair: any) => pair.pid === pid)

        //             let deposited
        //             let depositedUSD

        //             deposited = Fraction.from(farm.balance, BigNumber.from(10).pow(18)).toString(18)
        //             depositedUSD =
        //                 farmDetails.slpBalance && Number(farmDetails.slpBalance / 1e18) > 0
        //                     ? (Number(deposited) * Number(farmDetails.tvl)) / (farmDetails.slpBalance / 1e18)
        //                     : 0

        //             const pending = Fraction.from(farm.pending, BigNumber.from(10).pow(18)).toString(18)

        //             return {
        //                 ...farmDetails,
        //                 type: farmDetails.type, // KMP or SLP
        //                 depositedLP: deposited,
        //                 depositedUSD: depositedUSD,
        //                 pendingBone: pending
        //             }
        //         })
        //     setFarms({ farms: sorted, userFarms: userFarms })
        // } else {
        //     setFarms({ farms: sorted, userFarms: [] })
        // }

        setFarms({ farms: sorted, userFarms: [] })
    }, [chainId])

    useEffect(() => {
        fetchAllFarms()
    }, [fetchAllFarms])

    return farms
}

export default useShibaSwapFarms
