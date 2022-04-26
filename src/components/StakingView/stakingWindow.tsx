import { Events } from 'constants/map'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
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

        transform: unset !important;
        left: unset;
        top: unset;

        margin-top: 80px;
    }

    @media (min-width: 992px) and (max-height: 850px) {
        transform: translateX(-50%);
        margin: 70px 0;
        top: unset;
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
        // max-height: calc(100vh - 145px);
        // overflow: auto;
    }

    @media( max-width: 768px ) {
        padding: 1rem;
    }
`

export const StakingWindow = () => {
    const [ tokenType, setTokenType ] = useState('leash')
    const { currentStage } = useShiberseLandAuction({})

    return (
        <Wrapper>
            { currentStage === Events['Public'] ? (
                <StakeContent className='my-10'>
                    <p style={{ lineHeight: '40px', fontSize : '40px',fontWeight : 'bold' }} className='text-center mb-16' >
                        PUBLIC SALE IS NOW LIVE
                    </p>

                    <p style={{lineHeight: '19.2px'}} className='text-justify'>
                        During this final stage, users will be able to purchase the remaining lands without any restrictions, locking time, or any determined factor. You do not need to use the LEASH or SHIBOSHI Locker, and will not need to hold any of the Shiba ecosystem tokens to be able to acquire a land plot.
                    </p>
                </StakeContent>
            ) : (
                <StakeContent>
                    <StakeHeader className='w-full relative flex justify-between items-center'>
                        <div className={`text-center px-2 ${ tokenType === 'leash' ? 'active' : '' }`} onClick={() => setTokenType( 'leash' )}> { 'Leash Locker' } </div>
                        <div className={`text-center px-2 ${ tokenType === 'shiboshi' ? 'active' : '' }`} onClick={() => setTokenType( 'shiboshi' )}> { 'SHIBOSHIS LOCKER' } </div>
                        <div className='text-center px-2'> <a target='_blank' rel="noreferrer" href='https://shibaswap.com/#/swap?outputCurrency=0x27C70Cd1946795B66be9d954418546998b546634&inputCurrency=ETH'>{ 'BUY LEASH' }</a> </div>
                    </StakeHeader>

                    <p style={{ lineHeight: '19.2px' }} className='text-justify'>
                        { tokenType === 'leash' 
                            ? <>Welcome to the LEASH LOCKER feature! Use the scroll bar in order to set and lock your $LEASH, and gain access to the map. This easy-to-use tool allows early entry for you to bid, and purchase plots of land, during the first two stages of this first phase release: BID Event, and HOLDER Event.</> 
                            : <>Welcome to the SHIBOSHI LOCKER feature! Use the scroll bar in order to set and lock your SHIBOSHI NFT, and gain access to the map. This easy-to-use tool allows early entry for you to bid, and purchase plots of land, during the first two stages of this first phase release: BID Event, and HOLDER Event.</>
                        }

                    </p>

                    <div style={{ display: tokenType === 'leash' ? 'block' : 'none' }}>
                        <StakeLeash />
                    </div>

                    <div style={{ display: tokenType === 'shiboshi' ? 'block' : 'none' }}>
                        <StakeShiboshi />
                    </div>
                </StakeContent>
            ) }
        </Wrapper>
    )
}

export default StakingWindow