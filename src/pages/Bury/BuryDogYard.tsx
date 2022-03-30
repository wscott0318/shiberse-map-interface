/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from '../../hooks'
import { CardHeading, Col, CardsubTitle } from '../Home/Card'
import { CardSection, DataCard, CardSectionAuto } from '../../components/earn/styled'
import { NavLink } from '../../components/Link'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { TYPE } from '../../theme'
import { transparentize } from 'polished'
import styled, { ThemeContext } from 'styled-components'
import { BackButton } from '../../components/Button'
import { useParams } from 'react-router-dom'

import StakeDepositPanel from './StakeDepositPanel'
import BuryWithdrawlPanel from './BuryWithdrawlPanel'
import useBury from 'hooks/useBury'
import usePrices from 'hooks/usePrices'
import useSWR from 'swr'
import { request } from 'graphql-request'
import shibaSwapData, { leash } from '@shibaswap/shibaswap-data-snoop'

import { xSHIB_MERKEL, xLEASH_MERKEL, tBONE_MERKEL, MerkleAmountAndProofs } from '../../constants'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useModalOpen, useToggleSelfClaimModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import { useClaimCallback, useUserUnclaimedAmount } from 'state/claim/hooks'
import Fraction from '../../entities/Fraction'
import QuestionHelper from 'components/QuestionHelper'
import { ButtonPrimary } from 'components/ButtonLegacy'
import Loader from 'components/Loader'
import { formattedNum, formatLessThan, formatFromBalance, isAddress, tempCountDays } from '../../utils'
import useShibaSwapTokenBalance from 'shiba-hooks/useShibaSwapTokenBalance'
import {
    SHIBASWAP_SHIB_TOKEN_ADDRESS,
    SHIBASWAP_BONE_TOKEN_ADDRESS,
    SHIBASWAP_LEASH_TOKEN_ADDRESS,
    SHIBASWAP_BURY_BONE_ADDRESS,
    SHIBASWAP_BURY_SHIB_ADDRESS,
    SHIBASWAP_BURY_LEASH_ADDRESS,
    TokenAmount,
    DAI,
    USDC,
    WBTC,
    USDT,
    WETH
} from '@shibaswap/sdk'
import { Helmet } from 'react-helmet'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { TruncatedText } from 'components/swap/styleds'
import { truncate } from 'lodash'
import Modal from 'components/Modal'

export interface BalanceProps {
    value: BigNumber
    decimals: number
}

const Dots = styled.span`
    &::after {
        display: inline-block;
        animation: ellipsis 1.25s infinite;
        content: '.';
        width: 1em;
        text-align: left;
    }
    @keyframes ellipsis {
        0% {
            content: '.';
        }
        33% {
            content: '..';
        }
        66% {
            content: '...';
        }
    }
`

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

const PageWrapper = styled(AutoColumn)`
    max-width: 420px;
    width: 100%;
`

const VoteCard = styled(DataCard)`
    background: ${({ theme }) => transparentize(0.5, theme.bg1)};
    overflow: hidden;
`

const BurySection = styled.div`
    width: 70%;
    height: auto;
    // border:2px solid white;
    box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.43);
    border-radius: 10px;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(17, 20, 27, 0.33) 31%,
        rgba(17, 20, 27, 0.5) 100%
    );

    @media (max-width: 500px) {
        text-align: center;
        width: 100%;
    }
`
const CloseIcon = styled.div`
    width: 28px;
    height: 30px;
    opacity: 0.24;
    background-repeat: no-repeat;
    float: right;
    position: relative;
    right: 7px;
    top: 5px;
    cursor: pointer;
    display: block;
`

const BoxContainer = styled.div`
    width: 90%;
    height: auto;
    margin: auto;
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    justify-content: center;

    @media (max-width: 800px) {
        text-align: center;
        display: block;
    }
`

const BoxSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95%;
    height: 88px;
    box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #292c37;

    @media (max-width: 800px) {
        text-align: center;
        width: 100%;
        margin-top: 10px;
    }
`

const StakeSection = styled.div`
    width: 70%;
    height: auto;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 50px;
    box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #292c37;
    text-align: center;

    @media (max-width: 800px) {
        text-align: center;
        width: 95%;
    }
