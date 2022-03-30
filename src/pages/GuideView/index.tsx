import React from 'react'
import styled from 'styled-components'
import blurCircle from '../../assets/images/home/guide/blur1.svg';
import image1 from '../../assets/images/home/guide/1.png';
import image2 from '../../assets/images/home/guide/2.png';
import image3 from '../../assets/images/home/guide/3.png';
import { NormalButton } from 'theme';
import { NavLink } from 'components'

const GuideWrapper = styled.div`
    padding: 5% 0;
`

const BlurCircle = styled.img<{ position?: string }>`
    transform: translate3d(-50%, -50%, 0);
    left: ${({ position }) => (position === 'left' ? 25 : position === 'center' ? 50 : 50) }%;
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

const GuidSectionWrapper = styled.div`
    padding: 4% 10%;
    box-sizing: content-box;

    @media (max-width: 992px) {
        flex-wrap: wrap-reverse;
    }

    @media (max-width: 576px) {
        padding: 4% 1rem;
    }
`

const PictureWrapper = styled.div`
    width: 40%;

    img {
        width: 80%;
    }

    &:after {
        content: '';
        height: 80%; //You can change this if you want smaller/bigger borders
        width: 2px;
      
        position: absolute;
        right: 0;
        top: 10%; // If you want to set a smaller height and center it, change this value
      
        background-color: rgba(242, 137, 3, 0.5); // The color of your border
    }

    @media (max-width: 1200px) {
        img {
            width: 90%;
        }
    }

    @media (max-width: 992px) {
        width: 80%;
        left: 10%;
        margin-top: 3rem;
        justify-content: center;

        &:after {
            width: 0px;
        }
    }

    @media (max-width: 576px) {
        width: 100%;
        left: 0;
        margin-top: 1rem;

        img {
            width: 100%;
        }
    }
`

const DescWrapper = styled.div`
    width: 55%;

    @media (max-width: 992px) {
        width: 100%;
    }
`

const SectionImage = styled.img`
    width: 100%;
`

const SectionTitle = styled.p<{textSize?: string}>`
    font-size: ${({ textSize }) => ( textSize === 'big' ? 64 : 36 )}px;
    font-family: 'Passion One';
    line-height: 44px;
    margin-bottom: 1rem;
`

export const GuideSection = ({ image, title, content, blurPosition, textSize, hasLandsMapButton = false }: any) => {
    return (
        <GuidSectionWrapper className='flex justify-between items-start relative'>
            <BlurCircle src={ blurCircle } className='absolute' position={blurPosition}/>

            <PictureWrapper className='relative flex items-center'>
                <SectionImage src={image}></SectionImage>
            </PictureWrapper>

            <DescWrapper className='relative'>
                <SectionTitle textSize={textSize}>
                    { title }
                </SectionTitle>

                <div 
                    dangerouslySetInnerHTML={{
                        __html: content
                    }}>
                </div>
                
                {/* {
                    hasLandsMapButton ? <NormalButton className='m-0 mt-6'><NavLink exact strict to="/map">Enter the Lands Map</NavLink></NormalButton> : null
                } */}
            </DescWrapper>
        </GuidSectionWrapper>
    )
}

export const GuideView = () => {
    const contents = [{
        image: image1,
        title: '1. BID EVENT (72 HOURS)',
        content: `<p>This event is designed to provide an amazing opportunity to one of the most anticipated releases of the year for Shiba Inu Ecosystem. This exclusive event engages with those gaining early access while also being able to bid for their preferred set of lands, with a maximum of up to 200 lands. This is a unique chance to reserve the first batch of lands with priority over the rest of users, in order to mint them when the timer finalizes.<br/><br/>Bids can only last and serve the user for 72 hours, in which you will be able to gain a competitive edge by bidding, and outbidding this fun auction opportunity, and in order to gather lands successfully!<br/><br/>SHIB Metaverse has some high-profile areas that you don’t want to miss! If you want to collect a parcel into some of them we encourage you to lock your $LEASH, or your Shiboshis as soon as the event starts and by joining the interactive map!<br/><br/>As a reminder all land purchases are accomplished with ETH.</p>`
    }, {
        image: image2,
        title: '2. HOLDERS SALE (7 DAYS)',
        content: `<p>To acknowledge our amazing holders of $LEASH and SHIBOSHIS, who did not get to participate, or were not able to mint lands during the initial bidding event, don’t worry, we are bringing another opportunity to get lands!<br/><br/>$LEASH and SHIBOSHI holders will be able to purchase lands, without a bidding mechanic and normal purchase, during an additional 7 days right after the initial bidding event comes to an end.<br/><br/>Users will still be required to use the locking system provided in the initial bidding system to gain access to yLEASH as well as yShiboshi, which allows the lands map to unlock while providing a clear view of available parcels.<br/><br/>Holders will be able to reserve their selected lands and mint them as soon as the timer ends.</p>`
    }, {
        image: image3,
        title: '3. PUBLIC SALE',
        content: `<p>At the end of both the BID EVENT and HOLDER EVENT, the public sale for lands will begin. This means anyone and all users will be able to purchase the remaining lands without restrictions, locking time, or any determined factor..<br/><br/>You will not need to hold any of the Shiba ecosystem tokens to be able to acquire a parcel / land plot. As soon the early events end, users can mint their desired lands at a fixed price directly via the interactive map.</p>`,
        hasLandsMapButton: true,
    }]

    return (
        <GuideWrapper className='container relative'>
            {
                contents.map((item, index) => (
                    <GuideSection 
                        key={ `guidesection${index}` }
                        image={item.image}
                        title={item.title}
                        content={item.content}
                        blurPosition={ index % 2 === 0 ? 'left' : 'center' }
                        hasLandsMapButton={ item.hasLandsMapButton }
                    />
                ))
            }
        </GuideWrapper>
    )
}

export default GuideView