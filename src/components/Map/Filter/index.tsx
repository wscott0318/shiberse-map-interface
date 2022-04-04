import React from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useState } from 'react'
import expandIcon from 'assets/images/expand.svg'
import checkIcon from 'assets/images/map/icons/check.svg'
import './selectbutton.scss'
import RangeInputMinMax from 'components/RangeInputMinMax'

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
    width: 61px;
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
    width: 158px;
    height: 25px;
    border: 1px solid #785838;
    border-radius: 2px;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    padding: .5rem .3rem;
    color: #785838;

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

export const MapFilter = () => {
    const [ expand, setExpand ] = useState(true)
    const [ priceRangeValues, setPriceRangeValues ] = useState([ 0.2, 3 ])

    const filterData = [
        {
            color: '#FFFFFF',
            borderColor: '#E01515',
            text: 'Shiboshis Zone'
        }, {
            color: '#A1AFBA',
            text: 'Private Hubs'
        }, {
            color: '#DFB850',
            text: 'Diamond Woof'
        }, {
            color: '#5B5E6B',
            text: 'Platinum Paw'
        }, {
            color: '#75747D',
            text: 'Gold Tail'
        }, {
            color: '#31323E',
            text: 'Silver Fur'
        }, {
            color: '#05DC1B',
            text: 'Open for Bid'
        },
    ]

    return (
        <FilterPanel expand={expand}>
            <FilterHeader>
                <Title>Filters</Title>
                <ExpandIcon onClick={() => setExpand(prev => !prev)}>
                    <img src={expandIcon}></img>
                </ExpandIcon>
            </FilterHeader>

            <FilterContent className='w-full'>
                { filterData.map((item, index) => (
                    <div className={`leftSideBar__sizeSelect__item ${ false ? 'active' : '' }`} key={`filter ${index}`}>
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
                    min={ 0.1 }
                    max={ 5 }
                    values={ priceRangeValues }
                    setValues={ setPriceRangeValues }
                    step={ 0.1 }
                />
            </RangeWrapper>

            <SearchByWrapper>
                <SearchDesc>Search by coordinates</SearchDesc>

                <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <div className='flex items-center mr-2'>
                            <InputDesc>X</InputDesc>
                            <CoordinateInput type='number' placeholder='0'/>
                        </div>

                        <div className='flex items-center'>
                            <InputDesc>Y</InputDesc>
                            <CoordinateInput type='number' placeholder='0'/>
                        </div>
                    </div>

                    <GoButton>GO</GoButton>
                </div>
            </SearchByWrapper>

            <SearchByWrapper className='borderNone'>
                <SearchDesc>Search by wallet</SearchDesc>

                <div className='flex justify-between items-center'>
                    <WalletInput type='text' placeholder='Paste your wallet address'/>

                    <GoButton>GO</GoButton>
                </div>
            </SearchByWrapper>
        </FilterPanel>
    )
}

export default MapFilter;