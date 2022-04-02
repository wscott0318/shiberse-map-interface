import React from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useState } from 'react'
import expandIcon from 'assets/images/expand.svg'
import checkIcon from 'assets/images/map/icons/check.svg'
import './selectbutton.scss'

/* styled elements */
const FilterPanel = styled.div<{expand: boolean}>`
    background: #FFFFFF;
    border: 1px solid #785838;
    box-sizing: border-box;
    border-radius: 8px;
    width: 204px;
    height: ${({ expand }) => expand ? '233' : '45'}px;
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
`

export const MapFilter = () => {
    const [ expand, setExpand ] = useState(true)

    const filterData = [
        {
            color: '#1C1C25',
            text: 'Locked'
        }, {
            color: '#A1AFBA',
            text: 'Hubs'
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

            <FilterContent>
                { filterData.map((item, index) => (
                    <div className={`leftSideBar__sizeSelect__item ${ false ? 'active' : '' }`} key={`filter ${index}`}>
                        <div className="leftSideBar__sizeSelect__item__btn">
                            <button>
                                <img alt="selected" src={ checkIcon }></img>
                            </button> 
                        </div>
                        <div className='leftSideBar__sizeSelect__item__square' style={{ background: item.color }}></div>
                        <p className="leftSideBar__sizeSelect__item__label">{ item.text }</p>
                    </div>
                )) }
            </FilterContent>
        </FilterPanel>
    )
}

export default MapFilter;