import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
        
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
    const lastTrade = useLastTruthy(trade)

    return (
        <AdvancedDetailsFooter show={Boolean(trade)} className="view_analytic">
            <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
        </AdvancedDetailsFooter>
    )
}
