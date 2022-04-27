import React, { useEffect, useState } from 'react'
import Web3Status from '../Web3Status'
import { NavLink } from '../Link'
import { Disclosure } from '@headlessui/react'
import { MenuButton } from 'theme'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { Events, timerInfo } from 'constants/map'
import { isMobile } from 'react-device-detect'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'

const LogoText = styled.div`
    letter-spacing: 0.15em;

    .bullet {
        margin: 10px;
        width: 5px;
        height: 5px;
        border-radius: 20px;
        background: white;

        @media (max-width: 576px) {
            display: none;
        }
    }

    @media( max-width: 992px ) {
        margin-left: 1rem;
    }

    @media( max-width: 480px ) {
        margin-left: 5px !important;
    }
`

const SubLogoText = styled.span`
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: normal;

    @media (max-width: 576px) {
        display: none;
    }
`

const TimerWrapper = styled.div`
    background: linear-gradient(270deg, rgba(31, 31, 50, 0.4) 0%, rgba(31, 32, 49, 0.4) 34.37%);
    border: 2px solid #FFFFFF;
    box-sizing: border-box;
    border-radius: 22px;

    font-size: 18px;
    line-height: 27px;
    color: white;
    padding: 0.3rem 1rem;
`

export default function Header(): JSX.Element {
    const { account } = useActiveWeb3React()
    const [active, setActive] = useState('active')
    const [lastScroll, setLastScroll] = useState(0)
    const [currentTime, setCurrentTime] = useState({}) as any
    const [isFirst, setIsFirst] = useState(true)
    const [refreshInterval, setRefreshInterval] = useState() as any

    const { pathname } = useLocation()

    const { currentStage } = useShiberseLandAuction({})

    const isOnMapPage = () => pathname === '/map'

    const handleScroll = () => {
        if( window.scrollY <= lastScroll || window.scrollY <= 0 ) {
            setActive('active')
        } else {
            setActive('')
        }

        setLastScroll(window.scrollY)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })

    const handleTimeInterval = () => {
        getRemainingTime()
    }

    useEffect(() => {
        clearInterval(refreshInterval)
        const timeInterval = setInterval(handleTimeInterval, 500)
        setRefreshInterval(timeInterval)
    }, [currentStage])

    const getRemainingTime = () => {
        const info = {} as any

        let diffTime = (timerInfo[currentStage].endTime - new Date().getTime()) / 1000

        info.days = Math.floor( diffTime / (24 * 60 * 60) )
        diffTime = diffTime % (24 * 60 * 60)
        info.hours = Math.floor( diffTime / (60 * 60) )
        diffTime = diffTime % (60 * 60)
        info.minutes = Math.floor( diffTime / 60 )
        diffTime = diffTime % (60)
        info.seconds = Math.floor( diffTime )

        if( diffTime < 0 ) {
            info.days = 0
            info.hours = 0
            info.minutes = 0
            info.seconds = 0
        }

        setCurrentTime(info)
    }

    return (
        <Disclosure as="nav" className={`w-screen z-50 header-wrapper ${ active }`}>
            <div style={{padding: "0.5rem",background: "transparent", border:"none"}} className="header container relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0 nav-left-bar mx-1">
                            <LogoText className='flex items-center justify-center text-2xl font-extrabold ml-8'>
                                SHIB <span className='bullet'></span> <SubLogoText>The Metaverse</SubLogoText>
                            </LogoText>
                        </NavLink>
                    </div>

                    {/* { !isMobile && currentStage !== Events['Public'] ? (
                        <div>
                            <TimerWrapper>
                                <b>{ timerInfo[currentStage].desc }: </b> {`${currentTime.days} day${ currentTime.days > 1 ? 's' : '' }, ${currentTime.hours}h, ${currentTime.minutes}m, ${currentTime.seconds}s`}
                            </TimerWrapper>
                        </div>
                    ) : null } */}


                    <div className="flex items-center">
                        <NavLink exact strict to="/map" className={''}>
                            <MenuButton disabled={false} className={`font-bold ${ isOnMapPage() || !account ? 'hidden' : '' }`}>
                                <span className='full'>
                                    { 'Enter the Lands Map' }
                                </span>
                                <span className='shorten'>
                                    { 'M' }
                                </span>
                            </MenuButton>
                        </NavLink>

                        <Web3Status />
                    </div>
                </div>
            </div>
        </Disclosure>
    )
}