`

const StakeButton = styled.div`
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    font-family: 'Heebo' !important;
    letter-spacing: 0.1px;
    line-height: normal;
    float: right;
    margin: 10px 10px;
    cursor: pointer;
`
const ClaimContainer = styled.div`
    width: 90%;
    height: auto;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: inset 0 0 7px 1px rgba(0, 0, 0, 0.45);
    background-color: #161825;
    opacity: 0.76;
    border-color: #161825;
    //border: 2px solid white;
    //padding: 10px;

    @media (max-width: 600px) {
        // display: block;
        padding-bottom: 3px;
    }
`

const ClaimFirstSection = styled.div`
    display: inline-block;
    width: 60%;
    height: auto;
    margin: auto;
    margin-top: 10px;
    //border: 2px solid white;
    //float:left;
    text-align: left;
    //padding:10px;
    //border-right: 1px solid rgba(255, 255, 255, .2);

    @media (max-width: 600px) {
        text-align: left;
        display: block;
        //float:center;
        margin: auto;
        height: auto !important;
        width: 100%;
    }
`

const ClaimSecondSection = styled.div`
    display: inline-block;
    width: 40%;
    height: auto;
    min-height: 140px;
    //border: 2px solid white;
    float: right;
    text-align: left;
    margin-top: 4px;
    //border-left: 0.5px solid #d5d5d5;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    //position:relative;
    //top:-15px;
    padding-left: 5px;
    @media (max-width: 600px) {
        text-align: left;
        display: block;
        float: none;
        margin: auto;
        height: auto;
        width: 100%;
        border-left: none;
        top: 0px;
        padding-left: 0;
    }
`

const ClaimButton = styled.div`
    width: 80px;
    height: auto;
    line-height: 40px;
    border-radius: 10px;
    background-color: #292c37;
    text-align: center;
    float: right;
    position: relative;
    //top:10px;
    //right:10px;
    //left:50px;
    cursor: pointer;
    line-height: 36px;
    font-weight: 500;
    margin-top: 20px;

    @media (max-width: 600px) {
        top: 28px;
        left: 0;
        float: none;
        margin: 0 auto;
        text-align: center;
    }
