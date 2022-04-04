import React from 'react'
import { GradientButton } from 'theme'
import styled from 'styled-components'
import StakingWindow from './stakingWindow'
import bgImage from '../../assets/images/home/bg.jpg'
import discordIcon from '../../assets/images/home/discord.svg'

const StakingWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;

    @media (max-width: 992px) {
        height: auto;
    }

    @media (min-width: 992px) and (max-height: 850px) {
        height: auto;
    }
`

const DiscordBtnWrapper = styled.a`
    position: absolute;
    bottom: 1rem;
    right: 1rem;

    @media (max-width: 992px) {
        position: relative;
        bottom: unset;
        right: unset;
        width: 100%;

        button {
            margin-top: 2rem;
            margin-bottom: 1rem;            
            transform: translateX(-50%);
            left: 50%;
        }
    }
`

const BackVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 0;
`

const BackImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 0;
`

export const StakingView = () => {
    return (
        <StakingWrapper>
            <BackImage src={bgImage}></BackImage>

            <BackVideo autoPlay loop muted>
                <source src='https://shiboshis.mypinata.cloud/ipfs/Qmd4Xw3tFcABkeHd7EkTztGPM8Enf9kVixATzxw9KS1peb' type="video/mp4"/>
            </BackVideo>

            <div className='container relative h-full'>
                <StakingWindow />

                <DiscordBtnWrapper href='https://discord.com/invite/shibatoken' target={'_blank'}>
                    <GradientButton className='flex justify-center items-center ml-0'>
                        { 'Join our Discord' }
                        <img src={discordIcon} width={25} className='ml-2'></img>
                    </GradientButton>
                </DiscordBtnWrapper>
            </div>
        </StakingWrapper>
    )
}

export default StakingView