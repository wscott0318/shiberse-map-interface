import React from "react"
import styled from 'styled-components'
import Faq from "react-faq-component";
import thumbnail from '../../assets/images/home/faq.png'
import blurCircle from '../../assets/images/home/guide/blur1.svg'
import './faq.scss'

const Wrapper = styled.div`
    padding: 4% 10%;
    box-sizing: content-box;

    @media (max-width: 576px) {
        padding: 4% 1rem;
    }
`

const SectionTitle = styled.p`
    font-size: 64px !important;
    font-family: 'Passion One';
    line-height: 76.8px !important;
`

const SectionWrapper = styled.div`
    @media (max-width: 992px) {
        flex-wrap: wrap;
    }
`

const FaqWrapper = styled.div`
    width: 55%;

    @media (max-width: 992px) {
        width: 100%;
    }
`

const PictureWrapper = styled.div`
    width: 33%;

    @media (max-width: 1200px) {
        width: 45%;
    }

    @media (max-width: 992px) {
        width: 80%;
        left: 10%;
        margin-top: 3rem;
    }

    @media (max-width: 576px) {
        width: 90%;
        left: 5%;
        margin-top: 1rem;
    }
`

const SplitterWrapper = styled.div`
    position: relative;
    width: 12%;
    text-align: center;

    .splitter {
        width: 1px;
        height: 400px;
        background : #785838;
    }

    @media (max-width: 1200px) {
        width: 10%;
    }

    @media (max-width: 992px) {
        display: none !important;
    }
`

const BlurCircle = styled.img`
    transform: translate3d(-50%, -50%, 0);
    left: 0;
    top: 50%;
    width: 40%;
    background: rgba(242, 137, 3, 0.5);
    filter: blur(444px);
    border-radius: 444px;

    @media (max-width: 992px) {
        width: 70%;
    }
`

export const FaqComponent = ({ data, styles, config }: any) => {
    return (
        <Wrapper className="relative">
            <SectionTitle className="relative">
                FAQS
                <BlurCircle src={ blurCircle } className='absolute'/>
            </SectionTitle>

            <SectionWrapper className='flex justify-between items-center relative'>
                <FaqWrapper>
                    <Faq
                        data={ data }
                        styles={ styles }
                        config={ config }
                    />
                </FaqWrapper>

                <SplitterWrapper className='flex justify-center items-center relative'>
                    <div className='splitter' />
                </SplitterWrapper>

                <PictureWrapper className='relative flex items-center justify-center'>
                    <img src={thumbnail}></img>
                </PictureWrapper>
            </SectionWrapper>
        </Wrapper>
    )
}

export default FaqComponent