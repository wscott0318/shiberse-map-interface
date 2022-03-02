import { darken, lighten } from 'polished'
import React from 'react'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import styled, { keyframes } from 'styled-components'
import { RowBetween } from '../Row'

const Base = styled(RebassButton)<{
    padding?: string
    width?: string
    borderRadius?: string
    altDisabledStyle?: boolean
}>`
    padding: ${({ padding }) => (padding ? padding : '16px')};
    width: ${({ width }) => (width ? width : '98%')};
    font-weight: 700;
    text-align: center;
    border-radius: 10px;
    border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
    outline: none;
    border: 1px solid transparent;
    color: white;
    text-decoration: none;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    position: relative;
    z-index: 1;
    margin:20px auto;
    &:disabled {
        cursor: auto;
        border: 1px solid #454959;
        color: #454959;
        outline: none;
        opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
        background: #161a23;
    }

    > * {
        user-select: none;
    }
`

const sheen = keyframes`{
  100% {
    transform: rotateZ(60deg) translate(1em, -30em);
  }
}`

export const ButtonPrimary = styled(Base)`
    border: none;
    border-radius: 0.5rem;
    background: #d5d5d5;
    color: #161a23;
    font-family: 'Metric - Bold';
    font-size: 1rem;
    font-weight: 700;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    overflow: hidden;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0.8rem;
    line-height: 1.6rem;
    background-origin: border-box;
    
    &:disabled {
        pointer-events: none;
        cursor: auto;
        box-shadow: none;
        border: 1px solid #454959;
        color: #454959;
        outline: none;
        height: 52px;
        opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
        background: #161a23;
    }
  

    &::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        bottom: -50%;
        left: -130%;
        transform: rotateZ(60deg) translate(-5em, 7.5em);
    }
`

export const ButtonPrimaryNormal = styled(Base)`
    border: none;
    border-radius: 0.25rem;
    background: #d5d5d5;
    color: #161a23;
    font-family: 'Metric - Semibold';
    font-size: 1rem;
    font-weight: 700;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    text-align: center;
    font-style: normal;
    letter-spacing: 0.11px;
    line-height: normal;
    padding-top:13px;

    &:disabled {
        cursor: auto;
        box-shadow: none;
        border: 1px solid #454959;
        color: #454959;
        outline: none;
        opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
        background: #161a23;
    }
    &:hover {
        color: #161a23;
    }
`

export const ButtonLight = styled(Base)`
    border: none;
    border-radius: 0.25rem;
    font-size: 110%;
    background: #d5d5d5;
    color: #161a23;
    font-family: 'Metric-Semibold'1rem ;
      font-weight: 600;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    text-align: center;
    font-style: normal;
    letter-spacing: 0.11px;
    line-height: normal;
  
    :disabled {
        opacity: 0.4;
        :hover {
            cursor: auto;
            box-shadow: none;
            border: 1px solid transparent;
            outline: none;
            background: #161a23;
        }
    }
`

export const ButtonGray = styled(Base)`
    background-color: ${({ theme }) => theme.bg3};
    color: ${({ theme }) => theme.text2};
    font-size: 16px;
    font-weight: 500;
  
    &:active {
        background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg4)};
    }
`

export const ButtonSecondary = styled(Base)`
    border: 1px solid ${({ theme }) => theme.primary4};
    color: ${({ theme }) => theme.primary1};
    background-color: transparent;
    font-size: 16px;
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ padding }) => (padding ? padding : '10px')};

    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
        border: 1px solid ${({ theme }) => theme.primary3};
    }
    &:hover {
        border: 1px solid ${({ theme }) => theme.primary3};
    }
   
    &:disabled {
        opacity: 50%;
        cursor: auto;
        background: #161a23;
        border: 1px solid #454959;
        color: #454959;
    }
    a:hover {
        text-decoration: none;
    }
`

