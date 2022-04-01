import React from 'react'
import styled from 'styled-components'
import { ExternalLink } from '../../theme'

const InfoCard = styled.button<{ active?: boolean }>`
    padding: 1rem;
    outline: none;
    border: 1px solid;
    border-radius: ${({ theme }) => theme.borderRadius};
    &:focus {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.primary1};
    }
    border-color: ${({ theme, active }) => (active ? 'transparent' : theme.bg3)};
`

const OptionCard = styled(InfoCard as any)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin: 1.5rem 0.5rem;
    padding: 1rem 2rem;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        margin: .5rem 0.25rem;
    `};
`

const OptionCardLeft = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap};
    justify-content: center;
    height: 100%;
    align-items: center;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
    background: #7858382b;
    &:hover {
        cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
        border: ${({ clickable, theme }) => (clickable ? `1px solid ${theme.primary1}` : ``)};
    }
    opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const GreenCircle = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    justify-content: center;
    align-items: center;

    &:first-child {
        height: 8px;
        width: 8px;
        margin-right: 8px;
        background-color: ${({ theme }) => theme.green1};
        border-radius: 50%;
    }
`

const CircleWrapper = styled.div`
    color: ${({ theme }) => theme.green1};
    display: flex;
    justify-content: center;
    align-items: center;
`

const HeaderText = styled.div`
    ${({ theme }) => theme.flexRowNoWrap};
    color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : ({ theme }) => theme.text1)};
    font-size: 1rem;
    font-weight: 500;
    margin-top: 1rem;
`

const SubHeader = styled.div`
    color: ${({ theme }) => theme.text1};
    margin-top: 10px;
    font-size: 12px;
`

const IconWrapper = styled.div<{ size?: number | null }>`
    ${({ theme }) => theme.flexColumnNoWrap};
    align-items: center;
    justify-content: center;
    & > img,
    span {
        height: ${({ size }) => (size ? size + 'px' : '100px')};
        width: ${({ size }) => (size ? size + 'px' : '100px')};
    }
    ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

export default function Option({
    link = null,
    clickable = true,
    size,
    onClick = null,
    color,
    header,
    subheader = null,
    icon,
    active = false,
    id
}: {
    link?: string | null
    clickable?: boolean
    size?: number | null
    onClick?: null | (() => void)
    color: string
    header: React.ReactNode
    subheader: React.ReactNode | null
    icon: string
    active?: boolean
    id: string
}) {
    const content = (
        <OptionCardClickable id={id} onClick={onClick} clickable={clickable && !active} active={active}>
            <IconWrapper size={size}>
                <img src={icon} alt={'Icon'} />
            </IconWrapper>
            <OptionCardLeft>
                <HeaderText color={color}>
                    {active ? (
                        <CircleWrapper>
                            <GreenCircle>
                                <div />
                            </GreenCircle>
                        </CircleWrapper>
                    ) : (
                        ''
                    )}
                    {header}
                </HeaderText>
                {subheader && <SubHeader>{subheader}</SubHeader>}
            </OptionCardLeft>
        </OptionCardClickable>
    )
    if (link) {
        return <ExternalLink href={link}>{content}</ExternalLink>
    }

    return content
}
