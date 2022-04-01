import React from "react"
import styled from 'styled-components'
import blurCircle from '../../assets/images/home/guide/blur1.svg'
import splitterline from '../../assets/images/home/splitterline.svg'

const BlurCircle = styled.img`
    transform: translate3d(-50%, -50%, 0);
    left: 50%;
    top: 50%;
    width: 40%;
    background: rgba(242, 137, 3, 0.5);
    filter: blur(444px);
    border-radius: 444px;
    z-index: -1;

    @media (max-width: 992px) {
        width: 70%;
    }
`

const SectionWrapper = styled.div`
    padding: 4% 10%;
    box-sizing: content-box;

    @media (max-width: 992px) {
        flex-wrap: wrap;
    }

    @media (max-width: 576px) {
        padding: 4% 1rem;
    }
`

const SplitterWrapper = styled.div`
    position: relative;
    width: 12%;
    text-align: center;

    .splitter {
        width: 2px;
        height: 200px;
        background : #785838;
    }

    @media (max-width: 1200px) {
        width: 10%;
    }

    @media (max-width: 992px) {
        display: none !important;
    }
`

const DescWrapper = styled.div`
    width: 100%;

    @media (max-width: 992px) {
        width: 100%;
    }
`

const SectionTitle = styled.p`
    font-size: 64px !important;
    font-family: 'Passion One';
    line-height: 76.8px !important;
`

const SplitterLine = styled.img`
    width: 250%;
    position: absolute;
    top: 0;
    right: 25%;
    max-width: unset;
`

export const ShiberseSection = ({ title, content }: any) => {
    return (
        <SectionWrapper className='flex justify-between items-start relative'>
            <BlurCircle src={ blurCircle } className='absolute'/>

            <DescWrapper className='relative'>
                <SectionTitle>
                    { title }
                </SectionTitle>

                <div 
                    className="text-justify"
                    dangerouslySetInnerHTML={{
                        __html: content
                    }}>
                </div>
            </DescWrapper>

            <SplitterWrapper className='flex justify-center items-center relative'>
                <div className='splitter' />
                <SplitterLine src={ splitterline } />
            </SplitterWrapper>
        </SectionWrapper>
    )
}

export default ShiberseSection