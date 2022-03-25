import React from 'react'

import { useTranslation } from 'react-i18next'
import { GradientButton } from 'theme'
import styled from 'styled-components'
import StakingWindow from './stakingWindow'
import bgImage from '../../assets/images/home/bg.jpg'
import bgVideo from '../../assets/images/home/Shiba New Version.mp4'
import discordIcon from '../../assets/images/home/discord.svg'

const StakingWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;

    @media (max-width: 992px) {
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
    const { t } = useTranslation()

    return (
        <StakingWrapper>
            <BackImage src={bgImage}></BackImage>

            <BackVideo autoPlay loop muted>
                <source src={bgVideo} type="video/mp4"/>
            </BackVideo>

            <div className='container relative h-full'>
                <StakingWindow />

                <DiscordBtnWrapper>
                    <GradientButton className='flex justify-center items-center'>
                        { t('Join our Discord') }
                        <img src={discordIcon} width={25} className='ml-2'></img>
                    </GradientButton>
                </DiscordBtnWrapper>
            </div>
        </StakingWrapper>
    )
}

export default StakingView