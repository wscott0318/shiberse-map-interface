import RangeInput from 'components/RangeInput'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PrimaryButton } from 'theme'

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
`

const StakeContent = styled.div`
    padding: 35px;

    @media ( min-width: 992px ) {
        max-height: calc(100vh - 280px);
        overflow: auto;
    }

    @media( max-width: 768px ) {
        padding: 1rem;
    }
`

const ProgressCaption = styled.div`
    font-weight: 600;
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 10px;

    span {
        color: ${({theme}) => theme.brown1};
    }
`

const Parameters = styled.span`
    background: #201F31;
    border-radius: 100px;
    font-size: 18px;
    padding: 10px 20px;
    border: 1px solid #BE6D06;
`

export const StakingWindow = () => {
    const { t } = useTranslation()
    const [ lockAmount, setLockAmount ] = useState(5)
    const [ lockPeriod, setLockPeriod ] = useState(68)
    const [ tokenType, setTokenType ] = useState('leash')

    return (
        <Wrapper>
            <StakeContent>
                <StakeHeader className='w-full relative flex justify-around items-center'>
                    <div className={`text-center px-2 ${ tokenType === 'leash' ? 'active' : '' }`} onClick={() => setTokenType( 'leash' )}> { t('Leash Locker') } </div>
                    <div className={`text-center px-2 ${ tokenType === 'shiboshis' ? 'active' : '' }`} onClick={() => setTokenType( 'shiboshis' )}> { t('SHIBOSHIS LOCKER') } </div>
                    <div className='text-center px-2'> <a target='_blank' rel="noreferrer" href='https://shibaswap.com/#/swap?outputCurrency=0x27C70Cd1946795B66be9d954418546998b546634&inputCurrency=ETH'>{ t('BUY LEASH') }</a> </div>
                </StakeHeader>

                <p>
                    When using the LEASH LOCKER feature, you will be converting your <b>$LEASH</b> to <b>yLEASH</b>. This mechanic will provide you the ability to gain early access to purchase lands.
                    <br/>
                    Please, select the amount to lock and the locking period.
                </p>

                <div className='w-10/12 rangeBar'>
                    <ProgressCaption>
                        { t('Amount to lock') }:
                        <span> { t(`${ lockAmount } ${ tokenType }`) } </span>
                    </ProgressCaption>

                    <RangeInput 
                        min={ 0.2 }
                        max={ 5 }
                        value={ [ lockAmount ] }
                        setValue={ setLockAmount }
                        step={ 0.1 }
                    />
                </div>

                <div className='w-10/12 rangeBar'>
                    <ProgressCaption>
                        { t('Locking period') }:
                        <span> { t(`${ lockPeriod } days`) } </span>
                    </ProgressCaption>

                    <RangeInput 
                        min={ 45 }
                        max={ 90 }
                        value={ [ lockPeriod ] }
                        setValue={ setLockPeriod }
                    />
                </div>

                <p className='mt-5 mb-3'>
                    { t(`These parameters give you access to bid/purchase`) }:
                </p>

                <div className='mt-6 mb-6'>
                    <Parameters>
                        { t('7 of max. 200 lands') }
                    </Parameters>
                </div>

                <div className='w-full flex flex-row-reverse'>
                    <PrimaryButton className='right-0'>
                        { t('LOCK') }
                    </PrimaryButton>
                </div>
            </StakeContent>
        </Wrapper>
    )
}

export default StakingWindow