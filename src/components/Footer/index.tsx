import React from 'react'
import styled from 'styled-components'
import footerDog from '../../assets/images/home/footer/character.png'
import discordIcon from '../../assets/images/home/footer/discord.svg'
import telegramIcon from '../../assets/images/home/footer/telegram.svg'
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
    z-index: -1;

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
                        <a href='https://discord.com/invite/shibatoken' target="blank"><img src={ discordIcon }></img></a>
                        <a href='https://twitter.com/shibtoken' target="blank"><img src={ twitterIcon }></img></a>
                        <a href='https://t.me/ShibaInu_Dogecoinkiller' target="blank"><img src={ telegramIcon }></img></a>
                        <a href='https://linktr.ee/OfficialShib' target="blank"><img src={ mailIcon }></img></a>
                    </Icons>
                    <p className='text-base mt-2 mb-2'>
                        Builtin Apps are powered by <a href='https://blog.shibaswap.com/' target="blank">ShibaSwap</a>
                    </p>
                    <p className='text-base mt-2 mb-2'>Visit it clicking <a href='https://shibaswap.com' target="blank">here</a>!</p>
                </ContactInnerWrapper>
            </ContactWrapper>
        </FooterWrapper>   
    )
}
