import React from 'react'
import styled from 'styled-components'
import bgImage from '../../assets/images/home/bg.jpg'
import { transparentize } from 'polished'

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

const BackImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 0;
`

const BackVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 0;
`

const Wrapper = styled.div`
    position: absolute;
    transform: translate3d(-50%, -50%, 0);
    top: 50%;
    left: 50%;

    background: rgba(32, 31, 49, 0.9);
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
    width: 50vw;
    overflow-x: hidden;
    overflow-y: hidden;
    max-width: 600px;
    border-radius: 20px;
    border: 2px solid #B96A05;
    
    padding: 2rem;
    text-align: center;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
    `};
`

export const NotificationPage = ({ children } : any) => {
    return (
        <StakingWrapper>
            <BackImage src={bgImage}></BackImage>

            <BackVideo autoPlay loop muted>
                <source src='https://shiboshis.mypinata.cloud/ipfs/Qmd4Xw3tFcABkeHd7EkTztGPM8Enf9kVixATzxw9KS1peb' type="video/mp4"/>
            </BackVideo>

            <div className='container relative h-full'>
                <Wrapper>
                    { children }
                </Wrapper>
            </div>
        </StakingWrapper>
    )
}

export default NotificationPage