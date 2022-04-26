import React, { useEffect } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useState } from 'react'
import expandIcon from 'assets/images/expand.svg'
import x from 'assets/images/x.svg'
import checkIcon from 'assets/images/map/icons/check.svg'
import './selectbutton.scss'
import RangeInputMinMax from 'components/RangeInputMinMax'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { updateSearchOptions } from 'state/map/actions'
import { ReactComponent as Close } from 'assets/images/x.svg'
import useLandMap from 'hooks/useLandMap'

/* styled elements */
const FilterPanel = styled.div<{expand: boolean}>`
    background: #FFFFFF;
    border: 1px solid #785838;
    box-sizing: border-box;
    border-radius: 8px;
    width: 251px;
    height: ${({ expand }) => expand ? 'auto' : '45'}px;
    transition: all .5s;
    position: absolute;
    top: 5rem;
    left: 2rem;
    z-index: 10;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 1rem;
    overflow: hidden;
`

const FilterHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Title = styled.div`
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #785838;
`

const FilterActions = styled.div`
    display: flex;
`

const ClearIcon = styled.div`
    width: 18px;
    margin-top: -4px;
    margin-right: 10px;

    &:hover {
        cursor: pointer;
    }
`

const ExpandIcon = styled.div`
    width: 18px;

    &:hover {
        cursor: pointer;
    }
`

const FilterContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    padding-bottom: .5rem;
    border-bottom: 0.5px solid #785838;
`

const RangeWrapper = styled.div`
    padding: 1rem 0;
    border-bottom: 0.5px solid #785838;
    width: 100%;
`

const SearchByWrapper = styled.div`
    padding: 1rem 0;
    width: 100%;
    border-bottom: 0.5px solid #785838;

    &.borderNone {
        border: none;
    }
`

const SearchDesc = styled.p`
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #785838;
    margin-bottom: .5rem;
`

const InputDesc = styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    color: rgba(32, 31, 49, 0.85);
    margin-right: 5px;
`

const CoordinateInput = styled.input`
    width: 65px;
    height: 24px;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: #785838;
    padding: 0;
    padding-left: .5rem;
    border-color: #785838;
    border-radius: 2px;
`

const WalletInput = styled.input`
    width: 184px;
    height: 25px;
    border: 1px solid #785838;
    border-radius: 2px;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    padding: .5rem .3rem;
    color: #785838;
    padding-right: 1.4rem;

    ::placeholder {
        font-style: italic;
    }
`

const GoButton = styled.button`
    background: #ffffff;
    border: 1px solid #181220;
    border-radius: 2px;
    color: #363755;

    font-weight: 600;
    font-size: 10px;
    line-height: 15px;
    padding: 4px 3px;

    :hover {
        color: #785838;
        border-color: #785838;
    }
`

const CloseIcon = styled.div`
    position: absolute;
    right: 2.5rem;
    top: 0;

    svg {
        width: 15px;
        stroke: #363755 !important;
    }

    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`

const CloseColor = styled(Close)`
    path {
        stroke: 'black';
    }
`

const filterData = [
    {
        color: '#FFFFFF',
        borderColor: '#a7352d',
        text: 'Shiboshis Zone',
        searchOption: 'shiboshiZone'
    }, {
        color: '#A1AFBA',
        text: 'Leasing Hubs',
        searchOption: 'privatehub'
    }, {
        color: '#DFB850',
        text: 'Diamond Teeth',
        searchOption: 'diamond'
    }, {
        color: '#5B5E6B',
        text: 'Platinum Paw',
        searchOption: 'platinum'
    }, {
        color: '#75747D',
        text: 'Golden Tail',
        searchOption: 'gold'
    }, {
        color: '#31323E',
        text: 'Silver Fur',
        searchOption: 'silver'
    },
    {
        color: '#49ad4e',
        text: 'Open for minting',
        searchOption: 'openforminting'
    }
]

