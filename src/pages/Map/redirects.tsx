import { Events } from 'constants/map'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
import NotificationPage from 'pages/Notification'
import React from 'react'
import styled from 'styled-components'
import Map from './index'
import { NavLink } from '../../components/Link'
import useShiberseStakeToken from 'hooks/useShiberseStakeToken'
import useShiberseStakeNFT from 'hooks/useShiberseStakeNFT'

const HeaderText = styled.div`
    padding: 1rem 0;

    :hover {
        cursor: pointer;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        font-size: 1.5rem !important;
        line-height: 1.7rem !important;
        margin-top: 1rem;
    `};

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
        font-size: 1.3rem !important;
        line-height: 1.5rem !important;
        margin-top: 1rem;
    `};
`

const HeaderDescription = styled.div`
    padding: 1rem 0;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
    `};

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
        font-size: 0.9rem !important;
    `};
`

const Notification = () => {
    return (
        <NotificationPage>
            <>
                <HeaderText className='text-center text-3xl'>Lock Leash or Shiboshi!</HeaderText>
                <HeaderDescription className='text-center text-base'>In order to join the interactive map during the early access events, you must first Lock your <b>LEASH</b> or Lock your <b>SHIBOSHI</b> via the Locking System.</HeaderDescription>
                <HeaderDescription className='text-center text-base'>Click <NavLink exact strict to="/" className={'color-primary'}>here</NavLink> to go to <b>LOCK</b> Page.</HeaderDescription>
            </>
        </NotificationPage>
    )
}

export const RedirectIfLockedToken = (props: any) => {
    const { currentStage, isShiboshiHolder } = useShiberseLandAuction({})
    const { stakedBalance: leashStakedBalance } = useShiberseStakeToken({ tokenType: 'leash' })
    const { stakedBalance: shiboshiStakedBalance } = useShiberseStakeNFT({ tokenType: 'shiboshi' })

    const isShiberseLocker = (Number(leashStakedBalance) > 0 || Number(shiboshiStakedBalance) > 0)

    const canGoToMapPage = () => isShiberseLocker
                                    || currentStage === Events['Public'] 
                                    || isShiboshiHolder

    return (
        <>
            { canGoToMapPage() ? <Map /> : <Notification /> }
        </>
    )
}