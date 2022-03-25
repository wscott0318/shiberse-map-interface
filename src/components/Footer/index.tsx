import React from 'react'
import styled from 'styled-components'
import footerDog from '../../assets/images/home/footer/character.png'
import discordIcon from '../../assets/images/home/footer/discord.svg'
import instagramIcon from '../../assets/images/home/footer/instagram.svg'
import mailIcon from '../../assets/images/home/footer/mail.svg'
import twitterIcon from '../../assets/images/home/footer/twitter.svg'
import blurCircle from '../../assets/images/home/guide/blur1.svg'

const FooterWrapper = styled.div`
    padding: 0;

    @media (max-width: 768px) {
        flex-wrap: wrap-reverse;
    }
`

const PictureWrapper = styled.div`
    width: 50%;

    @media (max-width: 576px) {
        width: 80%;
    }
`

const ContactWrapper = styled.div`
    width: 50%;

    @media (max-width: 768px) {
        width: 70%;
        text-align: center;
    }

    @media (max-width: 576px) {
        width: 100%;
    }
`

const ContactInnerWrapper = styled.div`
    width: 55%;

    @media (max-width: 1200px) {
        width: 80%;
    }

    @media (max-width: 992px) {
        width: 90%;
    }
`

const Icons = styled.div`
    padding: 1.5rem 0;

    a {
        width: 50px;
    }
`

const BlurCircle = styled.img`
    transform: translate3d(-50%, -50%, 0);
    left: 50%;
    top: 0;
    width: 100%;
    background: rgba(242, 137, 3, 0.5);
    filter: blur(444px);
    border-radius: 444px;

    @media (max-width: 992px) {
        width: 70%;
    }
`

export default function Footer(props: any) {
    return (
        <FooterWrapper className='container flex justify-center'>
            <PictureWrapper className='flex flex-col justify-end'>
                <img src={ footerDog }/>
            </PictureWrapper>

            <ContactWrapper className='flex justify-center items-center'>
                <ContactInnerWrapper className='flex flex-col relative'>
                    <BlurCircle src={ blurCircle } className='absolute'/>
                    
                    <p className='text-6xl mt-2 mb-2 font-passion-one'>SOCIAL</p>
                    <Icons className='flex justify-between items-center'>
                        <a href='#javascript;'><img src={ discordIcon }></img></a>
                        <a href='#javascript;'><img src={ twitterIcon }></img></a>
                        <a href='#javascript;'><img src={ instagramIcon }></img></a>
                        <a href='#javascript;'><img src={ mailIcon }></img></a>
                    </Icons>
                    <p className='text-base mt-2 mb-2'>
                        Builtin Apps are powered by <a>ShibaSwap</a>
                    </p>
                    <p className='text-base mt-2 mb-2'>Visit it clicking here!</p>
                </ContactInnerWrapper>
            </ContactWrapper>
        </FooterWrapper>   
    )
}
