import { darken } from 'polished'
import React, { HTMLProps, useCallback } from 'react'
import { ArrowLeft, ExternalLink as LinkIconFeather, Trash, X } from 'react-feather'
import ReactGA from 'react-ga'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

export const CloseIcon = styled(X)<{ onClick: () => void }>`
    cursor: pointer;
`

// for wrapper react feather icons
export const IconWrapper = styled.div<{ stroke?: string; size?: string; marginRight?: string; marginLeft?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ size }) => size ?? '20px'};
    height: ${({ size }) => size ?? '20px'};
    margin-right: ${({ marginRight }) => marginRight ?? 0};
    margin-left: ${({ marginLeft }) => marginLeft ?? 0};
    & > * {
        stroke: ${({ theme, stroke }) => stroke ?? theme.blue1};
    }
`

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
    border: none;
    text-decoration: none;
    background: none;

    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
    font-weight: 500;

    :hover {
        text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
    }

    :focus {
        outline: none;
        text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
    }

    :active {
        text-decoration: none;
    }
`

// An internal link from the react-router-dom library that is correctly styled
export const StyledInternalLink = styled(Link)`
    text-decoration: none;
    cursor: pointer;
    color: '#ffb73c';

    :hover {
        text-decoration: underline;
    }

    :focus {
        outline: none;
        text-decoration: underline;
    }

    :active {
        text-decoration: none;
    }
`

const StyledLink = styled.a`
    text-decoration: none;
    cursor: pointer;
    color: #0094ec;
    font-weight: 500;

    :hover {
        text-decoration: underline;
    }

    :focus {
        outline: none;
        text-decoration: underline;
    }

    :active {
        text-decoration: none;
    }
`

const LinkIconWrapper = styled.a`
    text-decoration: none;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;

    :hover {
        text-decoration: none;
        opacity: 0.7;
    }

    :focus {
        outline: none;
        text-decoration: none;
    }

    :active {
        text-decoration: none;
    }
`

export const LinkIcon = styled(LinkIconFeather)`
    height: 16px;
    width: 18px;
    margin-left: 10px;
    stroke: ${({ theme }) => theme.blue1};
`

export const TrashIcon = styled(Trash)`
    height: 16px;
    width: 18px;
    margin-left: 10px;
    stroke: ${({ theme }) => theme.text3};

    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;

    :hover {
        opacity: 0.7;
    }
`

const rotateImg = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`

export const UniTokenAnimated = styled.img`
    animation: ${rotateImg} 5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
    padding: 2rem 0 0 0;
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15));
`

/**
 * Outbound link that handles firing google analytics events
 */
export function ExternalLink({
    target = '_blank',
    href,
    rel = 'noopener noreferrer',
    ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            // don't prevent default, don't redirect if it's a new tab
            if (target === '_blank' || event.ctrlKey || event.metaKey) {
                ReactGA.outboundLink({ label: href }, () => {
                    console.debug('Fired outbound link event', href)
                })
            } else {
                event.preventDefault()
                // send a ReactGA event and then trigger a location change
                ReactGA.outboundLink({ label: href }, () => {
                    window.location.href = href
                })
            }
        },
        [href, target]
    )
    return <StyledLink target={target} rel={rel} href={href} onClick={handleClick} {...rest} />
}

export function ExternalLinkIcon({
    target = '_blank',
    href,
    rel = 'noopener noreferrer',
    ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            // don't prevent default, don't redirect if it's a new tab
            if (target === '_blank' || event.ctrlKey || event.metaKey) {
                ReactGA.outboundLink({ label: href }, () => {
                    console.debug('Fired outbound link event', href)
                })
            } else {
                event.preventDefault()
                // send a ReactGA event and then trigger a location change
                ReactGA.outboundLink({ label: href }, () => {
                    window.location.href = href
                })
            }
        },
        [href, target]
    )
    return (
        <LinkIconWrapper target={target} rel={rel} href={href} onClick={handleClick} {...rest}>
            <LinkIcon />
        </LinkIconWrapper>
    )
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.img`
    animation: 2s ${rotate} linear infinite;
    width: 16px;
    height: 16px;
