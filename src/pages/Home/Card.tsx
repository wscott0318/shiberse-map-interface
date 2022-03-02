import React, { FunctionComponent } from 'react' // importing FunctionComponent
import styled from 'styled-components'

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

export const Col = styled.div`
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

type CardProps = {
    name: string
    url: string
    subTitle: any
    desc: string
    buttonText: string
    disabled: boolean
    icon: string
}

type ButtonProps = {
    url: string
    disabled: boolean
    buttonText: string
}
export const Card: FunctionComponent<CardProps> = ({ name, url, subTitle, desc, buttonText, disabled, icon }) => (
    <CardWrapper>
        <CardHeader>
            <Row>
                <Col>
                    <CardHeading>{name}</CardHeading>
                </Col>
                <Col className="absolute top-4 right-2">
                    <ImageDiv>
                        <Image height={40} width={40} src={icon} />
                    </ImageDiv>
                </Col>
            </Row>
            <CardsubTitle className="sub_title">{subTitle}</CardsubTitle>
            <CardDesc>{desc}</CardDesc>
            <Button href={url} disabled={disabled}>
                {buttonText}
            </Button>
           
        </CardHeader>
        
    </CardWrapper>
)

export const Div: FunctionComponent<ButtonProps> = ({url,disabled,buttonText}) => {
    if(url.startsWith("http")){
        return(
            <Button target="_blank" href={`${url}`} disabled={disabled}>
                {buttonText}
            </Button>
        )
    }
    return(
    <Button href={`#${url}`} disabled={disabled}>
        {buttonText}
    </Button>
    )
 }