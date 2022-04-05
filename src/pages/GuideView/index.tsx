import React from 'react'
import styled from 'styled-components'
import blurCircle from '../../assets/images/home/guide/blur1.svg';
import image1 from '../../assets/images/home/guide/1.png';
import image2 from '../../assets/images/home/guide/2.png';
import image3 from '../../assets/images/home/guide/3.png';
import { NormalButton } from 'theme';
import { NavLink } from 'components'
import { useActiveWeb3React } from 'hooks';

const GuideWrapper = styled.div`
    padding: 8% 0;
    padding-bottom: 0%;
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
        width: 90%;
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

const Title = styled.div`
    font-size: 64px !important;
    font-family: 'Passion One';
    padding: 0 10%;
    padding-left: 46%;
    line-height: 60px;

    @media( max-width: 992px ) {
        padding: 4% 10%;
    }

    @media( max-width: 576px ) {
        padding: 4% 1rem;
    }
`

export const GuideSection = ({ image, title, content, blurPosition, textSize, hasLandsMapButton = false }: any) => {
    const { account } = useActiveWeb3React()

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
                    className='text-justify'
                    dangerouslySetInnerHTML={{
                        __html: content
                    }}>
                </div>
                
                {
                    hasLandsMapButton && account ? <NormalButton className='m-0 mt-6'><NavLink exact strict to="/map">Enter the Lands Map</NavLink></NormalButton> : null
                }
            </DescWrapper>
        </GuidSectionWrapper>
    )
}

export const GuideView = () => {
    const contents = [{
        image: image1,
        title: '1. BID EVENT (72 HOURS)',
        content: `<p>The BID event is designed to provide an amazing early access opportunity to one of Shiba Inu’s most anticipated releases, SHIB : The Metaverse.<br/><br/>This exclusive first event will allow participants to endure a thrilling three days (72 hours) race of bidding for their preferred plots of land. This is a unique, and exclusive chance to reserve the very first batch of lands with priority over the rest of users!<br/><br/>Bids will only last and serve each user for 72 hours, in which many will be able to gain a competitive edge by bidding, and outbidding in this fun auction-style opportunity!<br/><br/>SHIB Metaverse has some incredible high-profile areas that you don’t want to miss! We encourage you to lock your $LEASH, or your Shiboshis as soon as the event starts and in order to join the interactive map!<br/><br/>As a reminder all land purchases are accomplished with ETH, and you will not be able to participate on this event unless you have locked $LEASH or your Shiboshis.</p>`
    }, {
        image: image2,
        title: '2. HOLDERS EVENT (7 DAYS)',
        content: `<p>To continue the excitement, we are happy to bring another great opportunity for our amazing holders of $LEASH and SHIBOSHIS, who did not get to participate, and/or were not able to mint lands during the initial bidding event. We labelled this stage as the HOLDERS EVENT.<br/><br/>During this stage, $LEASH and SHIBOSHI holders will be able to purchase lands, without a bidding mechanic and at the fixed price for each Tier of lands. The event will last 7 days, and will become available right after the initial bidding event comes to an end.<br/><br/>Users will still be required to use the locking system provided in the initial bidding system to gain access to the interactive-map. Users will be able to purchase their selected lands, and mint them as soon as the timer ends.<br/><br/>All land purchases are accomplished with ETH.</p>`
    }, {
        image: image3,
        title: '3. PUBLIC SALE (OPEN FOR ALL)',
        content: `<p>At the end of both the BID EVENT and HOLDER EVENT, the final stage of the first phase for lands will begin, by welcoming the Public Sale. This is the last chance, and final stage in order for users to get in the action while securing their plots of land.<br/><br/>During this final stage, users will be able to purchase the remaining lands without any restrictions, locking time, or any determined factor. You do not need to use the LEASH or SHIBOSHI Locker, and will not need to hold any of the Shiba ecosystem tokens to be able to acquire a land plot.<br/><br/>Users can mint their desired lands at the fixed price, and directly via the interactive map broadcasting available plots remaining.</p>`,
        hasLandsMapButton: true,
    }]

    return (
        <GuideWrapper className='container relative'>
            <Title>SALES EVENT</Title>

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