import { AddressZero } from '@ethersproject/constants'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { JSBI } from '@shibaswap/sdk'
import { useShibaSwapUniV2FetchContract } from 'hooks/useContract'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import Circle from '../../assets/images/blue-loader.svg'
import { ButtonConfirmed } from '../../components/ButtonLegacy'
import { LightCard, LightCardCustom } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { FixedHeightRow } from '../../components/PositionCard'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow, RowFixed } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useMigrateState, { MigrateState } from '../../hooks/useMigrateState'
import { BackArrow, CloseIcon, CustomLightSpinner, TYPE } from '../../theme'
import LPToken from '../../types/LPToken'
import MetamaskError from '../../types/MetamaskError'
import AppBody from '../AppBody'
import { EmptyState } from '../MigrateV1/EmptyState'
import { MaxButton } from '../Pool/styleds'
import { Helmet } from 'react-helmet'
import { FACTORY_ADDRESS as SUSHI_FACTORY_ADDRESS } from '@sushiswap/sdk'
import { FACTORY_ADDRESS as UNI_FACTORY_ADDRESS } from '@uniswap/sdk'
import { CardHeading, Col, CardsubTitle } from '../Home/Card'
import { BackButton } from '../../components/Button'

const Border = styled.div`
    width: 100%;
    height: 1px;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    background-color: ${({ theme }) => theme.bg2};
`

const ZERO = JSBI.BigInt(0)

const AmountInput = ({ state }: { state: MigrateState }) => {
    const onPressMax = useCallback(() => {
        if (state.selectedLPToken) {
            let balance = state.selectedLPToken.balance.raw
            if (state.selectedLPToken.address === AddressZero) {
                // Subtract 0.01 ETH for gas fee
                const fee = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16))
                balance = JSBI.greaterThan(balance, fee) ? JSBI.subtract(balance, fee) : ZERO
            }

            state.setAmount(formatUnits(balance.toString(), state.selectedLPToken.decimals))
        }
    }, [state])

    useEffect(() => {
        if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
            state.setAmount('')
        }
    }, [state])

    if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
        return <span />
    }

    return (
        <>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>Amount of Tokens</TYPE.mediumHeader>
            <LightCardCustom>
                <FixedHeightRow>
                    <NumericalInput value={state.amount} onUserInput={val => state.setAmount(val)} />
                    <MaxButton className="m-0 px-4 py-1" style={{ backgroundColor: "#292c37", color: "white", borderColor: "white" }} onClick={onPressMax} width="10px">
                        MAX
                    </MaxButton>
                </FixedHeightRow>
            </LightCardCustom>
            <Border />
        </>
    )
}

interface PositionCardProps {
    lpToken: LPToken
    onClick: (lpToken: LPToken) => void
    onDismiss: () => void
    isSelected: boolean
    updating: boolean
    isSushi?: boolean
}

export const AppBodySection = styled.div`
    
    box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #292c37;
    margin: auto;
`;

const LPTokenSelect = ({ lpToken, onClick, onDismiss, isSelected, updating, isSushi }: PositionCardProps) => {
    const theme = useContext(ThemeContext)

    return (
        <LightCardCustom>
            <AutoColumn gap="12px">
                <FixedHeightRow  className="fetch-card">
                    <RowFixed onClick={() => onClick(lpToken)}>
                        <DoubleCurrencyLogo
                            currency0={lpToken.tokenA}
                            currency1={lpToken.tokenB}
                            margin={true}
                            size={20}
                        />
                        <TYPE.body fontWeight={500} style={{ marginLeft: '' }}>
                            {`${lpToken.tokenA.symbol}/${lpToken.tokenB.symbol}`}
                        </TYPE.body>
                        {!isSushi ? <Text
                            fontSize={12}
                            fontWeight={500}
                            ml="0.5rem"
                            px="0.75rem"
                            py="0.25rem"
                            style={{ borderRadius: '1rem' }}
                            backgroundColor={theme.yellow1}
                            color={'black'}
                        >
                            V2
                        </Text> : <div></div>}
                    </RowFixed>
                    {
                    // updating ? (
                    //     <CustomLightSpinner src={Circle} alt="loader" size="20px" />
                    // ) : 
                    isSelected ? (
                        <CloseIcon onClick={onDismiss} />
                    ) : (
                        <ChevronRight onClick={() => onClick(lpToken)} />
                    )}
                </FixedHeightRow>
            </AutoColumn>
        </LightCardCustom>
    )
}

