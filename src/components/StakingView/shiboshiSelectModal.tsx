import React, { useEffect } from 'react'
import styled from 'styled-components'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { NormalButton } from 'theme'
import Loader from '../Loader'
import defaultNFT from '../../assets/images/home/defaultNFT.png'

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 500;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`

const ConnectWalletWrapper = styled.div`
    padding: 1rem;
    text-align: center;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
    `};
`

const CloseIcon = styled.div`
    position: absolute;
    right: .5rem;
    top: 0;
    z-index: 10;
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`

const CloseColor = styled(Close)`
    path {
        stroke: ${({ theme }) => theme.text4};
    }
`

const HeaderText = styled.div`
    padding: 1rem 0;

    :hover {
        cursor: pointer;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        font-size: 1.5rem !important;
        line-height: 1.7rem !important;
        margin-top: 1rem;
    `};

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
        font-size: 1.3rem !important;
        line-height: 1.5rem !important;
        margin-top: 1rem;
    `};
`

const HeaderDescription = styled.div`
    padding: 1rem 0;
    color: rgb(255, 255, 255, 0.5);

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
    `};

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
        font-size: 0.9rem !important;
    `};
`

const ContentWrapper = styled.div`
    max-height: 40vh;
    overflow: auto;

    border-radius: 20px;

    padding: 0rem 1rem;
    margin: 2rem 0;

    background: #2f2e44;

    ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0rem;
    `};
`

const ArtWrapper = styled.div`
    width: 100px;
    overflow: hidden;
    background: transparent;
    margin: 10px;

    .image img {
        border-radius: 8px;
    }

    :hover {
        .image img {
            border: 3px solid #FF8F00;
        }
        cursor: pointer;
        color: #FF8F00;
    }

    &.active {
        .image img {
            border: 3px solid #FF8F00;
        }
        cursor: pointer;
        color: #FF8F00;
    }
`

export const ShiboshiSelectModal = (props: any) => {

    const isSelected = ( tokenId: any ) => (props.selectedNFTs.indexOf( tokenId ) !== -1)

    return (
        <Modal isOpen={ props.isOpen } onDismiss={ props.onDismiss } minHeight={false} maxHeight={80}>
            <UpperSection>
                <CloseIcon onClick={ props.onDismiss }>
                    <CloseColor />
                </CloseIcon>

                <ConnectWalletWrapper className='relative'>
                    <>
                        <HeaderText className='text-center text-3xl'>Lock your Shiboshis</HeaderText>
                        <HeaderDescription className='text-center text-base'>Select the Shiboshis you are willing to lock</HeaderDescription>
                    </>

                    <ContentWrapper className='relative'>
                        <div className='flex flex-wrap justify-center items-center py-5'>
                            { 
                                props.loadingNFTs ?
                                    ( <> <p className='text-lg mr-1'>Loading </p> <Loader stroke="white" /> </> )
                                : props.myNFTs.length === 0 ? 
                                    ( <p className='text-lg font-bold'>Oops! We can’t find your Shiboshis</p> )
                                : ( props.myNFTs.map(( nft: any, key: number ) => (
                                        <ArtWrapper key={`myNFT${key}`} onClick={() => props.handleSelectNFT( parseInt(nft.id.tokenId) )} className={`${ isSelected( parseInt(nft.id.tokenId) ) ? 'active' : '' }`}>
                                            <div className='image'>
                                                <img src={ nft.metaInfo.image } alt='pic'/>
                                            </div>
                                        </ArtWrapper>
                                    )) ) 
                            }
                        </div>
                    </ContentWrapper>

                    <NormalButton className='px-10' disabled={ props.selectedNFTs.length === 0 } onClick={ props.onDismiss }>
                        LOCK{ props.selectedNFTs.length > 0 ? ` ${ props.selectedNFTs.length }` : '' }
                    </NormalButton>
                </ConnectWalletWrapper>
            </UpperSection>
        </Modal>
    )
}

export default ShiboshiSelectModal