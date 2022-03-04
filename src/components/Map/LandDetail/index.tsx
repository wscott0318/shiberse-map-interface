import React from 'react';
import styled, { ThemeContext } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { setSelectedLandInfo } from 'state/map/actions'
import closeIcon from 'assets/images/map/icons/close.svg'
import assetLand from 'assets/images/map/asset_land.webp'
import downloadGif from 'assets/images/map/GM_download_gif.gif'
import setting from 'assets/images/map/icons/copy-link-icon.svg'

const LandDetailPanel = styled.div<{ show: boolean }>`
    right: ${({ show }) => ( show ? 0 : -420 )}px;
    background: #1b221f;
    width: 420px;
    transition: all .5s ease;

    /* Scroll */
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #505861;
        border-radius: 5px;
    }
`

const LandDetailContent = styled.div`
    display: block;
`

const LandThumbnail = styled.div`
    background-color: #282e36;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
`

const LandDetailCloseBtn = styled.div`
    background-color: #282e36;
    border-radius: 999px;
    width: 32px;
    top: 20px;
    right: 20px;
    bottom: unset;
    left: unset;
`

const LandThumbnailPic = styled.div`
    height: 270px;
    box-shadow: 0 0 10px rgb(0 0 0 / 50%);
    border: 2px solid #555d62;
    border-radius: 10px;

    img {
        height: 250px;
    }
`

const LandThumbnailInfo = styled.div`
    padding: 15px;

    .size {
        font-size: 20px;
        line-height: 20px;
    }
`

const LandDetailInfo = styled.div`
    padding: 25px;
`

const LandDetailInfoLocation = styled.div`
    .info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        svg {
            color: #2edb77;
            stroke: transparent;
            width: 24px;
            height: 24px;
            display: inline-block;
            fill: currentColor;

            circle {
                fill: #14181d;
                stroke: #14181d;
            }
        }

        span {
            color: #2edb77;
            display: flex;
            align-items: center;

            font-size: 20px;
            line-height: normal;
            text-align: center;
            font-weight: 700;
            margin-left: 2px;
        }

        img {
            margin-left: 15px;
            cursor: pointer;
        }
    }
`

const LandDetailInfoTitle = styled.div`
    text-transform: capitalize;
    font-size: 15px;
    letter-spacing: 0;
    color: #a0a4a7;
    margin-bottom: 5px;
`

const LandDetailInfoSize = styled.div`
    margin-top: 25px;

    .info {
        font-size: 20px;
        line-height: normal;
        color: white;
        letter-spacing: 0;

        .small {
            font-size: 15px;
            line-height: 15px;
            color: #a0a4a7;
            text-align: center;
        }
    }
`

const LandDetailDownload = styled.div`
    width: 100%;

    img {
        width: 100%;
    };
`

const LandDetailFooter = styled.div`
    padding: 15px 20px;
    background-color: #282e36;

    .is-full-width {
        .buy {
            line-height: 15px;
            font-size: 15px;
            margin-block: unset;
            margin-bottom: 10px;
        }

        .button-container {
            grid-gap: 10px;
            gap: 10px;

            button {
                background-color: #0084ff;
                border: none;
                font-size: 20px;
                min-width: 250px;
                height: 50px;
                border-radius: 25px;
                padding: 11px 24px;
                line-height: 24px;
                transition: all .5s;

                &:hover {
                    background-color: #0051ff;
                }
            }
        }
    }
`

export const LandDetail = () => {
    const selectedInfo = useSelector<AppState, AppState['map']['selectedLandInfo']>(state => state.map.selectedLandInfo)

    const dispatch = useDispatch<AppDispatch>()

    const updateSelectedInfo = (newLandInfo: object): any => dispatch( setSelectedLandInfo( { newLandInfo } ) )

    const closeAction = () => {
        updateSelectedInfo( { ...selectedInfo, show: false } )
    }

    return (
        <LandDetailPanel show={ selectedInfo.show } className='relative top-0 h-full z-20 flex flex-col justify-between overflow-auto'>
            <LandDetailContent>
                <LandThumbnail>
                    <LandDetailCloseBtn onClick={closeAction} className='cursor-pointer absolute z-10'>
                        <img src={ closeIcon } alt="pic"></img>
                    </LandDetailCloseBtn>

                    <LandThumbnailPic className='w-full flex items-center justify-center'>
                        <img src={ assetLand } alt="pic"></img>
                    </LandThumbnailPic>

                    <LandThumbnailInfo>
                        <p className='size text-white'>
                            Medium {`${ Math.ceil(selectedInfo.x) }, ${ Math.ceil(selectedInfo.y) }`}
                        </p>
                        <a href='#javascript;'>@Deej</a>
                    </LandThumbnailInfo>
                </LandThumbnail>

                <LandDetailInfo>
                    <LandDetailInfoLocation>
                        <LandDetailInfoTitle>Location</LandDetailInfoTitle>
                        <div className='info'>
                            <svg data-v-e275f764="" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span> {`${ Math.ceil(selectedInfo.x) }, ${ Math.ceil(selectedInfo.y) }`} </span>
                            <img className='settingIcon' src={ setting } alt='pic'></img>
                        </div>
                    </LandDetailInfoLocation>

                    <LandDetailInfoSize>
                        <LandDetailInfoTitle>size</LandDetailInfoTitle>
                        <div className='info'>
                            {`${ selectedInfo.size }x${ selectedInfo.size }`}
                            <span className='small'> ({ selectedInfo.size * selectedInfo.size } parcels) </span>
                        </div>
                    </LandDetailInfoSize>
                </LandDetailInfo>

                <LandDetailDownload>
                    <img src={ downloadGif } alt="pic"></img>
                </LandDetailDownload>
            </LandDetailContent>

            <LandDetailFooter className='h-auto w-full flx flex-col justify-center items-center box-border'>
                <div className='is-full-width w-full'>
                    <p className='buy text-white text-center uppercase'>Buy LAND</p>
                    <div className='button-container flex flex-row justify-between items-center w-full'>
                        <button className='w-full flex flex-row justify-center items-center relative text-white text-center capitalize cursor-pointer'>Bid</button>
                    </div>
                </div>
            </LandDetailFooter>
        </LandDetailPanel>
    )
}

export default LandDetail;