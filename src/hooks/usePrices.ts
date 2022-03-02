import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import shibaData from '@shibaswap/shibaswap-data-snoop'
import {shibaExchange} from 'apollo/client'
import {liquidityOfDay, TOKEN_DAYDATA} from 'apollo/queries'
import { useQuery } from "@apollo/client";

const { BigNumber } = ethers

const usePrices = () => {
    const [shibPrice, setShibPrice] = useState<string>('0')
    const [leashPrice, setLeashPrice] = useState<string>('0')
    const [bonePrice, setBonePrice] = useState<string>('0')
    
    const fetchPrices = useCallback(async () => {
        const prices = await Promise.all([
            shibaData.bone.priceUSD(),
            shibaData.shib.priceUSD(),
            shibaData.leash.priceUSD()
        ])
        setBonePrice(String(Number(prices[0])))
        setShibPrice(String(Number(prices[1])))
        setLeashPrice(String(Number(prices[2])))
    }, []);

    useEffect(() => {
        fetchPrices()
        const refreshInterval = setInterval(fetchPrices, 20000)
        return () => clearInterval(refreshInterval)
    }, [fetchPrices])

    const fetchTVL = useCallback(async () =>{
        const liqDay = await Promise.resolve(shibaExchange.query({
            query: liquidityOfDay
        }))
        // console.log(liqDay)
        return liqDay.data?.dayDatas[0]
    },[])

    const fetchTotalVolumeUSD = useCallback(async () =>{
        const dayData = await Promise.resolve(shibaData.exchange.dayData())
        return dayData? Number(dayData[0]?.volumeUSD) : undefined
    },[])

    const fetchTokenVolumeUSD = useCallback(async ( id ) =>{
        const tokenData = await Promise.resolve(shibaExchange.query({
            query: TOKEN_DAYDATA,
            variables: {
                id: id
            }
        }))
        
        return tokenData.data? Number(tokenData.data.token.dayData[0]?.volumeUSD) : undefined
    },[])

    const fetchEthPrice = useCallback(async () =>{
        const ethPrice = await Promise.resolve(shibaData.exchange.ethPrice())
        return ethPrice? Number(ethPrice) : undefined
    },[])

    return {shibPrice, leashPrice, bonePrice, fetchTVL, fetchTotalVolumeUSD, fetchTokenVolumeUSD, fetchEthPrice}
}

export default usePrices
