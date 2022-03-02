import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Popover, { PopoverProps } from '../Popover'

const TooltipContainer = styled.div`
    width: 228px;
    padding: 0.6rem 1rem;
    line-height: 150%;
    font-weight: 500;
    border: 1px solid #e4e4e4;
    border-radius: 0.625rem !important;
`

interface TooltipProps extends Omit<PopoverProps, 'content'> {
    text: string
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
    return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
    const [show, setShow] = useState(false)
    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])
    return (
        <Tooltip {...rest} show={show}>
            <div onMouseEnter={open} onMouseLeave={close}>
                {children}
            </div>
        </Tooltip>
    )
}
