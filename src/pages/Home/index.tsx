import React from 'react'
import { AutoColumn } from '../../components/Column'
import { Card } from './Card'
import { Div } from './Card'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import DigImage from '../../assets/images/home/dig_icon.svg'
import FecthImage from '../../assets/images/home/fetchicon.svg'
import SwapImage from '../../assets/images/home/swap_icon.svg'
import BuryImage from '../../assets/images/home/bury_icon.svg'
import BonfolioImage from '../../assets/images/home/bonefolio_icon.svg'
import YieldImage from '../../assets/images/home/yield_icon.svg'
import { Helmet } from 'react-helmet'

const PageWrapper = styled(AutoColumn)`
    max-width: 100%;
    width: 100%;
    justify-items: flex-start;
    height: 100%;
`

const Col = styled.div<{ size: any }>`
    justify-content: flex-start;
    flex: ${props => props.size};
`
const CardWrapper = styled.div`
    width: 100%;
    height: 16rem;
    background-color: #141824;
    box-shadow: 0 0 12px 6px rgba(0, 0, 0, 0.45);
    border-radius: 1.25rem;
    position: relative;
    :hover {
        box-shadow: 0 0 12px 6px rgba(0, 0, 0, 0.45);
        background-color: #262936;
    }
`
const CardHeader = styled.header`
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
`
export const CardHeading = styled.h1`
    font-size: 1.8rem;
    text-align: left;
    font-weight: bold;
    color: #d5d5d5;
    margin: 0;
    line-height: 1.5rem;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
`

export const CardsubTitle = styled.p`
    font-size: 15px;
    text-align: left;
    color: #d5d5d5;
    margin: 0;
    font-family: 'Heebo', sans-serif !important;
    font-weight: 800;
`

const CardDesc = styled.p`
    font-size: 15px;
    text-align: left;
    font-weight: 600;
    color: #d5d5d5;
    margin: 0;
    margin-top: 1.4rem;
    margin-bottom: 5rem;
    font-family: 'Heebo', sans-serif !important;
    font-weight: 800;
`
const Button = styled.a<{ disabled: boolean }>`
    background-color: #383648;
    border-radius: 2rem;
    color: #fea31c;
    font-size: 18px;
    font-weight: 600;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    text-align: center;
    padding: 0.5rem 1.75rem;
    line-height: normal;
    position: absolute;
    bottom: 0.6rem;
    font-size: 11pt;
    width: 200px;
    height: 40px;
    ${props =>
        props.disabled &&
        `
      pointer-events: none;
      color: #939395;
  `}
`
export const Row = styled.div`
    display: flex;
    margin: 0;
    width: 100%;
    justify-content: space-between;
`

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 0.3rem;
`

export const ImageDiv = styled.div`
    box-shadow: inset 0 0 9px rgba(13, 13, 13, 0.8);
    border-radius: 10px;
    padding: 0.5rem;
    background: transparent;
