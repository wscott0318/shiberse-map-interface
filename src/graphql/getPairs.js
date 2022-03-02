import { getApollo } from '../apollo/index'
import gql from 'graphql-tag'
import { useEffect, useRef } from 'react'
import {
    differenceInSeconds,
    getUnixTime,
    parseISO,
    startOfHour,
    startOfMinute,
    startOfSecond,
    subDays,
    subHours,
    subWeeks
} from 'date-fns'

import ids from './pairs.js'
export const PAIR_DENY = []
export const idsArray = ids

export const pairTokenFieldsQuery = gql`
    fragment pairTokenFields on Token {
        id
        name
        symbol
        totalSupply
        derivedETH
    }
`

export const pairFieldsQuery = gql`
    fragment pairFields on Pair {
        id
        name
        reserveUSD
        reserveETH
        volumeUSD
        untrackedVolumeUSD
        trackedReserveETH
        token0 {
            ...pairTokenFields
        }
        token1 {
            ...pairTokenFields
        }
        reserve0
        reserve1
        token0Price
        token1Price
        totalSupply
        txCount
        timestamp
    }
    ${pairTokenFieldsQuery}
`

export const pairsQuery = gql`
query pairsQuery(
  $first: Int! = 1000
  $orderBy: String! = "reserveUSD"
  $orderDirection: String! = "desc"
) {
  pairs(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: ${idsArray}) {
    ...pairFields
    oneDay @client
    sevenDay @client
  }
}
${pairFieldsQuery}`

const blockFieldsQuery = gql`
    fragment blockFields on Block {
        id
        number
        timestamp
    }
`

export const blockQuery = gql`
    query blockQuery($start: Int!, $end: Int!) {
        blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $start, timestamp_lt: $end }) {
            ...blockFields
        }
    }
    ${blockFieldsQuery}
`

export const pairsTimeTravelQuery = gql`
    query pairsTimeTravelQuery($first: Int! = 1000, $pairAddresses: [Bytes]!, $block: Block_height!) {
        pairs(
            first: $first
            block: $block
            orderBy: trackedReserveETH
            orderDirection: desc
            where: { id_in: $pairAddresses }
        ) {
            id
            reserveUSD
            trackedReserveETH
            volumeUSD
            untrackedVolumeUSD
            txCount
        }
    }
`

export async function getOneDayBlock(client = getApollo()) {
    const date = startOfMinute(subDays(Date.now(), 1))
    const start = Math.floor(date / 1000)
    const end = Math.floor(date / 1000) + 600

    const { data: blocksData } = await client.query({
        query: blockQuery,
        variables: {
            start,
            end
        },
        context: {
            clientName: 'blocklytics'
        },
        fetchPolicy: 'network-only'
    })

    return { number: Number(blocksData?.blocks[0].number) }
}

export async function getSevenDayBlock(client = getApollo()) {
    const date = startOfMinute(subWeeks(Date.now(), 1))
    const start = Math.floor(date / 1000)
    const end = Math.floor(date / 1000) + 600

    const { data: blocksData } = await client.query({
        query: blockQuery,
        variables: {
            start,
            end
        },
        context: {
            clientName: 'blocklytics'
        },
        fetchPolicy: 'network-only'
    })

    return { number: Number(blocksData?.blocks[0].number) }
}

export function useInterval(callback, delay) {
    const ref = useRef()

    useEffect(() => {
        ref.current = callback
    }, [callback])

    useEffect(() => {
        function tick() {
            ref.current()
        }
        if (delay !== null) {
            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

export async function getPairsList(client = getApollo()) {
    const {
        data: { pairs }
    } = await client.query({
        query: pairsQuery
    })

    const pairAddresses = pairs.map(pair => pair.id).sort()

    const oneDayBlock = await getOneDayBlock()

    const sevenDayBlock = await getSevenDayBlock()

    const {
        data: { pairs: oneDayPairs }
    } = await client.query({
        query: pairsTimeTravelQuery,
        variables: {
            block: oneDayBlock,
            pairAddresses
        },
        fetchPolicy: 'no-cache'
    })

    const {
        data: { pairs: sevenDayPairs }
    } = await client.query({
        query: pairsTimeTravelQuery,
        variables: {
            block: sevenDayBlock,
            pairAddresses
        },
        fetchPolicy: 'no-cache'
    })

    await client.cache.writeQuery({
        query: pairsQuery,
        data: {
            pairs: pairs.map(pair => {
                const oneDayPair = oneDayPairs.find(({ id }) => pair.id === id)
                const sevenDayPair = sevenDayPairs.find(({ id }) => pair.id === id)

                return {
                    ...pair,
                    sevenDay: {
                        untrackedVolumeUSD: String(sevenDayPair?.untrackedVolumeUSD),
                        volumeUSD: String(sevenDayPair?.volumeUSD),
                        reserveUSD: String(sevenDayPair?.reserveUSD),
                        txCount: String(oneDayPair?.txCount)
                    }
                }
            })
        }
    })
    // console.log("innerpairs")
    // console.log(pairs)
    return await client.cache.readQuery({
        query: pairsQuery
    })
}
