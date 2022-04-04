import React from 'react'
import styled, { keyframes } from 'styled-components'
import loaderImg from 'assets/images/profile/loader.svg'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledImg = styled.img<{ size: string; }>`
    animation: 2s ${rotate} linear infinite;
    height: ${({ size }) => size};
    width: ${({ size }) => size};
`

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function ShiberseLoader({
    size = '16px',
    ...rest
}: {
    size?: string
    [k: string]: any
}) {
    return (
        <StyledImg 
            src={ loaderImg }
            size={size}
            {...rest}
            />
    )
}