`

const Image = styled.img``
export default function Home() {
    return (
        <PageWrapper gap="lg" justify="center">
            <Helmet>
                <title>HOME | ShibaSwap</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="container my-auto home-container">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card_styles">
                            <CardWrapper>
                                <CardHeader>
                                    <Row>
                                        <Column>
                                            <CardHeading>DIG</CardHeading>
                                        </Column>
                                        <Column className="absolute top-4 right-2">
                                            <ImageDiv>
                                                <img height={40} width={40} src={DigImage} />
                                            </ImageDiv>
                                        </Column>
                                    </Row>
                                    <CardsubTitle className="sub_title">
                                        There are tons of BONES under the ground
                                    </CardsubTitle>
                                    <CardDesc>
                                        Provide <span className="home_bold_title">Liquidity</span> to earn BONE.
                                    </CardDesc>
                                    <Div url="/pool" buttonText="Provide Liquidity" disabled={false} />
                                </CardHeader>
                            </CardWrapper>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card_styles">
                            <CardWrapper>
                                <CardHeader>
                                    <Row>
                                        <Column>
                                            <CardHeading>NFTS</CardHeading>
                                        </Column>
                                        <Column className="absolute top-4 right-2">
                                            <ImageDiv>
                                                <img height={40} width={40} src={FecthImage} />
                                            </ImageDiv>
                                        </Column>
                                    </Row>
                                    <CardsubTitle className="sub_title mr-6 pr-5">
                                        Buy, Sell and Trade 10,000 unique Shiboshis.
                                    </CardsubTitle>
                                    <CardDesc>
                                        Unique and only available on <span className="home_bold_title">ShibaSwap</span>.
                                        You do not want to miss this unique NFT drop!{' '}
                                    </CardDesc>
                                    <Div
                                        url="https://shiboshis.shibaswap.com/"
                                        buttonText="More info"
                                        disabled={false}
                                    />
                                </CardHeader>
                            </CardWrapper>
                            {/* <Card
                            name="FETCH"
                            url="/fetch"
                            subTitle="Retrieve UNI-V2-LP or SLP for our event"
                            desc="For two weeks bring designated Liquidity Tokens from Uniswap or Sushiswap to get bonus Bone tokens."
                            buttonText="Fetch"
                            disabled={false}
                            icon="/images/home/fetchicon.svg"
                        /> */}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card_styles">
                            <CardWrapper>
                                <CardHeader>
                                    <Row>
                                        <Column>
                                            <CardHeading>BURY</CardHeading>
                                        </Column>
                                        <Column className="absolute top-4 right-2">
                                            <ImageDiv>
                                                <img height={40} width={40} src={BuryImage} />
                                            </ImageDiv>
                                        </Column>
                                    </Row>
                                    <CardsubTitle className="sub_title">
                                        Shibas love to bury what they find
                                    </CardsubTitle>
                                    <CardDesc>
                                        <span className="home_bold_title">Stake</span> your tokens to gain returns.{' '}
                                    </CardDesc>
                                    <Div url="/bury" buttonText="Stake Tokens" disabled={false} />
                                </CardHeader>
                            </CardWrapper>
                            {/* <Card
                            name="BURY"
                            url="/bury"
                            subTitle="Shibas love to bury what they have found"
                            desc="Stake tokens to gain returns."
                            buttonText="Stake Tokens"
                            disabled={false}
                            icon="/images/home/bury_icon.svg"
                        /> */}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card_styles">
                            <CardWrapper>
                                <CardHeader>
                                    <Row>
                                        <Column>
                                            <CardHeading>SWAP</CardHeading>
                                        </Column>
                                        <Column className="absolute top-4 right-2">
                                            <ImageDiv>
                                                <img height={40} width={40} src={SwapImage} />
                                            </ImageDiv>
                                        </Column>
                                    </Row>
                                    <CardsubTitle className="sub_title">
                                        Tell your Shiba Inu to fetch new tokens
                                    </CardsubTitle>
                                    <CardDesc>
                                        <span className="home_bold_title">Swap</span> your tokens for other tokens.
                                    </CardDesc>
                                    <Div url="/swap" buttonText="Swap Tokens" disabled={false} />
                                </CardHeader>
                            </CardWrapper>
                            {/* <Card
                            name="SWAP"
                            url="/swap"
                            subTitle="Tell your Shiba Inu to fetch new tokens"
                            desc="Swap your tokens for other tokens."
                            buttonText="Swap"
                            disabled={false}
                            icon="/images/home/swap_icon.svg"
                        /> */}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card_styles">
                            <CardWrapper>
                                <CardHeader>
                                    <Row>
                                        <Column>
                                            <CardHeading>DOGGY DAO</CardHeading>
                                        </Column>
                                        <Column className="absolute top-4 right-2">
                                            <ImageDiv>
                                                <img height={40} width={40} src={BonfolioImage} />
                                            </ImageDiv>
                                        </Column>
                                    </Row>
                                    <CardsubTitle className="sub_title">
                                        Vote on your favorite pair to receive BONE
                                    </CardsubTitle>
                                    <CardDesc>
                                        Vote with <span className="home_bold_title">tBONE</span>
                                    </CardDesc>
                                    <Div url="/proposal" buttonText="Pair Voting" disabled={false} />
                                </CardHeader>
                            </CardWrapper>
                            {/* <Card
                            name="BONEFOLIO"
                            url="/bonefolio"
                            subTitle="Every Shiba Inu needs to check their stash"
                            desc="Check your dogalytics, Bonefolio and set alerts."
                            buttonText="Check your portfolio"
                            disabled={false}
                            icon="/images/home/bonefolio_icon.svg"
                        /> */}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card_styles">
                            <CardWrapper>
                                <CardHeader>
                                    <Row>
                                        <Column>
                                            <CardHeading>WOOF</CardHeading>
                                        </Column>
                                        <Column className="absolute top-4 right-2">
                                            <ImageDiv>
                                                <img height={40} width={40} src={YieldImage} />
                                            </ImageDiv>
                                        </Column>
                                    </Row>
                                    <CardsubTitle className="sub_title">Woof your returns</CardsubTitle>
                                    <CardDesc>
                                        Stake SSLP & <span className="home_bold_title">Claim Returns.</span>
                                    </CardDesc>
                                    <Div url="/yield" buttonText="Farm Tokens!" disabled={false} />
                                </CardHeader>
                            </CardWrapper>

                            {/* <Card
                            name="YIELD"
                            url="/yield"
                            subTitle="Claim your returns"
                            desc="Stake SSLP & Claim Returns"
                            buttonText="Returns"
                            disabled={false}
                            icon="/images/home/yield_icon.svg"
                        /> */}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