const MigrateModeSelect = ({ state }: { state: MigrateState }) => {
    const unsetMode = (mode: any) => {
        state.setMode(mode)
    }

    const items = [
        {
            key: 'permit',
            text: 'Non-hardware Wallet',
            description: 'Find your Liquidity Token in your wallet'
        },
        {
            key: 'approve',
            text: 'Hardware Wallet',
            description: 'You need to first approve LP tokens and then migrate it'
        }
    ]

    return (
        <>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>Wallet Type</TYPE.mediumHeader>
            {items.reduce((acc: any, { key, text, description }: any) => {
                if (state.mode === undefined || key === state.mode)
                    acc.push(
                        <LightCardCustom key={key}>
                            <AutoColumn gap="12px" className="relative fetch-card">
                                <RowFixed >
                                    <AutoRow onClick={() => state.setMode(key)}>
                                        <AutoRow marginBottom="2px">
                                            <TYPE.body fontWeight={500}>{text}</TYPE.body>
                                        </AutoRow>
                                        <AutoRow>
                                            <TYPE.darkGray fontSize=".75rem" className="mr-4">{description}</TYPE.darkGray>
                                        </AutoRow>
                                    </AutoRow>
                                    {key === state.mode ? (
                                        <CloseIcon onClick={() => unsetMode(undefined)} className="absolute right-0"/>
                                    ) : (
                                        <ChevronRight onClick={() => state.setMode(key)} className="absolute right-0"/>
                                    )}
                                </RowFixed>
                            </AutoColumn>
                        </LightCardCustom>
                    )
                return acc
            }, [])}
            <Border />
        </>
    )
}

