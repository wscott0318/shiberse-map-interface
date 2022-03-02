import React from 'react';
import styled from 'styled-components'
import DigImage from '../../assets/images/home/index.png'

export interface ToggleButtonProps {
    id?: string
    toggle: () => void
}

const StyledToggle = styled.button`
    border-radius: 4px;
    border: none;
    background: #d5d5d5;
    display: inline-block;
    width: 50px;
    height: 22px;
    font-size: 14px;
    font-family: "Metric - Bold";
    font-style: normal;
    text-align: center;
    color: #1b1d2a;
    letter-spacing: 0.08px;
    cursor: pointer;
    outline: none;
    padding:0px;
    display: table-cell;
    float: right;
    font-weight:bold;
`
export default function ToggleButton({id, toggle}: ToggleButtonProps) {
    return <StyledToggle id={id} onClick={toggle}>MODE
    </StyledToggle>
}