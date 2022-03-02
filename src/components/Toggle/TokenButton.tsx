import React from 'react';
import styled from 'styled-components'

export interface TokenButtonProps {
    id?: string
    toggle: () => void
    name: string
    disabled: boolean
}

const StyledToggle = styled.button`
    border-radius: 4px;
    border: none;
    background-color: #ffa409;
    display: flex;
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
    float: left;
    margin: 0px 2px;
    font-weight: bold;
`
export default function TokenButton({id, toggle, name, disabled}: TokenButtonProps) {
    return <StyledToggle style={{backgroundColor: disabled?'#996100':'#ffa409'}} id={id} onClick={toggle}>{name}</StyledToggle>
}