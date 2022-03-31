import { useWindowSize } from 'hooks/useWindowSize'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import StakeLeash from './stakeLeash'
import StakeShiboshi from './stakeShiboshi'

const Wrapper = styled.div`
    width: 630px;
    position: relative;
    transform: translate3d(-50%, -50%, 0);
    left: 70%;
    top: 50%;
    background: rgba(0, 0, 0, 0.6);

    border: 2px solid ${({ theme }) => theme.brown2};
    box-sizing: border-box;
    backdrop-filter: blur(20px);
    border-radius: 32px;
    overflow: hidden;

    @media (max-width: 1200px) {
        left: 60%;
    }

    @media (max-width: 992px) {
        left: 50%;
        .rangeBar {
            width: 100% !important;
        }

        width: 95%;
        margin-left: 2.5%;

        transform: unset;
        left: unset;
        top: unset;

        margin-top: 80px;
    }
`

const StakeHeader = styled.div`
    color: white;
    background: transparent;
    font-size: 18px;
    text-transform: uppercase;
    line-height: 27px;
    margin-bottom: 2rem;

    div {
        a {
            color: white;
            font-weight: 500;
        }

        &:hover, &.active {
            cursor: pointer;
            color: #F8A93E;
            font-weight: 700;
            text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000; -1px -1px 0 #000;

            a {
                color: #F8A93E;
                font-weight: 700;
            }
        }
    }

    @media( max-width: 576px ) {
        margin: 1rem 0;
    }
`

const StakeContent = styled.div`
    padding: 35px;

    @media ( min-width: 992px ) {
        max-height: calc(100vh - 145px);
        overflow: auto;
    }

    @media( max-width: 768px ) {
        padding: 1rem;
    }
`

const ReadMore = styled.a`
    :hover {
        cursor: pointer;
        color: #f9af4c;
    }
`

export const StakingWindow = () => {
    const [ tokenType, setTokenType ] = useState('leash')
    const [ showReadMore, setShowReadMore ] = useState(false)
    const [ collapsed, setCollapsed ] = useState(false)
    
    const { width, height } = useWindowSize()

    useEffect(() => {
        if( width && width >= 992 && height && height && height < 830 ) {
            setShowReadMore(true)
            setCollapsed(true)
        } else {
            setShowReadMore(false)
            setCollapsed(false)
        }
    }, [ width, height ])

    return (
        <Wrapper>
            <StakeContent>
                <StakeHeader className='w-full relative flex justify-between items-center'>
                    <div className={`text-center px-2 ${ tokenType === 'leash' ? 'active' : '' }`} onClick={() => setTokenType( 'leash' )}> { 'Leash Locker' } </div>
                    <div className={`text-center px-2 ${ tokenType === 'shiboshi' ? 'active' : '' }`} onClick={() => setTokenType( 'shiboshi' )}> { 'SHIBOSHIS LOCKER' } </div>
                    <div className='text-center px-2'> <a target='_blank' rel="noreferrer" href='https://shibaswap.com/#/swap?outputCurrency=0x27C70Cd1946795B66be9d954418546998b546634&inputCurrency=ETH'>{ 'BUY LEASH' }</a> </div>
                </StakeHeader>

                <p>
                    { collapsed ? ( 'When using the LEASH LOCKER feature, you will be... ' ) :
                        (<>When using the LEASH LOCKER feature, you will be converting your <b>$LEASH</b> to <b>yLEASH</b>. This mechanic will provide you the ability to gain early access to purchase lands.
                        <br/>
                        Please, select the amount to lock and the locking period.</>)
                    }

                    { showReadMore ? <ReadMore onClick={ () => setCollapsed(prev => !prev) }> { collapsed ? 'more' : 'less'} </ReadMore> : null }                    
                </p>

                <div style={{ display: tokenType === 'leash' ? 'block' : 'none' }}>
                    <StakeLeash />
                </div>

                <div style={{ display: tokenType === 'shiboshi' ? 'block' : 'none' }}>
                    <StakeShiboshi />
                </div>
            </StakeContent>
        </Wrapper>
    )
}

export default StakingWindow