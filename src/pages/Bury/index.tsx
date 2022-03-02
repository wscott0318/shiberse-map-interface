import React, { useCallback, useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import { VCard } from './VCard'
import styled from 'styled-components'
import { CardHeading, Col, CardsubTitle } from '../Home/Card'
import {
    SHIBASWAP_SHIB_TOKEN_ADDRESS,
    SHIBASWAP_BONE_TOKEN_ADDRESS,
    SHIBASWAP_LEASH_TOKEN_ADDRESS,
    SHIBASWAP_BURY_BONE_ADDRESS,
    SHIBASWAP_BURY_SHIB_ADDRESS,
    SHIBASWAP_BURY_LEASH_ADDRESS,
    Fraction,
    TokenAmount
} from '@shibaswap/sdk'
import { useActiveWeb3React } from '../../hooks'
import { BackButton } from '../../components/Button'
import BuryModal from '../Bury/BuryModal'
import useBury from 'hooks/useBury'
import { HelpCircle as Question } from 'react-feather'
import { Helmet } from 'react-helmet'
import usePrices from 'hooks/usePrices'
import useSWR from 'swr'
import { request } from 'graphql-request'

const PageWrapper = styled(AutoColumn)`
    max-width: 100%;
    width: 100%;
    justify-items: flex-start;
    height: 100%;
`
const ImageDiv = styled.div`
    box-shadow: inset 0 0 9px rgba(13, 13, 13, 0.43);
    border-radius: 10px;
    background-color: #1b1d2a;
    padding: 0.5rem;
`

const InnerDiv = styled.div`
    // box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.43);
    border-radius: 10px;
    // background-image: linear-gradient(
    //     to bottom,
    //     rgba(0, 0, 0, 0.25) 0%,
    //     rgba(17, 20, 27, 0.33) 31%,
    //     rgba(17, 20, 27, 0.5) 100%
    // );
`
const Row = styled.div`
    display: flex;
    margin: 0;
    width: 100%;
    justify-content: space-between;
    padding: 0 0 1rem 0;
`
const QuestionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: none;
    background: none;
    outline: none;
    cursor: default;
    border-radius: 36px;
    // background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text2};

    :hover,
    :focus {
        opacity: 0.7;
    }
`
function formatStakedAmount(staked: string) {
    const value = parseFloat(staked)
    if (isNaN(value)) return staked
    if (value === 0) return '-'
    return value.toFixed(2)
}

const fetcherShib = (query: any) => request('https://api.thegraph.com/subgraphs/name/shibaswaparmy/buryshib', query)
const fetcherLeash = (query: any) => request('https://api.thegraph.com/subgraphs/name/shibaswaparmy/buryleash', query)
const fetcherBone = (query: any) => request('https://api.thegraph.com/subgraphs/name/shibaswaparmy/burybone', query)

function calculate_apy(apr: any): any {
    return apr ? (Math.pow(1 + apr / 365, 365) - 1) * 100 : undefined
}

export default function Bury(props: any) {
    const { account, chainId } = useActiveWeb3React()
    const [showModal, setShowModal] = useState<boolean>(false)

    const handleDismiss = useCallback(() => {
        setShowModal(false)
    }, [setShowModal])

    const [shibBalance, setShibBalance] = useState<string>('-')
    const [leashBalance, setLeashBalance] = useState<string>('-')
    const [boneBalance, setBoneBalance] = useState<string>('-')
    const shibBury = useBury({ tokenType: 'Shib', tokenAddress: chainId ? SHIBASWAP_SHIB_TOKEN_ADDRESS[chainId] : '' })
    useEffect(() => {
        shibBury?.stakedBalance().then(value => {
            value && !isNaN(value) && setShibBalance(formatStakedAmount(value))
        })
    }, [shibBury])

    const leashBury = useBury({
        tokenType: 'Leash',
        tokenAddress: chainId ? SHIBASWAP_LEASH_TOKEN_ADDRESS[chainId] : ''
    })
    useEffect(() => {
        leashBury?.stakedBalance().then(value => {
            value && !isNaN(value) && setLeashBalance(formatStakedAmount(value))
        })
    }, [leashBury])
    const boneBury = useBury({ tokenType: 'Bone', tokenAddress: chainId ? SHIBASWAP_BONE_TOKEN_ADDRESS[chainId] : '' })
    useEffect(() => {
        boneBury?.stakedBalance().then(value => {
            value && !isNaN(value) && setBoneBalance(formatStakedAmount(value))
        })
    }, [boneBury])

    const { bonePrice } = usePrices()

    const buryShibAddress = chainId ? SHIBASWAP_BURY_SHIB_ADDRESS[chainId] : ''
    const buryLeashAddress = chainId ? SHIBASWAP_BURY_LEASH_ADDRESS[chainId] : ''
    const buryBoneAddress = chainId ? SHIBASWAP_BURY_BONE_ADDRESS[chainId] : ''

    const shibData = useSWR(`{bury(id: "${buryShibAddress.toLowerCase()}") {shibStakedUSD}}`, fetcherShib)
    const leashData = useSWR(`{bury(id: "${buryLeashAddress.toLowerCase()}") {leashStakedUSD}}`, fetcherLeash)
    const boneData = useSWR(`{bury(id: "${buryBoneAddress.toLowerCase()}") {boneStakedUSD}}`, fetcherBone)

    const [shibBoneApr, setShibBoneApr] = useState<any>()
    const [leashBoneApr, setLeashBoneApr] = useState<any>()
    const [boneBoneApr, setBoneBoneApr] = useState<any>()

    useEffect(() => {
        const fetchData1 = () => {
            if (shibData?.data?.bury?.shibStakedUSD && parseFloat(bonePrice) > 0) {
                const apr =
                    ((0.6 * parseFloat(bonePrice)) / shibData?.data?.bury?.shibStakedUSD) * 277 * 24 * 30 * 12 * 100
                setShibBoneApr(calculate_apy(apr))
            }
        }
        fetchData1()
    }, [shibData?.data?.bury?.shibStakedUSD, bonePrice])

    useEffect(() => {
        const fetchData2 = () => {
            if (leashData?.data?.bury?.leashStakedUSD && parseFloat(bonePrice) > 0) {
                const apr =
                    ((0.2 * parseFloat(bonePrice)) / leashData?.data?.bury?.leashStakedUSD) * 277 * 24 * 30 * 12 * 100
                setLeashBoneApr(calculate_apy(apr))
            }
        }
        fetchData2()
    }, [leashData?.data?.bury?.leashStakedUSD, bonePrice])

    useEffect(() => {
        const fetchData3 = () => {
            if (boneData?.data?.bury?.boneStakedUSD && parseFloat(bonePrice) > 0) {
                const apr =
                    ((0.2 * parseFloat(bonePrice)) / boneData?.data?.bury?.boneStakedUSD) * 277 * 24 * 30 * 12 * 100
                setBoneBoneApr(calculate_apy(apr))
            }
        }
        fetchData3()
    }, [boneData?.data?.bury?.boneStakedUSD, bonePrice])

    return (
        <PageWrapper gap="lg" justify="center">
            <Helmet>
                <title>BURY | ShibaSwap</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="container pb-5 m-auto bury-container relative mobile-container" style={{ padding: '1rem' }}>
                <InnerDiv>
                    <BackButton defaultRoute="" className="back_button" />
                    <Row className="p-0">
                        <Col>
                            <CardHeading>BURY</CardHeading>
                        </Col>
                        <Col>
                            <ImageDiv>
                                <img height={40} width={40} src="./images/home/bury_icon.svg" />
                            </ImageDiv>
                        </Col>
                    </Row>
                    <CardsubTitle className="subtitle -mt-2">Shibas love to bury what they find</CardsubTitle>
                    <div
                        className="read-more mt-3 font-medium no-underline not-italic"
                        onClick={() => {
                            setShowModal(true)
                        }}
                    >
                        <div className="tooltips">
                            <QuestionWrapper className="float-left">
                                <Question size={14} />
                            </QuestionWrapper>
                            <span className="hebbo-font" style={{ fontSize: '14px' }}>
                                Read more about burying tokens
                            </span>
                        </div>
                    </div>
                    <div className="row mt-8 mb-8 px-20 bury_px">
                        <div className="col-12 col-md-6 col-lg-4">
                            <VCard
                                {...props}
                                url="/bury/shib"
                                name="BONE APY"
                                coming={shibBoneApr ? shibBoneApr.toFixed(2) + '%' : '-'}
                                value={shibBalance}
                                buttonText="Bury Shib"
                                disabled={false}
                                // icon="/images/dig_icon.svg"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 bury_px">
                            <VCard
                                {...props}
                                url="/bury/leash"
                                name="BONE APY"
                                coming={leashBoneApr ? leashBoneApr.toFixed(2) + '%' : '-'}
                                value={leashBalance}
                                buttonText="Bury Leash"
                                disabled={false}
                                // icon="/images/bury_icon.svg"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 bury_px">
                            <VCard
                                {...props}
                                url="/bury/bone"
                                name="BONE APY"
                                coming={boneBoneApr ? boneBoneApr.toFixed(2) + '%' : '-'}
                                value={boneBalance}
                                buttonText="Bury Bone"
                                disabled={false}
                                // icon="/images/fetch_icon.svg"
                            />
                        </div>
                        {/* <div className="col-12 col-md-6 col-lg-3">
                            <VCard
                                {...props}
                                url="/stake"
                                name="APY"
                                value="0,00000"
                                buttonText="Coming Soon"
                                tokenAddress={""}
                                buryTokenAddress={""}
                                tokenType=""
                                disabled={true}
                                // icon="/images/question-mark.png"
                            />
                        </div> */}
                    </div>
                </InnerDiv>
            </div>
            <BuryModal isOpen={showModal} onDismiss={handleDismiss} />
        </PageWrapper>
    )
}