`

function tokenAddresses(): any {
    const { chainId } = useActiveWeb3React()
    const { tokenName } = useParams<Record<string, string | undefined>>()

    if (tokenName?.toLowerCase() === 'shib') {
        const { shibPrice } = usePrices()
        return {
            tokenAddress: SHIBASWAP_SHIB_TOKEN_ADDRESS && chainId ? SHIBASWAP_SHIB_TOKEN_ADDRESS[chainId] : '',
            buryTokenAddress: SHIBASWAP_BURY_SHIB_ADDRESS && chainId ? SHIBASWAP_BURY_SHIB_ADDRESS[chainId] : '',
            tokenType: tokenName.toLowerCase(),
            tokenPrice: shibPrice
        }
    }
    if (tokenName?.toLowerCase() === 'leash') {
        const { leashPrice } = usePrices()
        return {
            tokenAddress: SHIBASWAP_LEASH_TOKEN_ADDRESS && chainId ? SHIBASWAP_LEASH_TOKEN_ADDRESS[chainId] : '',
            buryTokenAddress: SHIBASWAP_BURY_LEASH_ADDRESS && chainId ? SHIBASWAP_BURY_LEASH_ADDRESS[chainId] : '',
            tokenType: tokenName.toLowerCase(),
            tokenPrice: leashPrice
        }
    }
    if (tokenName?.toLowerCase() === 'bone') {
        const { bonePrice } = usePrices()
        return {
            tokenAddress: SHIBASWAP_BONE_TOKEN_ADDRESS && chainId ? SHIBASWAP_BONE_TOKEN_ADDRESS[chainId] : '',
            buryTokenAddress: SHIBASWAP_BURY_BONE_ADDRESS && chainId ? SHIBASWAP_BURY_BONE_ADDRESS[chainId] : '',
            tokenType: tokenName.toLowerCase(),
            tokenPrice: bonePrice
        }
    }
}

const fetcherShib = (query: any) => request('https://api.thegraph.com/subgraphs/name/shibaswaparmy/buryshib', query)
const fetcherLeash = (query: any) => request('https://api.thegraph.com/subgraphs/name/shibaswaparmy/buryleash', query)
const fetcherBone = (query: any) => request('https://api.thegraph.com/subgraphs/name/shibaswaparmy/burybone', query)

function calculate_apy(apr: any): any {
    return apr ? (Math.pow(1 + apr / 365, 365) - 1) * 100 : undefined
}

export default function BuryDogYard(props: any): JSX.Element {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()
    //const darkMode = useDarkModeManager()

    const state = props.location.state
    const { tokenType, tokenAddress, buryTokenAddress, tokenPrice } = tokenAddresses()

    const buryBalanceBigInt = useShibaSwapTokenBalance(buryTokenAddress ? buryTokenAddress : '')
    const buryBalanceValue = parseFloat(
        formatFromBalance(buryBalanceBigInt?.value, buryBalanceBigInt?.decimals)
    ).toFixed(3)
    const shibaBalanceBigInt = useShibaSwapTokenBalance(tokenAddress ? tokenAddress : '')
    const shibaBalanceValue = parseFloat(
        formatFromBalance(shibaBalanceBigInt?.value, shibaBalanceBigInt?.decimals)
    ).toFixed(3)
    const priceUSD = (
        parseFloat(formatFromBalance(shibaBalanceBigInt?.value, shibaBalanceBigInt?.decimals)) * parseFloat(tokenPrice)
    ).toFixed(3)

    const [isStakeSelected, setIsStakeSelected] = useState(true)
    const { leave } = useBury({ tokenType, tokenAddress })

    function handleStakeSelect(selectedKey: string) {
        setIsStakeSelected(selectedKey === 'Stake')
    }
    const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
    const toggleClaimModal = useToggleSelfClaimModal()

    const [shibApy, setShibApy] = useState<any>()
    const [shibBoneApy, setShibBoneApy] = useState<any>()
    const [shibEthApy, setShibEthApy] = useState<any>()
    const [leashApy, setLeashApy] = useState<any>()
    const [leashBoneApy, setLeashBoneApy] = useState<any>()
    const [boneApy, setBoneApy] = useState<any>()
    const [boneBoneApy, setBoneBoneApy] = useState<any>()

    const { bonePrice, fetchTotalVolumeUSD, fetchTokenVolumeUSD, fetchEthPrice } = usePrices()
    const [ethPrice, setEthPrice] = useState<any>()
    const [totalVolumeUSD, setTotalVolumeUSD] = useState<any>()
    const [DAIVolumeUSD, setDAIVolumeUSD] = useState<any>()
    const [WBTCVolumeUSD, setWBTCVolumeUSD] = useState<any>()
    const [USDCVolumeUSD, setUSDCVolumeUSD] = useState<any>()
    const [USDTVolumeUSD, setUSDTVolumeUSD] = useState<any>()
    const [WETHVolumeUSD, setWETHVolumeUSD] = useState<any>()
    useEffect(() => {
        fetchTotalVolumeUSD().then(volumeUSD => {
            volumeUSD && setTotalVolumeUSD(Number(volumeUSD))
        })
        fetchEthPrice().then(price => {
            price && setEthPrice(Number(price))
        })
        if (chainId) {
            fetchTokenVolumeUSD(DAI[chainId]?.address.toLowerCase()).then(volumeUSD => {
                volumeUSD && setDAIVolumeUSD(Number(volumeUSD))
            })
            fetchTokenVolumeUSD(USDC[chainId]?.address.toLowerCase()).then(volumeUSD => {
                volumeUSD && setUSDCVolumeUSD(Number(volumeUSD))
            })
            fetchTokenVolumeUSD(WBTC[chainId]?.address.toLowerCase()).then(volumeUSD => {
                volumeUSD && setWBTCVolumeUSD(Number(volumeUSD))
            })
            fetchTokenVolumeUSD(USDT[chainId]?.address.toLowerCase()).then(volumeUSD => {
                volumeUSD && setUSDTVolumeUSD(Number(volumeUSD))
            })
            fetchTokenVolumeUSD(WETH[chainId]?.address.toLowerCase()).then(volumeUSD => {
                volumeUSD && setWETHVolumeUSD(Number(volumeUSD))
            })
        }
    }, [chainId])

    // ALL APRs need to be changed to APYs

    let MERKEL = xSHIB_MERKEL
    let fetcher = fetcherShib
    let analytics_url = '/bury-shib'
    if (tokenType === 'shib') {
        const { data } = useSWR(
            `{bury(id: "${buryTokenAddress.toLowerCase()}") {ratio, totalSupply, shibStakedUSD}}`,
            fetcher
        )
        useEffect(() => {
            const fetchData1 = () => {
                if (data?.bury?.totalSupply && data?.bury?.ratio && parseFloat(tokenPrice) > 0) {
                    // const netUSD = totalVolumeUSD && (totalVolumeUSD - DAIVolumeUSD - WBTCVolumeUSD - USDCVolumeUSD - USDTVolumeUSD - WETHVolumeUSD)
                    const apr =
                        totalVolumeUSD &&
                        (((totalVolumeUSD * (0.05 / 3) * 0.05) / data?.bury?.totalSupply) * 365) /
                            (data?.bury?.ratio * tokenPrice)
                    const obj = { apy: calculate_apy(apr), text: 'SHIB APY' }
                    setShibApy(obj)
                }
            }
            fetchData1()
        }, [data?.bury?.ratio, data?.bury?.totalSupply, tokenPrice, totalVolumeUSD])

        useEffect(() => {
            const fetchData2 = () => {
                if (data?.bury?.shibStakedUSD && parseFloat(bonePrice) > 0) {
                    const apr = ((0.6 * parseFloat(bonePrice)) / data?.bury?.shibStakedUSD) * 277 * 24 * 30 * 12 * 100
                    const obj = { apy: calculate_apy(apr), text: '+ BONE APY' }
                    setShibBoneApy(obj)
                }
            }
            fetchData2()
        }, [data?.bury?.shibStakedUSD, bonePrice])

        useEffect(() => {
            const fetchData3 = () => {
                if (data?.bury?.totalSupply && data?.bury?.ratio && parseFloat(tokenPrice) > 0) {
                    const apr =
                        totalVolumeUSD &&
                        (((totalVolumeUSD * 0.1) / data?.bury?.totalSupply) * 365) / (data?.bury?.ratio * tokenPrice)
                    const obj = { apy: calculate_apy(apr), text: '+ ETH APY' }
                    setShibEthApy(obj)
                }
            }
            fetchData3()
        }, [data?.bury?.ratio, data?.bury?.totalSupply, tokenPrice])
    } else if (tokenType === 'leash') {
        MERKEL = xLEASH_MERKEL
        fetcher = fetcherLeash
        analytics_url = '/bury-leash'
        const { data } = useSWR(
            `{bury(id: "${buryTokenAddress.toLowerCase()}") {ratio, totalSupply, leashStakedUSD}}`,
            fetcher
        )

        useEffect(() => {
            const fetchData1 = async () => {
                if (data?.bury?.totalSupply && data?.bury?.ratio && parseFloat(tokenPrice) > 0) {
                    const netUSD =
                        totalVolumeUSD &&
                        totalVolumeUSD - DAIVolumeUSD - WBTCVolumeUSD - USDCVolumeUSD - USDTVolumeUSD - WETHVolumeUSD
                    const apr =
                        totalVolumeUSD &&
                        (((totalVolumeUSD * (0.05 / 3) * 0.05) / data?.bury?.totalSupply) * 365) /
                            (data?.bury?.ratio * tokenPrice)
                    const obj = { apy: calculate_apy(apr), text: 'LEASH APY' }
                    setLeashApy(obj)
                }
            }
            fetchData1()
        }, [data?.bury?.ratio, data?.bury?.totalSupply, tokenPrice])

        useEffect(() => {
            const fetchData = async () => {
                if (data?.bury?.leashStakedUSD && parseFloat(bonePrice) > 0) {
                    const apr = ((0.2 * parseFloat(bonePrice)) / data?.bury?.leashStakedUSD) * 277 * 24 * 30 * 12 * 100
                    const obj = { apy: calculate_apy(apr), text: '+ BONE APY' }
                    setLeashBoneApy(obj)
                }
            }
            fetchData()
        }, [data?.bury?.leashStakedUSD, bonePrice])
    } else if (tokenType === 'bone') {
        MERKEL = tBONE_MERKEL
        fetcher = fetcherBone
        analytics_url = '/bury-bone'
        const { data } = useSWR(
            `{bury(id: "${buryTokenAddress.toLowerCase()}") {ratio, totalSupply, boneStakedUSD}}`,
            fetcher
        )

        useEffect(() => {
            const fetchData1 = async () => {
                if (data?.bury?.totalSupply && data?.bury?.ratio && parseFloat(tokenPrice) > 0) {
                    const netUSD =
                        totalVolumeUSD &&
                        totalVolumeUSD - DAIVolumeUSD - WBTCVolumeUSD - USDCVolumeUSD - USDTVolumeUSD - WETHVolumeUSD
                    const apr =
                        totalVolumeUSD &&
                        (((totalVolumeUSD * (0.05 / 3) * 0.05) / data?.bury?.totalSupply) * 365) /
                            (data?.bury?.ratio * tokenPrice)
                    const obj = { apy: calculate_apy(apr), text: 'BONE APY' }
                    setBoneApy(obj)
                }
            }
            fetchData1()
        }, [data?.bury?.ratio, data?.bury?.totalSupply, tokenPrice])

        useEffect(() => {
            const fetchData = async () => {
                if (data?.bury?.boneStakedUSD && parseFloat(bonePrice) > 0) {
                    const apr = ((0.52 * parseFloat(bonePrice)) / data.bury.boneStakedUSD) * 277 * 24 * 30 * 12 * 100
                    const obj = { apy: calculate_apy(apr), text: '+ BONE APY' }
                    setBoneBoneApy(obj)
                }
            }
            fetchData()
        }, [data?.bury?.boneStakedUSD, bonePrice])
    }

    // remove once treasury signature passed
    const pendingTreasurySignature = false

    const [aprModal, setAprModal] = useState(false)

    return (
        <>
            <Helmet>
                <title>BURY | ShibaSwap</title>
                <meta name="description" content="" />
            </Helmet>
            <BurySection className="m-auto relative bury_section mobile-container">
                <CardHeading className="p-4">BURY {tokenType?.toUpperCase()}</CardHeading>

                {/* <CloseIcon style={{backgroundImage:"url(" + closeLogo + ")"}}/> */}
                <BackButton defaultRoute="/bury" className="back_button" />
                <div className="flex bury_box row">
                    <div className="col-md-6 p-0 pr-3">
                        <BoxSection className="box_section">
                            <div className="inner">
                                <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                    Total Buried: {buryBalanceValue}
                                </TYPE.white>
                                <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                    Your Tokens: {shibaBalanceValue}
                                </TYPE.white>
                                <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                    Total Value: ${priceUSD}
                                </TYPE.white>
                            </div>
                        </BoxSection>
                    </div>
                    <div className="col-md-6 p-0">
                        <BoxSection className="box_section">
                            <div className="inner relative">
                                <div>
                                    <Modal
                                        isOpen={aprModal}
                                        onDismiss={() => {
                                            setAprModal(false)
                                        }}
                                        padding={2}
                                        maxHeight={90}
                                    >
                                        <h2>APR</h2>

                                        <p>
                                            APR does not take into account the compounding of interest within a specific
                                            year. It is calculated by multiplying the periodic interest rate by the
                                            number of periods in a year in which the periodic rate is applied. It does
                                            not indicate how many times the rate is applied to the balance.{' '}
                                        </p>

                                        <p>APR is calculated as follows:</p>

                                        <p>APR = Periodic Rate x Number of Periods in a Year</p>

                                        <h2>APY</h2>
                                        <p>
                                            Investment companies generally advertise the APY they pay to attract
                                            investors because it seems like they&apos;ll earn more on things like
                                            certificates of deposit (CDs), individual retirement accounts (IRAs), and
                                            savings accounts. Unlike APR, APY does take into account the frequency with
                                            which the interest is applied—the effects of intra-year compounding. This
                                            seemingly subtle difference can have important implications for investors
                                            and borrowers. APY is calculated by adding 1+ the periodic rate as a decimal
                                            and multiplying it by the number of times equal to the number of periods
                                            that the rate is applied, then subtracting 1.{' '}
                                        </p>

                                        <p>Here&apos;s how APY is calculated:</p>

                                        <p>APY = (1 + Periodic Rate)Number of periods – 1</p>

                                        <p> Credit : Investopedia </p>
                                    </Modal>
                                </div>
                                {tokenType === 'shib' ? (
                                    <div>
                                        <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                            {shibBoneApy?.text}:{' '}
                                            {shibBoneApy?.apy ? shibBoneApy.apy.toFixed(2) + '%' : `Loading...`}
                                        </TYPE.white>

                                        <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                            {shibEthApy?.text}:{' '}
                                            {shibEthApy?.apy ? shibEthApy.apy.toFixed(2) + '%' : `Loading...`}
                                        </TYPE.white>

                                        <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                            {shibApy?.text} :{' '}
                                            {shibApy?.apy ? shibApy.apy.toFixed(2) + '%' : `Loading...`}
                                        </TYPE.white>
                                    </div>
                                ) : tokenType === 'leash' ? (
                                    <div>
                                        <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                            {leashBoneApy?.text}:{' '}
                                            {leashBoneApy?.apy ? leashBoneApy.apy.toFixed(2) + '%' : `Loading...`}
                                        </TYPE.white>

                                        <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                            {leashApy?.text}:{' '}
                                            {leashApy?.apy ? leashApy.apy.toFixed(2) + '%' : `Loading...`}
                                        </TYPE.white>
                                    </div>
                                ) : (
                                    <div>
                                        <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                            {boneBoneApy?.text}:{' '}
                                            {boneBoneApy?.apy ? boneBoneApy.apy.toFixed(2) + '%' : `Loading...`}
                                        </TYPE.white>

                                        <TYPE.white fontWeight={800} fontSize={'18px'} className="text">
                                            {boneApy?.text}:{' '}
                                            {boneApy?.apy ? boneApy.apy.toFixed(2) + '%' : `Loading...`}
                                        </TYPE.white>
                                    </div>
                                )}
                                {/* <div className="view_status">
            <a href="javascript:void(0)" onClick={()=>{setAprModal(true)}} rel="noreferrer noopener" className={`
                py-1 px-4 md:py-1.5 md:px-7 rounded
                md:text-sm font-medium md:font-bold text-white
                hover:bg-opacity-90`}>
                {`APR vs APY`}
              </a>
            </div> */}
                                <div className="view_status">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                            setAprModal(true)
                                        }}
                                        rel="noreferrer noopener"
                                        className={`
                py-1 px-4 md:py-1.5 md:px-7 rounded
                md:text-sm font-medium md:font-bold text-white
                hover:bg-opacity-90`}
                                        style={{
                                            display: 'block',
                                            paddingBottom: '0px !important',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        {`APR vs APY`}
                                    </a>
                                    <a
                                        href={`https://analytics.shibaswap.com${analytics_url}`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className={`
                py-1 px-4 md:py-1.5 md:px-7 rounded
                md:text-sm font-medium md:font-bold text-white
                hover:bg-opacity-90`}
                                    >
                                        {`View Stats`}
                                    </a>
                                </div>
                            </div>
                        </BoxSection>
                    </div>
                </div>
                <StakeSection>
                    <StakeButton
                        onClick={() => {
                            handleStakeSelect('Unstake')
                        }}
                        style={{ color: !isStakeSelected ? '#fea31c' : '', marginRight: '45px' }}
                    >
                        Unstake
                    </StakeButton>
                    <StakeButton
                        onClick={() => {
                            handleStakeSelect('Stake')
                        }}
                        style={{ color: isStakeSelected ? '#fea31c' : '' }}
                    >
                        Stake
                    </StakeButton>
                    <br></br>

                    {isStakeSelected ? (
                        <StakeDepositPanel tokenType={tokenType} tokenAddress={tokenAddress} />
                    ) : (
                        <BuryWithdrawlPanel tokenType={tokenType} tokenAddress={buryTokenAddress} />
                    )}

                    <ClaimContainer
                        className={tokenType !== 'Bone' && tokenType !== 'Leash' ? 'row' : 'background_leash'}
                    >
                        <VoteCard>
                            <CardSectionAuto gap="xs" style={{ padding: 0 }}>
                                <NavLink to="/archive">
                                    <TYPE.white
                                        fontSize={'18px'}
                                        style={{ textAlign: 'center', textDecoration: 'underline' }}
                                    >
                                        Archived Rewards
                                    </TYPE.white>
                                </NavLink>
                            </CardSectionAuto>
                            <CardSectionAuto gap="xs" style={{ padding: 0 }}>
                                <NavLink to="/yield">
                                    <TYPE.white
                                        fontSize={'18px'}
                                        style={{ textAlign: 'center', textDecoration: 'underline' }}
                                    >
                                        Cumulative Bone Rewards
                                    </TYPE.white>
                                </NavLink>
                            </CardSectionAuto>
                        </VoteCard>
                        {tokenType === 'XYZ' ? (
                            <div className="bone_container">
                                <p style={{ padding: '1rem 1rem', fontSize: '15px' }}>
                                    BONE{' '}
                                    <span className="italic">
                                        {
                                            "returns will be automatically distributed to tBONE holders weekly. You don't need to claim this manually"
                                        }
                                    </span>
                                </p>
                                {/* <ClaimFirstSection>
            <div className="claimsection-1"> 
            <TYPE.white fontWeight={800} fontSize={16} className="text">Your staked amount - $1000</TYPE.white>
            <TYPE.white fontWeight={800} fontSize={16} className="text">Available returns -</TYPE.white>
            <TYPE.white fontWeight={800} fontSize={16} className="text">Yearly ROI - 0,00%</TYPE.white>
            <TYPE.white fontWeight={800} fontSize={16} className="text">Value - $0.000</TYPE.white>
            </div>
          </ClaimFirstSection> */}

                                {/* <ClaimSecondSection>
          <div className="claimsection">
            <TYPE.white fontWeight={800} fontSize={16} className="text">Pending returns - $0.000</TYPE.white>
            <TYPE.white fontWeight={800} fontSize={16} className="text">Available date:</TYPE.white>
            <ClaimButton
            
              onClick={async () => {
              
                let balance = { value: BigNumber.from(0), decimals: 18 }
                  await leave(balance)
              }}
               >
            <TYPE.white fontWeight={800} fontSize={16} className="text">CLAIM</TYPE.white>
          </ClaimButton>
          </div>
          </ClaimSecondSection> */}
                            </div>
                        ) : (
                            MERKEL &&
                            MERKEL.length > 0 &&
                            MERKEL.map((merkel, i) => {
                                return (
                                    <div className="col-md-6 mx-auto" key={i}>
                                        <RewardBox
                                            merkel={merkel}
                                            pendingTreasurySignature={pendingTreasurySignature}
                                            theme={theme}
                                            tokenType={tokenType}
                                            account={account}
                                        />
                                    </div>
                                )
                            })
                        )}
                    </ClaimContainer>

                    <div style={{ width: '100%', height: '20px' }}></div>
                </StakeSection>
            </BurySection>
        </>
    )
}

export function RewardBox({
    merkel,
    theme,
    tokenType,
    account,
    pendingTreasurySignature
}: {
    merkel: MerkleAmountAndProofs
    theme: any
    tokenType?: String
    account: any
    pendingTreasurySignature: boolean
}): JSX.Element {
    const unclaimedAmount: TokenAmount | undefined = !merkel.showComingSoon
        ? useUserUnclaimedAmount(account, merkel)
        : undefined
    // console.log(unclaimedAmount?.toFixed(8))
    // monitor the status of the claim from contracts and txns
    const { claimCallback } = useClaimCallback(account, merkel)
    const tokenName = merkel.rewardTokenName

    const [totalLocked, setTotalLocked] = useState<string>()
    const [totalClaimed, setTotalClaimed] = useState<string>()
    const [nextLockDate, setNextLockDate] = useState<any>()
    useEffect(() => {
        const fetchLockup = async () => {
            if (account && !merkel.showComingSoon) {
                fetch(merkel.amounts)
                    .then(response => response.json())
                    .then(data => {
                        // console.log('vesting:', data)
                        const userLockedInfo = data[account.toLowerCase()] ? data[account.toLowerCase()] : undefined
                        if (userLockedInfo) {
                            const userLocked = Fraction.from(
                                BigNumber.from(BigInt(Math.floor(parseFloat(userLockedInfo.locked)))),
                                BigNumber.from(10).pow(merkel.decimals)
                            ).toString()
                            setTotalLocked(userLocked)
                            setTotalClaimed(userLockedInfo.totalClaimed.toString())
                            const date = new Date(parseInt(userLockedInfo.nextLockDate))
                            const dateLock = date?.toLocaleString() ?? '-'
                            setNextLockDate(dateLock)
                        }
                        // console.log('userLocked:', userLocked)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            return []
        }
        fetchLockup()
    }, [account])

    const [pendingTx, setPendingTx] = useState<string | null>(null)

    function onClaimClick() {
        claimCallback()
            .then((hash: any) => {
                setPendingTx(hash)
            })
            .catch((err: any) => {
                console.error(err)
            })
    }

    const attempting = useIsTransactionPending(pendingTx ?? undefined)

    const [claimedtill, setClaimedTill] = useState<string>()

    useEffect(() => {
        const fetchClaim = async () => {
            merkel.vesting.users().then((claims: any[]) => {
                const TotalClaimedTill = claims.find(u => account?.toLowerCase() === u.id)?.totalClaimed ?? 0
                setClaimedTill((TotalClaimedTill * Math.pow(10, 18 - merkel.decimals)).toString())
            })
            return []
        }
        fetchClaim()
    }, [])

    return (
        <VoteCard>
            <CardSection gap="sm">
                <RowBetween>
                    <TYPE.white fontWeight={700} color={theme.text1}>
                        Woofable {tokenName} this Week
                    </TYPE.white>
                    <QuestionHelper text={merkel.tooltip} />
                </RowBetween>
                <div style={{ alignItems: 'baseline' }}>
                    <TYPE.white fontWeight={700} fontSize={36} color={theme.text1}>
                        {account && formatLessThan(unclaimedAmount)}
                    </TYPE.white>
                    <TYPE.white fontWeight={500} fontSize={15} color={theme.text3}>
                        <p className="green_title">Woofed till now: {formattedNum(claimedtill)}</p>
                        {!merkel.disableLockInfo && (
                            <div>
                                <p>UnWoofable: {formattedNum(totalLocked)}</p>
                                <p>Woofable date: {nextLockDate}</p>
                            </div>
                        )}
                    </TYPE.white>
                </div>
                {merkel.showComingSoon ? (
                    <ButtonPrimary
                        className="yield_button yield"
                        disabled={true}
                        padding="16px 16px"
                        width="100%"
                        borderRadius="10px"
                        mt="0.5rem"
                    >
                        <> {`Coming Soon...`}</>
                    </ButtonPrimary>
                ) : (
                    <ButtonPrimary
                        className="yield_button yield"
                        disabled={
                            !isAddress(account ?? '') ||
                            attempting ||
                            !unclaimedAmount ||
                            Number(unclaimedAmount?.toFixed(8)) <= 0 ||
                            pendingTreasurySignature
                        }
                        padding="16px 16px"
                        width="100%"
                        borderRadius="10px"
                        mt="0.5rem"
                        onClick={onClaimClick}
                    >
                        {pendingTreasurySignature ? (
                            <Dots>Pending Treasury Transfer</Dots>
                        ) : (
                            <> {`WOOF ${tokenName}`}</>
                        )}

                        {attempting && <Loader stroke="white" style={{ marginLeft: '10px' }} />}
                    </ButtonPrimary>
                )}
            </CardSection>
        </VoteCard>
    )
}
