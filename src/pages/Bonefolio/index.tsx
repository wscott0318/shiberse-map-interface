import React from 'react'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import TableBonefolio from '../../components/TableBonefolio'
//Images
import trophyLogo from "../../assets/images/trophy.png";
import shibIcon from "../../assets/images/shibIcon.png";
import leashIcon from "../../assets/images/leashIcon.png";
import boneIcon from "../../assets/images/boneIcon.png";
import { CardHeading, Col, CardsubTitle } from '../Home/Card'
import BonefolioImage from '../../assets/images/home/bonefolio_icon.svg'
import { BackButton } from '../../components/Button'

export default function Bonefolio(props:any) {

    const BonefolioContainer = styled.div`
        display: inline-flex;
        width: 100%;
        height: auto;
        //border: 2px solid yellow;
        text-align: center

        @media(max-width: 1200px){
            display: block;
            //height: 100%;
        }

        @media(max-width: 500px){
            display: block;
            width: 100%;
            height: 100%;
        }
    `;

    const BoneSection = styled.div`
        display: inline-block;
        width:50%;
        min-height: 650px;
        height:auto;
        //border: 2px solid white;
        //margin:auto;

        box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.43);
        border-radius: 10px;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, rgba(17, 20, 27, 0.33) 31%, rgba(17, 20, 27, 0.5) 100%);

        @media(max-width: 1200px){
            //display:block;
            width:80%;
        }
        @media(max-width: 500px){
            width:100%;
            margin-bottom: 20px
        }
    `;

    const ChartSection = styled.div`
        display: inline-block;
        width:45%;
        height:100%;
        //border: 2px solid white;
        margin:auto;
        float: right

        box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.43);
        border-radius: 10px;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, rgba(17, 20, 27, 0.33) 31%, rgba(17, 20, 27, 0.5) 100%);

        @media(max-width: 1200px){
            //display: block;
            width:80%;
            float:none;
            height:80%;
            
        }
        @media(max-width: 500px){
            width:100%;
        }
    `;

    const BoneHeaderSection = styled.div`
        width: 100%;
        height: 70px;
        //border: 2px solid white;
        
    `;

    const CardHeading = styled.h1`
        display: inline-block;
        font-size: 2.3rem;
        text-align: left;
        font-weight: 700;
        color: #d5d5d5;
        margin: 0;
        font-family: "Metric - Bold";
        line-height: normal;
        font-style: normal;
        letter-spacing: 0.3px;
        padding-top: 0.6rem;
        // padding-bottom: 0.4rem;
        padding-left: 0.8rem;
        float:left;
    `
    const TrophySection = styled.div`
        display: inline-block;
        width:73px;
        height: 100%;
        float: right;
        //border: 2px solid white;
        box-shadow: inset 0 0 9px rgba(13, 13, 13, 0.43);
        border-radius: 10px;
        background-color: #1b1d2a;
        margin-top: 0.6rem;
        margin-right: 0.8rem;

        @media(max-width:600px){
            margin:0rem;
            
        }
    `;

    const TrophyIcon = styled.div`
        width:100%;
        height:100%;
        //opacity: 0.76;
        background-image: url(${trophyLogo});
        background-repeat: no-repeat;
        background-position: center;
    `;

    const BarContainer = styled.div`
        width: 100%;
        height: auto;
        margin-top:3rem;
        //border: 2px solid white;
    `;

    const BarSection = styled.div`
        width: 80%;
        height: auto;
        //border: 2px solid white;
        margin:auto;
        box-shadow: 0 0 2px 3px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        border: 1px solid #30333e;
        background-color: #30333e;
        //border: 2px solid white;
        // opacity: 0.7;
        margin-top: 10px;

        @media(max-width:600px){
            width:95%
        }
    `;

    const TitleBarContainer = styled.div`
        width:100%;
        height:50px;
        //border: 2px solid white;
    `;

    const TitleIcon = styled.div`
        display: inline-block;
        width:60px;
        height: 100%;
        float: left;
        //border: 2px solid white;
        background-repeat: no-repeat;
        background-position: center;
    `;

    const TokenTitle = styled.h1`
        display: inline-block;
        width:auto;
        height: 100%;
        //border: 2px solid white;
        float:left;
        font-style: normal;
        letter-spacing: 0.2px;
        line-height: 3.5rem;
        font-family: "Metric - Semibold";
        font-size: 35px;
        font-weight: 700;
        color: white;
    `;

    const TextSection = styled.h1`
        display: inline-block;
        width:auto;
        height: 100%;
        //border: 2px solid white;
        line-height: 3rem;
        padding-right: 10px;
        font-size: 15px;
        font-family: "Metric - Semibold";
    `;

    const DescriptionSection = styled.div`
        width:100%;
        height:90px;
        //border: 2px solid green;
        margin-top: 5px;
        font-weight:500;
        color: #d5d5d5;
        padding-left:10px
    `;

    const DetailSection = styled.div`
        width:100%;
        height:25%;
       // border: 2px solid white;
    `;


    const TableSection = styled.div`
        width: 100%;
        height: 80%;
        position: relative;
        top: 2%;
        padding: 10px
    `;

    const TotalSection = styled.div`
        width: 100%;
        height: 10%;
        //border: 2px solid white;
        position: relative;
        bottom: -10%;
    `;

    const Row = styled.div`
    display: flex;
    margin: 0;
    width: 100%;
    justify-content: space-between;
    padding: 0 0 1rem 0;
    `;

    const Col = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 0.3rem;
    `;

    const CardsubTitle = styled.div`
        padding-left:1rem;
        font-family: 'Heebo' !important;
        font-weight: bold
    `;


    return(
        <BonefolioContainer className="container my-auto pb-10 relative mobile-container">

            <BoneSection className="relative">
            <BackButton defaultRoute="" className="back_button top-4"/>

                <Row className="p-0">
                <Col>
                    <CardHeading>BONEFOLIO</CardHeading>
                </Col>
                <Col className="mt-4 pr-3">
                <div className="image-div">
                    <img src={BonefolioImage} width="40" height="40" />
                </div>
                </Col>
                </Row>
                <CardsubTitle className="title subtitle float-left yield_fonts">Every Shiba Inu needs to check their stash</CardsubTitle>

                <BarContainer>
                    <BarSection>
                        <TitleBarContainer>
                            <TitleIcon style={{backgroundImage:"url(" + shibIcon + ")"}}/>
                            <TokenTitle>SHIB</TokenTitle>
                            <TextSection style={{float:"right"}}>Amount: 1,000,000</TextSection>
                        </TitleBarContainer>
                        <DescriptionSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Staked:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>5,000,000</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Pool Share:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>0</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Available rewards:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>300</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px", color:"#b61e1e"}}>Locked rewards:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem", color:"#b61e1e"}}>600</TextSection>
                            </DetailSection>
                        </DescriptionSection>
                    </BarSection>
                    <BarSection>
                        <TitleBarContainer>
                            <TitleIcon style={{backgroundImage:"url(" + leashIcon + ")"}}/>
                            <TokenTitle>LEASH</TokenTitle>
                            <TextSection style={{float:"right"}}>Amount: 1,000,000</TextSection>
                        </TitleBarContainer>
                        <DescriptionSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Staked:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>5,000,000</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Pool Share:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>0</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Available rewards:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>300</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px", color:"#b61e1e"}}>Locked rewards:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem", color:"#b61e1e"}}>600</TextSection>
                            </DetailSection>
                        </DescriptionSection>
                    </BarSection>
                    <BarSection>
                        <TitleBarContainer>
                            <TitleIcon style={{backgroundImage:"url(" + boneIcon + ")"}}/>
                            <TokenTitle>BONE</TokenTitle>
                            <TextSection style={{float:"right"}}>Amount: 1,000,000</TextSection>
                        </TitleBarContainer>
                        <DescriptionSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Staked:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>5,000,000</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Pool Share:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>0</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px"}}>Available rewards:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem"}}>300</TextSection>
                            </DetailSection>
                            <DetailSection>
                                <TextSection style={{float:"left", lineHeight:"1.2rem", marginLeft:"10px", color:"#b61e1e"}}>Locked rewards:</TextSection>
                                <TextSection style={{float:"right", lineHeight:"1.2rem", color:"#b61e1e"}}>600</TextSection>
                            </DetailSection>
                        </DescriptionSection>
                    </BarSection>
                    <div style={{height:"20px"}}></div>
                </BarContainer>
            </BoneSection>
            <ChartSection>
            <TableSection>
                <TableBonefolio/>
            </TableSection>
            <TotalSection>
                <span className="pagination">{"<1/1>"}</span>
                <span className="total">{`TOTAL:$1.9`}</span>
            </TotalSection>
            </ChartSection>
            <div style={{height:"20px"}}></div>
        </BonefolioContainer>
    )
}