const MigrateButtons = ({ state, isSushi }: { state: MigrateState, isSushi: boolean }) => {
    const [error, setError] = useState<MetamaskError>({})
    // const sushiRollContract = useSushiRollContract()
    const shibaSwapUniV2FetchContract = useShibaSwapUniV2FetchContract()
    const [approval, approve] = useApproveCallback(state.selectedLPToken?.balance, shibaSwapUniV2FetchContract?.address)
    const noLiquidityTokens = !!state.selectedLPToken?.balance && state.selectedLPToken?.balance.equalTo(ZERO)
    const isButtonDisabled = !state.amount

    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
    useEffect(() => {
        if (approval === ApprovalState.PENDING) {
            setApprovalSubmitted(true)
        }
    }, [approval, approvalSubmitted])

    useEffect(() => {
        setError({})
    }, [state.selectedLPToken])

    if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
        return <span />
    }

    const insufficientAmount = JSBI.lessThan(
        state.selectedLPToken.balance.raw,
        JSBI.BigInt(parseUnits(state.amount || '0', state.selectedLPToken.decimals).toString())
    )

    const onPress = async () => {
        setError({})
        try {
            await state.onMigrate()
            state.setAmount('')
        } catch (e) {
            setError(e)
        }
    }

    return (
        <AutoColumn gap="20px">
            <LightCardCustom>
                <AutoRow style={{ flex: '1', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <TYPE.body fontSize=".875rem" fontWeight={500}>
                        {state.selectedLPToken.symbol}
                    </TYPE.body>
                    <TYPE.body fontSize=".875rem" fontWeight={500}>
                        {state.amount}
                    </TYPE.body>
                </AutoRow>
                {insufficientAmount ? (
                    <AutoColumn gap="12px" style={{ flex: '1' }}>
                        <TYPE.darkGray fontSize=".875rem" style={{ textAlign: 'center' }}>
                            Insufficient Balance
                        </TYPE.darkGray>
                    </AutoColumn>
                ) : state.loading ? (
                    <Dots>Loading</Dots>
                ) : (
                    <AutoRow>
                        {state.mode === 'approve' && (
                            <AutoColumn gap="12px" style={{ flex: '1', marginRight: 12 }}>
                                <ButtonConfirmed
                                    onClick={approve}
                                    confirmed={approval === ApprovalState.APPROVED}
                                    disabled={approval !== ApprovalState.NOT_APPROVED || isButtonDisabled || approvalSubmitted}
                                    altDisabledStyle={approval === ApprovalState.PENDING}
                                >
                                    {approval === ApprovalState.APPROVED ? (
                                        'Approved'
                                    ) : (approval === ApprovalState.PENDING || approvalSubmitted) ? (
                                        <Dots>Approving</Dots>
                                    ) : (
                                        'Approve'
                                    )}
                                </ButtonConfirmed>
                            </AutoColumn>
                        )}
                        <AutoColumn gap="12px" style={{ flex: '1' }}>
                            <ButtonConfirmed
                                disabled={
                                    noLiquidityTokens ||
                                    state.isMigrationPending ||
                                    (state.mode === 'approve' && approval !== ApprovalState.APPROVED) ||
                                    isButtonDisabled
                                }
                                onClick={onPress}
                            >
                                {state.isMigrationPending ? <Dots>Migrating</Dots> : 'Migrate'}
                            </ButtonConfirmed>
                        </AutoColumn>
                    </AutoRow>
                )}
                {error.message && error.code !== 4001 && (
                    <TYPE.body color="red" fontWeight={500} fontSize="0.875rem" marginTop="1.5rem" textAlign="center">
                        {error.message}
                    </TYPE.body>
                )}
            </LightCardCustom>
            <TYPE.darkGray fontSize="0.75rem" textAlign="center">
                {`Your ${isSushi ? "Sushiswap" : "Uniswap"} ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity will become ShibaSwap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity.`}
            </TYPE.darkGray>
        </AutoColumn>
    )
}

export const filterLiquidityPair = (state: MigrateState, pair: any) : LPToken[] => {
    const filtered = state.lpTokens.filter((lp)=>{
        if(pair.token0.id.toLowerCase() === lp.tokenA.address.toLowerCase() || pair.token0.id.toLowerCase() === lp.tokenB.address.toLowerCase()){
            if(pair.token1.id.toLowerCase() === lp.tokenA.address.toLowerCase() || pair.token1.id.toLowerCase() === lp.tokenB.address.toLowerCase()) 
                return true
        }
        return false
    })
    if(filtered.length > 0)return filtered
    return []
}

const UniswapLiquidityPairs = ({ state, title, isSushi, pair }: { state: MigrateState; title: string, isSushi: boolean, pair?: any }) => {
    let content: JSX.Element
    const onClick = useCallback(
        lpToken => {
            state.setAmount('')
            state.setSelectedLPToken(lpToken)
        },
        [state]
    )

    const onDismiss = useCallback(() => {
        state.setAmount('')
        state.setSelectedLPToken(undefined)
    }, [state])

    if (!state.mode) {
        content = <span />
    } else if (state.lpTokens.length === 0) {
        content = <EmptyState message="No V2 Liquidity found." />
    } else {
        const lps = pair? filterLiquidityPair(state, pair) : state.lpTokens
        content = (
            <>
                {lps? lps.reduce<JSX.Element[]>((acc, lpToken) => {
                    if (lpToken.balance && JSBI.greaterThan(lpToken.balance.raw, JSBI.BigInt(0))) {
                        acc.push(
                            <LPTokenSelect
                                lpToken={lpToken}
                                key={lpToken.address}
                                onClick={onClick}
                                onDismiss={onDismiss}
                                isSelected={state.selectedLPToken === lpToken}
                                updating={state.updatingLPTokens}
                                isSushi={isSushi}
                            />
                        )
                    }
                    return acc
                }, [])
                : [] 
                }
            </>
        )
    }

    return (
        <>
            <TYPE.mediumHeader style={{ justifySelf: 'flex-start' }}>{title}</TYPE.mediumHeader>
            {content}
            <Border />
        </>
    )
}

export const MigrateV2 = ({ pair }: { pair?: any }) => {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()
    const state = useMigrateState('unifetch', UNI_FACTORY_ADDRESS)

    const MigrateUniBlock = styled.div`
        display: 'inline-block';
        width: '45%';
        margintop: '30px';
        //border: 2px solid white;
        @media (max-width: 1400px) {
            width: auto;
            height: auto;
            margin: 0;
            margintop: '50px';
        }
        @media(max-width: 500px){
            width: 100%;
        }
        @media(max-width: 999px){
            margin-right:0px !important;
        }
    `

    return (
        <>
            <MigrateUniBlock style={{ marginRight: '20px'}} className="fetchCard first">
                <AppBodySection style={{ padding: 24 }} className="modal_fetch">
                    <AutoColumn gap="16px">
                        <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
                            {/* <BackArrow to="/pool" /> */}
                            {
                                pair?
                                <div>
                                    <TYPE.mediumHeader style={{ fontSize: "20px" }} fontWeight="700">Migrate {pair.token0.name}-{pair.token1.name} from Uniswap</TYPE.mediumHeader> 
                                    <div className="row" style={{marginBottom:"30px", marginTop:"10px"}}>
                                        <CardsubTitle className="subtitle -mt-2" style={{ fontSize: "15px" }}>&quot;This is a new feature with high slippage which can potentially result in losses during migration.&quot;</CardsubTitle>
                                    </div>
                                </div>
                                :
                                <TYPE.mediumHeader style={{ fontSize: "20px" }} fontWeight="700">Migrate Uniswap Liquidity</TYPE.mediumHeader>
                            }
                            {/* <div>
                                <QuestionHelper text="Migrate your Uniswap LP tokens to ShibaSwap LP tokens." />
                            </div> */}
                        </AutoRow>
                        {
                            !pair &&
                            <TYPE.white style={{ marginBottom: 8, fontWeight: 500, fontSize: "15px" }}>
                                For each pool shown below, click migrate to remove your liquidity from Uniswap and deposit
                                it into ShibaSwap.
                            </TYPE.white>
                        }

                        {!account ? (
                            <LightCardCustom padding="40px">
                                <TYPE.body color={theme.text3} textAlign="center">
                                    Connect to a wallet to view your V2 liquidity.
                                </TYPE.body>
                            </LightCardCustom>
                        ) : state.loading ? (
                            <LightCardCustom padding="40px">
                                <TYPE.body color={theme.text3} textAlign="center">
                                    <Dots>Loading</Dots>
                                </TYPE.body>
                            </LightCardCustom>
                        ) : (
                            <>
                                <MigrateModeSelect state={state} />
                                {pair ? 
                                    <UniswapLiquidityPairs state={state} title={'Your Uniswap Liquidity'} isSushi={false} pair={pair} />
                                    :
                                    <UniswapLiquidityPairs state={state} title={'Your Uniswap Liquidity'} isSushi={false} />
                                }
                                <AmountInput state={state} />
                                <MigrateButtons state={state} isSushi={false} />
                            </>
                        )}
                    </AutoColumn>
                </AppBodySection>
                <br></br>

            </MigrateUniBlock>
        </>
    )
}

export const MigrateV2Sushi = ({ pair }: { pair?: any }) => {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()
    const state = useMigrateState('sushifetch', SUSHI_FACTORY_ADDRESS[chainId ? chainId : 1])

    const MigrateSushiBlock = styled.div`
        display: 'inline-block';
        width: '45%';
        marginleft: '10px';

        @media (max-width: 1000px) {
            width: auto;
            height: auto;
            margin: 0;
        }
        @media(max-width: 500px){
            width: 100%;
        }
    `

    return (
        <>
            <MigrateSushiBlock>
                <AppBodySection style={{ padding: 24 }} className="fetchCard">
                    <AutoColumn gap="16px">
                        <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">

                        {
                                pair?
                                <TYPE.mediumHeader style={{ fontSize: "20px" }} fontWeight="700">Migrate {pair.token0.name}-{pair.token1.name} from Sushiswap</TYPE.mediumHeader> 
                                :
                                <TYPE.mediumHeader style={{ fontSize: "20px" }} fontWeight="700">Migrate Sushiswap Liquidity</TYPE.mediumHeader>
                            }
                            {/* <div>
                                <QuestionHelper text="Migrate your Sushiswap LP tokens to ShibaSwap LP tokens." />
                            </div> */}
                        </AutoRow>
                        {
                            !pair && 
                            <TYPE.white style={{ marginBottom: 8, fontWeight: 500, fontSize: "15px" }}>
                                For each pool shown below, click migrate to remove your liquidity from Sushiswap and deposit
                                it into ShibaSwap.
                            </TYPE.white>
                        }
                        

                        {!account ? (
                            <LightCardCustom padding="40px">
                                <TYPE.body color={theme.text3} textAlign="center">
                                    Connect to a wallet to view your V2 liquidity.
                                </TYPE.body>
                            </LightCardCustom>
                        ) : state.loading ? (
                            <LightCardCustom padding="40px">
                                <TYPE.body color={theme.text3} textAlign="center">
                                    <Dots>Loading</Dots>
                                </TYPE.body>
                            </LightCardCustom>
                        ) : (
                            <>
                                <MigrateModeSelect state={state} />
                                {pair? 
                                    <UniswapLiquidityPairs state={state} title="Your Sushiswap Liquidity" isSushi={true} pair={pair} />
                                    :
                                    <UniswapLiquidityPairs state={state} title="Your Sushiswap Liquidity" isSushi={true} />
                                }
                                <AmountInput state={state} />
                                <MigrateButtons state={state} isSushi={true} />
                            </>
                        )}
                    </AutoColumn>
                </AppBodySection>
            </MigrateSushiBlock>
        </>
    )
}

const MigrateParent = () => {
    const MigrationBlock = styled.div`
        display: inline-flex;
        width: auto;
        //border: 2px solid white;
        @media (max-width: 1000px) {
            display: block;
            text-align: left;
            height: auto;
            margin: 0;
        }
    `
    
    const CardHeading = styled.h1`
        font-size: 35px;
        text-align: left;
        font-weight: 700;
        color: #d5d5d5;
        margin: 0;
        font-family: "Metric - Bold";
        line-height: 1.5rem;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;
    `

    const ImageDiv = styled.div`
        box-shadow: inset 0 0 9px rgba(13, 13, 13, 0.43);
        border-radius: 10px;
        background-color: #1b1d2a;
        padding: 0.5rem;
    `
    const InnerDiv = styled.div`
        border-radius: 10px;    
    `
    const Row = styled.div`
        display: flex;
        margin: 0;
        width: 100%;
        justify-content: space-between;
        padding: 0 0 1rem 0;
    `
    const PageWrapper = styled(AutoColumn)`
        max-width: 100%;
        width: 100%;
        justify-items: flex-start;
        height: 100%; 
    `
    return (
        <PageWrapper gap="lg" justify="center" className="mobile-container fetching">
            <Helmet>
                    <title>FETCH | ShibaSwap</title>
                    <meta name="description" content="Migrate Uniswap anD Sushiswap LP tokens to ShibaSwap LP tokens" />
                </Helmet>
            <div
                className="container pb-5 m-auto fetch-container relative "
                style={{ padding: '1rem' }}
            >
                <InnerDiv>
                <BackButton defaultRoute="" className="back_button"/>
                    <Row className="p-0">
                        <Col>
                            <CardHeading>FETCH</CardHeading>
                        </Col>
                        <Col>
                            <ImageDiv>
                                <img height={40} width={40} src="./images/home/fetchicon.svg" />
                            </ImageDiv>
                        </Col>
                    </Row>
                    <CardsubTitle className="subtitle -mt-2">ShibaSwap will retrieve your Uniswap or SushiSwap LP Tokens</CardsubTitle>
                    <div className="row mt-5 mb-10">
                        <CardsubTitle className="subtitle -mt-2 no-underline not-italic" style={{ fontSize: "15px" }}>This is a new feature with high slippage which can potentially result in losses during migration. Please use with caution.</CardsubTitle>

                    </div>
                </InnerDiv>

                <div className="row" style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                    <MigrationBlock>
                        <MigrateV2 />
                        <MigrateV2Sushi />
                    </MigrationBlock>
                </div>
            </div>
        </PageWrapper>
    )
}

export default MigrateParent
