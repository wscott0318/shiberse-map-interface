import React from 'react'
import checkIcon from 'assets/images/map/icons/check.svg'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { updateMultiSelect } from 'state/map/actions'

const ToggleWrapper = styled.div`
    top: 5rem;
    right: 2rem;
    background: #201f31d1;
    border-radius: 5px;
    width: 250px;
    padding: .5rem 0;
`

const CheckText = styled.p`
    color: white !important;

    &:hover {
        color: #d99e63 !important;
    }
`

export const ToggleMultiSelect = () => {    
    const multiSelect = useSelector<AppState, AppState['map']['multiSelect']>(state => state.map.multiSelect)

    const dispatch = useDispatch<AppDispatch>()

    const setMultiSelect = (value: boolean): any => dispatch( updateMultiSelect( { newValue: value } ) )

    return (
        <ToggleWrapper className='absolute flex justify-center items-center'>
            <div 
                className={`leftSideBar__sizeSelect__item mb-0 ${ multiSelect ? 'active' : '' }`} 
                onClick={ () => setMultiSelect( !multiSelect ) }
            >
                <div className="leftSideBar__sizeSelect__item__btn">
                    <button>
                        <img alt="selected" src={ checkIcon }></img>
                    </button> 
                </div>

                <CheckText className="leftSideBar__sizeSelect__item__label">Multiselect Bidding</CheckText>
            </div>
        </ToggleWrapper>
    )
}