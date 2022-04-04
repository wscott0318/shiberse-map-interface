import useShiberseStakeNFT from 'hooks/useShiberseStakeNFT'
import useShiberseStakeToken from 'hooks/useShiberseStakeToken'
import React from 'react'
import Map from './index'

export const RedirectIfLockedToken = () => {
    const { stakedBalance: leashStakedBalance } = useShiberseStakeToken({ tokenType: 'leash' })
    const { stakedBalance: shiboshiStakedBalance } = useShiberseStakeNFT({ tokenType: 'shiboshi' })

    const canGoToMapPage = () => (Number(leashStakedBalance) > 0 || Number(shiboshiStakedBalance) > 0)

    return (
        <>
        { canGoToMapPage() ? <Map /> : null }
        </>
    )
}