export const MapFilter = () => {
    const [ expand, setExpand ] = useState(true)

    const searchOptions = useSelector<AppState, AppState['map']['searchOptions']>(state => state.map.searchOptions)

    const [ priceRangeValues, setPriceRangeValues ] = useState([ 0.2, 1 ])
    const [ minPos, setMinPos ] = useState('') as any
    const [ maxPos, setMaxPos ] = useState('') as any
    const [ searchWallet, setSearchWallet ] = useState('') as any
    const [ isFirst, setIsFirst ] = useState(true)

    const dispatch = useDispatch<AppDispatch>()

    const setSearchOptions = (newOptions: any): any => dispatch( updateSearchOptions( { newOptions } ) )

    const { minPrice, maxPrice } = useLandMap()

    const setSearchOption = ( option: string ) => {
        const newOptions = { ...searchOptions }

        newOptions[ option ] = !newOptions[ option ]

        setSearchOptions( newOptions )
    }

    useEffect(() => {
        if( searchOptions.clearFilters ) {
            setMinPos('')
            setMaxPos('')
            setSearchWallet('')
            setPriceRangeValues([ searchOptions.searchMinPrice, searchOptions.searchMaxPrice ])

            const newOptions = { ...searchOptions }
            newOptions.clearFilters = false
            setSearchOptions( newOptions )
        } else {
            let [ min, max ] = priceRangeValues
        
            if( max > searchOptions.maxPrice || min < searchOptions.minPrice ) {
                if( max > searchOptions.maxPrice )
                    max = searchOptions.maxPrice
                if( min < searchOptions.minPrice )
                    min = searchOptions.minPrice
    
                setPriceRangeValues([ min, max ])
            }
        }
    }, [ searchOptions ])

    useEffect(() => {
        if( isFirst && searchOptions.maxPrice !== 1 ) {
            setIsFirst(false)

            let [ min, max ] = priceRangeValues
            max = searchOptions.maxPrice
            setPriceRangeValues([ min, max ])
        }
    }, [ searchOptions.maxPrice ])

    useEffect(() => {
        const [ min, max ] = priceRangeValues

        const newOptions = { ...searchOptions }
        newOptions.searchMinPrice = min
        newOptions.searchMaxPrice = max
        setSearchOptions( newOptions )
    }, [priceRangeValues])

    const updatePosRange = () => {
        let [minX, minY] = minPos.split(',')
        let [maxX, maxY] = maxPos.split(',')

        if( minPos === '' ) {
            minX = null
            minY = null
        }

        if( maxPos === '' ) {
            maxX = null
            maxY = null
        }

        if( Number(minX) === NaN || Number(minY) === NaN || Number(maxX) === NaN || Number(maxY) === NaN )
            return

        const newOptions = { ...searchOptions }
        newOptions.minPos = {
            x: !minX ? null : Number(minX),
            y: !minY ? null : Number(minY)
        }
        newOptions.maxPos = {
            x: !maxX ? null : Number(maxX),
            y: !maxY ? null : Number(maxY)
        }
        setSearchOptions( newOptions )
    }

    const updateSearchWallet = () => {
        const newOptions = { ...searchOptions }
        newOptions.walletAddress = searchWallet
        setSearchOptions( newOptions )
    }

    const handleClearWalletAddress = () => {
        const newOptions = { ...searchOptions }
        newOptions.walletAddress = ''
        setSearchOptions( newOptions )

        setSearchWallet('')
    }

    const handleClearFilters = () => {
        const newOptions = {
            shiboshiZone: false,
            privatehub: false,
            diamond: false,
            platinum: false,
            gold: false,
            silver: false,
            openforbid: false,
            openforminting: false,
    
            minPrice: minPrice,
            maxPrice: maxPrice,
    
            searchMinPrice: minPrice,
            searchMaxPrice: maxPrice,
    
            minPos: {
                x: null,
                y: null,
            },
            maxPos: {
                x: null,
                y: null,
            },
    
            walletAddress: '',

            clearFilters: true
        }

        setSearchOptions( newOptions )
    }
    
    return (
        <FilterPanel expand={expand}>
            <FilterHeader>
                <Title>Filters</Title>
                <FilterActions>
                    <ClearIcon onClick={() => handleClearFilters() }>
                        <img src={x}></img>
                    </ClearIcon>
                    <ExpandIcon onClick={() => setExpand(prev => !prev)}>
                        <img src={expandIcon}></img>
                    </ExpandIcon>
                </FilterActions>
            </FilterHeader>

            <FilterContent className='w-full'>
                { filterData.map((item, index) => (
                    <div 
                        className={`leftSideBar__sizeSelect__item ${ searchOptions[ item.searchOption ] === true ? 'active' : '' }`} 
                        key={`filter ${index}`} 
                        onClick={ () => setSearchOption( item.searchOption ) 
                        }>
                        <div className="leftSideBar__sizeSelect__item__btn">
                            <button>
                                <img alt="selected" src={ checkIcon }></img>
                            </button> 
                        </div>
                        <div 
                            className='leftSideBar__sizeSelect__item__square' 
                            style={{ 
                                background: item.color, 
                                border: item.borderColor ? `2px solid ${ item.borderColor }` : 'none'
                            }} 
                        />
                        <p className="leftSideBar__sizeSelect__item__label">{ item.text }</p>
                    </div>
                )) }
            </FilterContent>

            <RangeWrapper>
                <RangeInputMinMax
                    min={ searchOptions.minPrice }
                    max={ searchOptions.maxPrice }
                    values={ priceRangeValues }
                    setValues={ setPriceRangeValues }
                    step={ 0.1 }
                />
            </RangeWrapper>

            <SearchByWrapper className='borderNone'>
                <SearchDesc>Search by zone</SearchDesc>

                <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <div className='flex items-center mr-2'>
                            <InputDesc>XY</InputDesc>
                            <CoordinateInput 
                                type='text'
                                placeholder='12, 11'
                                value={ minPos } 
                                onChange={(e) => setMinPos(e.target.value)} 
                            />
                        </div>

                        <div className='flex items-center'>
                            <InputDesc>XY</InputDesc>
                            <CoordinateInput 
                                type='text'
                                placeholder='21, 14'
                                value={ maxPos } 
                                onChange={(e) => setMaxPos(e.target.value)} 
                            />
                        </div>
                    </div>

                    <GoButton onClick={updatePosRange}>GO</GoButton>
                </div>
            </SearchByWrapper>

            {/*<SearchByWrapper className='borderNone'>*/}
            {/*    <SearchDesc>Search by wallet</SearchDesc>*/}

            {/*    <div className='flex justify-between items-center relative'>*/}
            {/*        <WalletInput */}
            {/*            type='text'*/}
            {/*            placeholder='Paste your wallet address'*/}
            {/*            value={ searchWallet } */}
            {/*            onChange={(e) => setSearchWallet(e.target.value)}*/}
            {/*        />*/}
            {/*        <CloseIcon onClick={handleClearWalletAddress}>*/}
            {/*            <CloseColor />*/}
            {/*        </CloseIcon>*/}

            {/*        <GoButton onClick={updateSearchWallet}>GO</GoButton>*/}
            {/*    </div>*/}
            {/*</SearchByWrapper>*/}
        </FilterPanel>
    )
}

export default MapFilter;