import { NavLink } from 'components/Link'
import { useActiveWeb3React } from 'hooks'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { GradientButton } from 'theme'
import menuIcon from '../../assets/images/menu.svg'

const ProfileButton = styled( GradientButton as any )`
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 !important;
    font-size: 23px;
`

const ProfileButtonWrapper = styled.div`
`

const ProfileMenuDiv = styled.div`
    position: absolute;
    right: 0;
    top: 60px;
    width: 182px;
    padding: .5rem 1rem;
    background: #201F31;
    border-radius: 0px 0px 8px 8px;
    transition: all .1s;
    opacity: 0;
    display: none;

    &.active {
        display: block;
        opacity: 1;
    }

    @media( max-width: 974px ) {
        top: 52px;
    }
`

const ProfileMenuButton = styled.div`
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    padding: .5rem;
    color: white;
    display: flex;
    align-items: center;

    svg {
        fill: white;
    }

    a {
        color: white;
    }

    &:hover {
        cursor: pointer;
        color: #FFD59D;

        svg {
            fill: #FFD59D;
        }

        a {
            color: #FFD59D;
        }
    }
`

const MenuIcon = styled.img`
    width: 24px;
    pointer-events: none;
`

export default function ProfileMenu() {
    const { deactivate } = useActiveWeb3React()

    const [show, setShow] = useState(false)

    const detectTarget = (event : any) => {
        if( !event.target.matches('#profileMenuBtn') ) {
            setShow(false)
        }
    }

    useEffect(() => {
        window.addEventListener('click', detectTarget)

        return () => {
            window.removeEventListener('click', detectTarget)
        }
    })

    return (
        <ProfileButtonWrapper>
            <ProfileButton id='profileMenuBtn' onClick={ () => setShow(prev => !prev) }>
                <MenuIcon src={ menuIcon } />
            </ProfileButton>

            <ProfileMenuDiv className={`profileMenu ${ show ? 'active' : '' }`}>
                <NavLink exact strict to="/profile" className={''}>
                    <ProfileMenuButton className='font-bold'>
                        Profile
                    </ProfileMenuButton>
                </NavLink>
                <ProfileMenuButton 
                    onClick={() => {
                        deactivate()
                    }}>
                    <svg className='mr-2' width="18" height="16" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 2C3.26522 2 3.51957 1.89464 3.70711 1.70711C3.89464 1.51957 4 1.26522 4 1C4 0.734784 3.89464 0.48043 3.70711 0.292893C3.51957 0.105357 3.26522 0 3 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H3C3.26522 16 3.51957 15.8946 3.70711 15.7071C3.89464 15.5196 4 15.2652 4 15C4 14.7348 3.89464 14.4804 3.70711 14.2929C3.51957 14.1054 3.26522 14 3 14H2V2H3ZM16.82 7.42L14 3.42C13.8471 3.20441 13.615 3.05814 13.3545 3.01317C13.0941 2.9682 12.8264 3.02818 12.61 3.18C12.5018 3.25579 12.4098 3.35224 12.3391 3.46381C12.2684 3.57537 12.2206 3.69982 12.1982 3.82998C12.1759 3.96015 12.1796 4.09344 12.2091 4.22217C12.2386 4.3509 12.2933 4.47252 12.37 4.58L14.09 7H6C5.73478 7 5.48043 7.10536 5.29289 7.29289C5.10536 7.48043 5 7.73478 5 8C5 8.26522 5.10536 8.51957 5.29289 8.70711C5.48043 8.89464 5.73478 9 6 9H14L12.2 11.4C12.1212 11.5051 12.0639 11.6246 12.0313 11.7518C11.9987 11.879 11.9915 12.0114 12.01 12.1414C12.0286 12.2714 12.0726 12.3965 12.1395 12.5095C12.2064 12.6225 12.2949 12.7212 12.4 12.8C12.5731 12.9298 12.7836 13 13 13C13.1552 13 13.3084 12.9639 13.4472 12.8944C13.5861 12.825 13.7069 12.7242 13.8 12.6L16.8 8.6C16.9281 8.43087 16.999 8.22539 17.0026 8.01326C17.0062 7.80114 16.9423 7.59338 16.82 7.42Z"/>
                    </svg>
                    Disconnect
                </ProfileMenuButton>
            </ProfileMenuDiv>
        </ProfileButtonWrapper>
    )
}