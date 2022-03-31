import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Web3Status from '../Web3Status'
import { NavLink } from '../Link'
import { Disclosure } from '@headlessui/react'
import { MenuButton } from 'theme'
import styled from 'styled-components'

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

export default function Header(): JSX.Element {
    const [active, setActive] = useState('active')
    const [lastScroll, setLastScroll] = useState(0)

    const { t } = useTranslation()

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

                    <div className="flex items-center">
                        {/* <MenuButton disabled={false} className='font-bold'>
                            <NavLink exact strict to="/map" className={''}>
                                <span className='full'>
                                    { 'Enter the Lands Map' }
                                </span>
                                <span className='shorten'>
                                    { 'M' }
                                </span>
                            </NavLink>
                        </MenuButton> */}

                        <Web3Status />
                    </div>
                </div>
            </div>
        </Disclosure>
    )
}