`

export const CustomLightSpinner = styled(Spinner)<{ size: string }>`
    height: ${({ size }) => size};
    width: ${({ size }) => size};
`

export const MenuButton = styled.button<{ disabled?: boolean }>`
    font-size: 18px;
    line-height: 27px;
    font-family: Poppins;
    text-decoration: none;
    backdrop-filter: blur(40px);
    padding: 0.5rem 1.3rem;

    background: linear-gradient(270deg, rgba(31, 31, 50, 0.4) 0%, rgba(31, 32, 49, 0.4) 34.37%);
    border-radius: 50px;

    border: ${({theme, disabled}) => ( disabled ? 'none' : `2px solid ${ theme.brown2 }` )};
    opacity: ${({disabled}) => ( disabled ? '0.5' : '1')};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    color: ${({ theme }) => (theme.white)};
    font-weight: 500;
    margin: 0 1rem;

    a {
        color: white;
    }

    :hover {
        color: ${({ theme }) => (theme.brown1)};
        
        a {
            color: ${({ theme }) => (theme.brown1)};
        }
    }

    :focus {
        outline: none;
    }

    :active {
        text-decoration: none;
    }

    @media (max-width: 992px) {
        margin: 0 0.5rem;
    }

    @media (max-width: 768px) {
        width: 40px;
        height: 40px;
        padding: 0;
        margin: 0 0.25rem;
        font-size: 23px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 480px) {
        padding-right: 0;
    }
`

export const GradientButton = styled.button`
    font-size: 18px;
    line-height: 27px;
    font-family: Poppins;
    text-decoration: none;
    backdrop-filter: blur(40px);
    padding: 0.5rem 1.3rem;

    background: linear-gradient(270deg, rgba(31, 31, 50, 0.4) 0%, rgba(31, 32, 49, 0.4) 49.48%, rgba(120, 88, 56, 0.4) 100%);
    border-radius: 50px;

    border: ${({theme, disabled}) => ( `2px solid ${ theme.brown2 }` )};
    opacity: ${({disabled}) => ( disabled ? '0.5' : '1')};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    color: ${({ theme }) => (theme.white)};
    font-weight: 500;
    margin: 0 1rem;

    :hover {
        color: ${({ theme }) => (theme.brown1)};
    }

    :focus {
        outline: none;
    }

    :active {
        text-decoration: none;
    }

    :disabled {
        cursor: not-allowed;
        color: white;
        opacity: 0.5;
    }

    @media (max-width: 992px) {
        padding: 0.3rem 0.9rem;
        position: relative;
    }
`

export const PrimaryButton = styled.button`
    background: linear-gradient(90deg, #B96A05 7.81%, #F28903 100%);
    border-radius: 22px;
    color: white;

    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    letter-spacing: .1rem;

    padding: .8rem 2.5rem;

    transition: all .1s;
    &:hover {
        color: #72450b;
    }

    :disabled {
        background: linear-gradient(90deg,#6a4618 7.81%,#935b14 100%);
        color: #b9b9b9;
        cursor: not-allowed;
    }
`

export const NormalButton = styled( GradientButton as any )`
    background: linear-gradient(270deg, rgba(31, 32, 49, 0.4) 51.56%, rgba(31, 31, 50, 0.4) 100%);
    border-width: 1px;
`

export const ModalToggleButton = styled.button`
    font-weight: 600;
    font-size: 16px;
    line-height: 19.2px;
    color: white;
    font-style: normal;
    text-decoration-line: underline;
    text-shadow: 2px 3px 4px rgba(0, 0, 0, 0.7);

    :hover {
        cursor: pointer;
        color: #F8A93E;
    }

    :disabled {
        cursor: not-allowed;
        color: white;
        opacity: 0.5;
    }
`