export const ButtonPink = styled(Base)`
    background-color: ${({ theme }) => theme.primary1};
    color: white;

    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
        background-color: ${({ theme }) => darken(0.05, theme.primary1)};
    }
    &:hover {
        background-color: ${({ theme }) => darken(0.05, theme.primary1)};
    }
  
    &:disabled {
        opacity: 50%;
        cursor: auto;
        background: #161a23;
        border: 1px solid #454959;
        color: #454959;
    }
`

export const ButtonUNIGradient = styled(ButtonPrimary)`
    color: white;
    padding: 4px 8px;
    height: 36px;
    font-weight: 500;
    background-color: ${({ theme }) => theme.bg3};
    background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #0094ec 100%), #edeef2;
    width: fit-content;
    position: relative;
    cursor: pointer;
    border: none;
    white-space: no-wrap;
    :hover {
        opacity: 0.8;
    }
    :active {
        opacity: 0.9;
    }
`

export const ButtonOutlined = styled(Base)`
    border: 1px solid ${({ theme }) => theme.bg2};
    background-color: transparent;
    color: ${({ theme }) => theme.text1};
    border-radius: 1rem;
    &:focus {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    }
    &:hover {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    }
    &:active {
        background-color: transparent
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
        background: #161a23;
        border: 1px solid #454959;
        color: #454959;
    }
`

export const ButtonEmpty = styled(Base)`
    background-color: transparent;
    color: ${({ theme }) => theme.primary1};
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        text-decoration: none;
    }
    &:active {
        text-decoration: none;
        background: transparent !important
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
        background: #161a23;
        border: 1px solid #454959;
        color: #454959;
    }
`

export const ButtonWhite = styled(Base)`
    border: 1px solid #edeef2;
    background-color: ${({ theme }) => theme.bg1};
    color: black;

    &:focus {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
    }
    &:hover {
        box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
    }
    
    &:disabled {
        opacity: 50%;
        cursor: auto;
        background: #161a23;
        border: 1px solid #454959;
        color: #454959;
    }
`

const ButtonConfirmedStyle = styled(Base)`
    background-color: ${({ theme }) => lighten(0.5, theme.green1)};
    color: ${({ theme }) => theme.green1};
    border: 1px solid ${({ theme }) => theme.green1};
    padding: 0.8rem;
    &:disabled {
        opacity: 50%;
        cursor: auto;
        background: #161a23;
        border: 1px solid #454959;
        color: #454959;
    }
`

const ButtonErrorStyle = styled(Base)`
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};

    &:focus {
        background-color: ${({ theme }) => darken(0.05, theme.red1)};
    }
    &:hover {
        background-color: ${({ theme }) => darken(0.05, theme.red1)};
    }
    &:active {
        background-color: ${({ theme }) => darken(0.1, theme.red1)};
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
        box-shadow: none;
        background-color: ${({ theme }) => theme.red1};
        border: 1px solid #454959;
        color: #454959;    }
`

export function ButtonConfirmed({
    confirmed,
    altDisabledStyle,
    ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
    if (confirmed) {
        return <ButtonConfirmedStyle {...rest} />
    } else {
        return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
    }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
    if (error) {
        return <ButtonErrorStyle {...rest} />
    } else {
        return <ButtonPrimary {...rest} />
    }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
    return (
        <ButtonPrimary {...rest} disabled={disabled}>
            <RowBetween>
                <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
                <ChevronDown size={24} />
            </RowBetween>
        </ButtonPrimary>
    )
}

export function ButtonDropdownGrey({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
    return (
        <ButtonGray {...rest} disabled={disabled} style={{ borderRadius: '10px' }}>
            <RowBetween>
                <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
                <ChevronDown size={24} />
            </RowBetween>
        </ButtonGray>
    )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
    return (
        <ButtonOutlined {...rest} disabled={disabled} className="outline_button">
            <RowBetween>
                <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
                <ChevronDown size={24} />
            </RowBetween>
        </ButtonOutlined>
    )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
    if (!active) {
        return <ButtonWhite {...rest} />
    } else {
        return <ButtonPrimary {...rest} />
    }
}
