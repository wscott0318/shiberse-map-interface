import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import { apiServer, mapLandDataUrl, mapLandPriceDataUrl } from "constants/map"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { updateSearchOptions } from 'state/map/actions'

const useLandMap = () => {
    const { account } = useWeb3React()

    const [landData, setLandData] = useState([])
    const [landPriceData, setLandPriceData] = useState({}) as any
    const [isLandDataLoaded, setIsLandDataLoaded] = useState(false)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(1)
    const [accountBidsInfo, setAccountBidsInfo] = useState([])

    const searchOptions = useSelector<AppState, AppState['map']['searchOptions']>(state => state.map.searchOptions)

    const dispatch = useDispatch<AppDispatch>()

    const setSearchOptions = (newOptions: any): any => dispatch( updateSearchOptions( { newOptions } ) )

    const fetchInfo = useCallback(async () => {
        if( !landData.length ) {    // only load at first time
            const result = await fetch(mapLandDataUrl)
            const json_data = await result.json()
    
            const result_data = json_data.filter((item: any) => item.tierName !== 'locked')
            setLandData(result_data)
        }

		const response = await axios.get(mapLandPriceDataUrl)
        const arrayData = response.data
        
        let minPrice: any, maxPrice: any

        const objectData = {} as any
        arrayData.forEach((item: any) => {
            objectData[item.id] = {
                ...item
            }

            if( !minPrice && !maxPrice ) {
                minPrice = item.price
                maxPrice = item.price
            } else {
                if( Number(item.price) > 0 && Number(minPrice) > Number(item.price) )
                    minPrice = Number(item.price)
                if( Number(maxPrice) < Number(item.price) )
                    maxPrice = Number(item.price)
            }
        })
        setLandPriceData( objectData )

        const oldOption = {} as any
        oldOption.minPrice = Number(minPrice)
        oldOption.maxPrice = Number(maxPrice)

        setSearchOptions(oldOption)

        setIsLandDataLoaded(true)

        setMinPrice(Number(minPrice))
        setMaxPrice(Number(maxPrice))
    }, [])

    const fetchAccountBidsInfo = useCallback(async () => {
        if( account ) {
            const response = await axios.get(`${apiServer}/users/${account?.toLowerCase()}?$select[]=bids`)
            const arrayData = response.data.bids.length > 0 ? response.data.bids : []
            setAccountBidsInfo(arrayData)
        }
    }, [account])

    useEffect(() => {
        fetchInfo()
        fetchAccountBidsInfo()

        const refreshInterval = setInterval(fetchInfo, 30000 * 10)
        return () => clearInterval(refreshInterval)
    }, [setLandData, setLandPriceData, setAccountBidsInfo, account])

    const updatePriceData = (newData: any) => {
        setLandPriceData((prev: any) => ({...prev, ...newData}))
    }

    return { landData, landPriceData, updatePriceData, isLandDataLoaded, minPrice, maxPrice, accountBidsInfo }
}

export default useLandMap