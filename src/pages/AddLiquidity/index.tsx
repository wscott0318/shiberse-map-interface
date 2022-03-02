import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH, ChainId, SHIBASWAP_SHIB_TOKEN_ADDRESS, SHIBASWAP_LEASH_TOKEN_ADDRESS, LEASH, SHIBA_INU } from '@shibaswap/sdk'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween, RowFlat } from '../../components/Row'
import styled from 'styled-components'
import { CardHeading, Col, CardsubTitle } from '../Home/Card'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import {
    calculateGasMargin,
    calculateSlippageAmount,
    getShibaSwapRouterAddress,
    getShibaSwapRouterContract
} from '../../utils'
import { currencyId } from '../../utils/currencyId'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import getCurrencyQuotesData from '../../utils/getCurrencyQuotesData'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { PoolPriceBar } from './PoolPriceBar'
import Alert from '../../components/Alert'
import { Helmet } from 'react-helmet'
import '../../assets/styles/liquidity.scss'
import DigImage from '../../assets/images/home/dig_icon.svg'
import { constants } from 'os'
import Settings from '../../components/Settings'
import Chart from '../../components/Chart'
import Table from '../../components/Table'
import ToggleButton from '../../components/Toggle/ToggleButton'
import TokenButton from '../../components/Toggle/TokenButton'
import {prepareLineChartOptions, prepareCandleChartOptions} from '../../components/Chart/chartOptions'
import { MenuFlyout, StyledMenu, StyledMenuButton } from 'components/StyledMenu'
import { BackButton } from '../../components/Button'
import DigModal from '../AddLiquidity/DigModal'
import { HelpCircle as Question } from 'react-feather'

const StyledMenuIcon = styled(Settings)`
    height: 20px;
    width: 20px;
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
export default function AddLiquidity({
    match: {
        params: { currencyIdA, currencyIdB }
    },
    history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
    const { account, chainId, library } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

    const currencyA = useCurrency(currencyIdA)
    const currencyB = useCurrency(currencyIdB)

    const oneCurrencyIsWETH = Boolean(
        chainId &&
            ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
                (currencyB && currencyEquals(currencyB, WETH[chainId])))
    )

    const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

    const expertMode = useIsExpertMode()

    const [showModal, setShowModal] = useState<boolean>(false)

    const handleDismiss = useCallback(() => {
        setShowModal(false)
    }, [setShowModal])
    // mint state
    const { independentField, typedValue, otherTypedValue } = useMintState()
    const {
        dependentField,
        currencies,
        pair,
        pairState,
        currencyBalances,
        parsedAmounts,
        price,
        noLiquidity,
        liquidityMinted,
        poolTokenPercentage,
        error
    } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

    const isValid = !error

    // modal and loading
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

    // Chart data
    const [chartDataLoading, setChartDataLoading] = useState<boolean>(true)
    const [lineChartOptions, setLineChartOptions] = useState<any>('')
    const [candleChartOptions, setCandleChartOptions] = useState<any>('')
    const [chartMode, setChartMode] = useState<string>('line')
    const [tokenButton, setTokenButton] = useState<string>('SHIB')

    useEffect( () => {
        chartToken(SHIBASWAP_SHIB_TOKEN_ADDRESS[ChainId.MAINNET]);
    },[])

    // txn values
    const deadline = useTransactionDeadline() // custom from users settings
    const [allowedSlippage] = useUserSlippageTolerance() // custom from users
    const [txHash, setTxHash] = useState<string>('')

    const handleTokenButtonClick = (tokenName: string) => {
        // console.log("tokenName", tokenName);
        setTokenButton(tokenName);
    }

    // get formatted amounts
    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
    }

    // get the max amounts user can add
    const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmountSpend(currencyBalances[field])
            }
        },
        {}
    )

    const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
            }
        },
        {}
    )

    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_A],
        getShibaSwapRouterAddress(chainId)
    )
    const [approvalB, approveBCallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_B],
        getShibaSwapRouterAddress(chainId)
    )

    const [approvalSubmittedA, setApprovalSubmittedA] = useState<boolean>(false)
    useEffect(() => {
        if (approvalA === ApprovalState.PENDING) {
            setApprovalSubmittedA(true)
        }
    }, [approvalA, approvalSubmittedA])

    const [approvalSubmittedB, setApprovalSubmittedB] = useState<boolean>(false)
    useEffect(() => {
        if (approvalB === ApprovalState.PENDING) {
            setApprovalSubmittedB(true)
        }
    }, [approvalB, approvalSubmittedB])

    const addTransaction = useTransactionAdder()

    const chartToken = (baseCurrency:string) => {
        getCurrencyQuotesData(baseCurrency).then((data) => {
            setLineChartOptions(prepareLineChartOptions(data))
            setCandleChartOptions(prepareCandleChartOptions(data))
            setChartDataLoading(false)
        })
    }

    async function onAdd() {
        if (!chainId || !library || !account) return
        const router = getShibaSwapRouterContract(chainId, library, account)
        const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
        if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
            return
        }

        const amountsMin = {
            [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
            [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
        }

        let estimate,
            method: (...args: any) => Promise<TransactionResponse>,
            args: Array<string | string[] | number>,
            value: BigNumber | null
        if (currencyA === ETHER || currencyB === ETHER) {
            const tokenBIsETH = currencyB === ETHER
            estimate = router.estimateGas.addLiquidityETH
            method = router.addLiquidityETH
            args = [
                wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
                (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
                amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
                amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
                account,
                deadline.toHexString()
            ]
            value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
        } else {
            estimate = router.estimateGas.addLiquidity
            method = router.addLiquidity
            args = [
                wrappedCurrency(currencyA, chainId)?.address ?? '',
                wrappedCurrency(currencyB, chainId)?.address ?? '',
                parsedAmountA.raw.toString(),
                parsedAmountB.raw.toString(),
                amountsMin[Field.CURRENCY_A].toString(),
                amountsMin[Field.CURRENCY_B].toString(),
                account,
                deadline.toHexString()
            ]
            value = null
        }

        setAttemptingTxn(true)
        await estimate(...args, value ? { value } : {})
            .then(estimatedGasLimit =>
                method(...args, {
                    ...(value ? { value } : {}),
                    gasLimit: calculateGasMargin(estimatedGasLimit)
                }).then(response => {
                    setAttemptingTxn(false)

                    addTransaction(response, {
                        summary:
                            'Add ' +
                            parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
                            ' ' +
                            currencies[Field.CURRENCY_A]?.getSymbol(chainId) +
                            ' and ' +
                            parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
                            ' ' +
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId)
                    })

                    setTxHash(response.hash)

                    ReactGA.event({
                        category: 'Liquidity',
                        action: 'Add',
                        label: [
                            currencies[Field.CURRENCY_A]?.getSymbol(chainId),
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId)
                        ].join('/')
                    })
                })
            )
            .catch(error => {
                setAttemptingTxn(false)
                // we only care if the error is something _other_ than the user rejected the tx
                if (error?.code !== 4001) {
                    console.error(error)
                }
            })
    }

    const modalHeader = () => {
        return noLiquidity ? (
            <AutoColumn gap="20px">
                <LightCard mt="20px" borderRadius="20px">
                    <RowFlat>
                        <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
                            {currencies[Field.CURRENCY_A]?.getSymbol(chainId) +
                                '/' +
                                currencies[Field.CURRENCY_B]?.getSymbol(chainId)}
                        </Text>
                        <DoubleCurrencyLogo
                            currency0={currencies[Field.CURRENCY_A]}
                            currency1={currencies[Field.CURRENCY_B]}
                            size={30}
                        />
                    </RowFlat>
                </LightCard>
            </AutoColumn>
        ) : (
            <AutoColumn gap="20px" className="modal-confirm">
                <DoubleCurrencyLogo
                        currency0={currencies[Field.CURRENCY_A]}
                        currency1={currencies[Field.CURRENCY_B]}
                        size={30}
                    />
                <RowFlat >
                
                    <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
                        {liquidityMinted?.toSignificant(6)}
                    </Text>
                    
                </RowFlat>
                <Row>
                    <Text fontSize="24px">
                        {currencies[Field.CURRENCY_A]?.getSymbol(chainId) +
                            '/' +
                            currencies[Field.CURRENCY_B]?.getSymbol(chainId) +
                            ' Pool Tokens'}
                    </Text>
                </Row>
                <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>
                    {`Output is estimated. If the price changes by more than ${allowedSlippage /
                        100}% your transaction will revert.`}
                </TYPE.italic>
            </AutoColumn>
        )
    }

    const modalBottom = () => {
        return (
            <ConfirmAddModalBottom
                price={price}
                currencies={currencies}
                parsedAmounts={parsedAmounts}
                noLiquidity={noLiquidity}
                onAdd={onAdd}
                poolTokenPercentage={poolTokenPercentage}
            />
        )
    }

    const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencies[
        Field.CURRENCY_A
    ]?.getSymbol(chainId)} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[
        Field.CURRENCY_B
    ]?.getSymbol(chainId)}`

    const handleCurrencyASelect = useCallback(
        (currencyA: Currency) => {
            const newCurrencyIdA = currencyId(currencyA)
            if (newCurrencyIdA === currencyIdB) {
                history.push(`/add/${currencyIdB}/${currencyIdA}`)
            } else {
                history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
            }
        },
        [currencyIdB, history, currencyIdA]
    )
    const handleCurrencyBSelect = useCallback(
        (currencyB: Currency) => {
            const newCurrencyIdB = currencyId(currencyB)
            if (currencyIdA === newCurrencyIdB) {
                if (currencyIdB) {
                    history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
                } else {
                    history.push(`/add/${newCurrencyIdB}`)
                }
            } else {
                history.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
            }
        },
        [currencyIdA, history, currencyIdB]
    )

    const handleDismissConfirmation = useCallback(() => {
        setShowConfirm(false)
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onFieldAInput('')
        }
        setTxHash('')
    }, [onFieldAInput, txHash])

    const isCreate = history.location.pathname.includes('/create')

    const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

    const digSectionHeight = document.getElementById('digSection')?.clientHeight;
    

    let chartSectionHeight = digSectionHeight?digSectionHeight*0.488:276;
    document.getElementById('chart-container')?.setAttribute("style",`min-height:${chartSectionHeight}px;height:${chartSectionHeight}px`);
    document.getElementById('tableSection')?.setAttribute("style",`min-height:${chartSectionHeight}px;height:${chartSectionHeight}px`);
    return (
        <>
            <Helmet>
                <title>DIG | ShibaSwap</title>
                <meta name="description" content="" />
            </Helmet>
            <TransactionConfirmationModal
                isOpen={showConfirm}
                onDismiss={handleDismissConfirmation}
                attemptingTxn={attemptingTxn}
                hash={txHash}
                content={() => (
                    <ConfirmationModalContent
                        title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
                        onDismiss={handleDismissConfirmation}
                        topContent={modalHeader}
                        bottomContent={modalBottom}
                    />
                )}
                pendingText={pendingText}
            />
            {/* className="w-full max-w-2xl" */}
            <div className="dig-container container my-auto pb-10">
                <div className="dig" id="digSection">
                <BackButton defaultRoute="/pool" className="back_button"/>
                    <div className="wrapper mt-0 contents">
                        <div className="dig--inner">
                            <div className="left" style={{ marginRight: '0rem' }}>
                                <div className="inner">
                                    <div className="top">
                                        <div className="top-left">
                                            <CardHeading>DIG</CardHeading>
                                            <div className="description" style={{ margin: '10px 0px' }}>
                                                Get BONES in our Liquidity Pool
                                            </div>
                                            <div className="read-more mt-5 font-medium no-underline not-italic" onClick={() => {
                                                setShowModal(true)
                                            }}>
                                            <div className="tooltips">
                                                <QuestionWrapper className="float-left">
                                                    <Question size={14} />
                                                </QuestionWrapper>
                                                <span className="hebbo-font">Read more about providing liquidity</span>
                                            </div>
                                            </div>
                                        </div>

                                        {/* <Settings /> */}
                                        <div className="image-div mt-2">
                                            <img src={DigImage} width="40" height="40" />
                                        </div>
                                    </div>

                                    <div className="bottom" style={{ marginTop: '2rem' }}>
                                        <div className="swaparea">
                                        <div className="settings_dig">
                                            <StyledMenuIcon />
                                        </div>
                                            <CurrencyInputPanel
                                                customStyle="pd-0"
                                                value={formattedAmounts[Field.CURRENCY_A]}
                                                onUserInput={onFieldAInput}
                                                onMax={() => {
                                                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                                                }}
                                                onCurrencySelect={handleCurrencyASelect}
                                                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                                                currency={currencies[Field.CURRENCY_A]}
                                                currenciesAB={currencies}
                                                type={Field.CURRENCY_A}
                                                id="add-liquidity-input-tokena"
                                                showCommonBases
                                            />
                                            <ColumnCenter>
                                                <Plus size="16" color={theme.text2} />
                                            </ColumnCenter>
                                            <CurrencyInputPanel
                                                customStyle="pd-0"
                                                value={formattedAmounts[Field.CURRENCY_B]}
                                                onUserInput={onFieldBInput}
                                                onCurrencySelect={handleCurrencyBSelect}
                                                onMax={() => {
                                                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                                                }}
                                                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                                                currency={currencies[Field.CURRENCY_B]}
                                                currenciesAB={currencies}
                                                type={Field.CURRENCY_B}
                                                id="add-liquidity-input-tokenb"
                                                showCommonBases
                                            />
                                            <hr />
                                            {currencies[Field.CURRENCY_A] &&
                                                currencies[Field.CURRENCY_B] &&
                                                pairState !== PairState.INVALID && (
                                                    <>
                                                        <div className="poolPriceBar">
                                                            <RowBetween padding="1rem">
                                                                <span>
                                                                    {noLiquidity ? 'Initial prices' : 'Prices'} and pool
                                                                    share
                                                                </span>
                                                            </RowBetween>{' '}
                                                            <PoolPriceBar
                                                                currencies={currencies}
                                                                poolTokenPercentage={poolTokenPercentage}
                                                                noLiquidity={noLiquidity}
                                                                price={price}
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                            

                                            {addIsUnsupported ? (
                                                <ButtonPrimary disabled={true} className="mt-1 mb-1">
                                                    <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
                                                </ButtonPrimary>
                                            ) : 
                                                
                                            <React.Fragment>
                                            {
                                                pair && !noLiquidity && pairState !== PairState.INVALID && (
                                                    <div className="w-full max-w-2xl flex flex-col pdy-10">
                                                        <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                                                    </div>
                                                )
                                            }

                                            {
                                                !account ? (
                                                    <ButtonPrimary onClick={toggleWalletModal} className="mt-1 mb-1">
                                                        Connect Wallet
                                                    </ButtonPrimary>
                                                ) : (
                                                    <AutoColumn gap={'md'}>
                                                        {(approvalA === ApprovalState.NOT_APPROVED ||
                                                            approvalA === ApprovalState.PENDING ||
                                                            approvalB === ApprovalState.NOT_APPROVED ||
                                                            approvalB === ApprovalState.PENDING) &&
                                                            isValid && (
                                                                <RowBetween>
                                                                    {approvalA !== ApprovalState.APPROVED && (
                                                                        <ButtonPrimary
                                                                            className="mt-1 mb-1"
                                                                            onClick={approveACallback}
                                                                            disabled={approvalA !== ApprovalState.NOT_APPROVED || approvalSubmittedA}
                                                                            width={
                                                                                approvalB !== ApprovalState.APPROVED
                                                                                    ? '48%'
                                                                                    : '98%'
                                                                            }
                                                                        >
                                                                            {(approvalA !== ApprovalState.NOT_APPROVED || approvalSubmittedA) ? (
                                                                                <Dots>
                                                                                    Approving{' '}
                                                                                    {currencies[
                                                                                        Field.CURRENCY_A
                                                                                    ]?.getSymbol(chainId)}
                                                                                </Dots>
                                                                            ) : (
                                                                                'Approve ' +
                                                                                currencies[Field.CURRENCY_A]?.getSymbol(
                                                                                    chainId
                                                                                )
                                                                            )}
                                                                        </ButtonPrimary>
                                                                    )}
                                                                    {approvalB !== ApprovalState.APPROVED && (
                                                                        <ButtonPrimary
                                                                            className="mt-1 mb-1"
                                                                            onClick={approveBCallback}
                                                                            disabled={approvalB !== ApprovalState.NOT_APPROVED || approvalSubmittedB}
                                                                            width={
                                                                                approvalA !== ApprovalState.APPROVED
                                                                                    ? '48%'
                                                                                    : '98%'
                                                                            }
                                                                        >
                                                                            {(approvalB !== ApprovalState.NOT_APPROVED || approvalSubmittedB) ? (
                                                                                <Dots>
                                                                                    Approving{' '}
                                                                                    {currencies[
                                                                                        Field.CURRENCY_B
                                                                                    ]?.getSymbol(chainId)}
                                                                                </Dots>
                                                                            ) : (
                                                                                'Approve ' +
                                                                                currencies[Field.CURRENCY_B]?.getSymbol(
                                                                                    chainId
                                                                                )
                                                                            )}
                                                                        </ButtonPrimary>
                                                                    )}
                                                                </RowBetween>
                                                            )}
                                                        <ButtonError
                                                            className="mt-1 mb-1"
                                                            onClick={() => {
                                                                expertMode ? onAdd() : setShowConfirm(true)
                                                            }}
                                                            disabled={
                                                                !isValid ||
                                                                approvalA !== ApprovalState.APPROVED ||
                                                                approvalB !== ApprovalState.APPROVED
                                                            }
                                                            error={
                                                                !isValid &&
                                                                !!parsedAmounts[Field.CURRENCY_A] &&
                                                                !!parsedAmounts[Field.CURRENCY_B]
                                                            }
                                                        >
                                                            <Text>
                                                                <span className="fontFamily font-bold"
                                                                >
                                                                    {error ?? 'Supply'}
                                                                </span>
                                                            </Text>
                                                        </ButtonError>
                                                    </AutoColumn>
                                                )
                                            }
                                             </React.Fragment> 
                                            }
                                            
                                              
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="data-container">
                    <div id="chart-container" className="graph-container">
                        {/* <div className="toggle-btn">
                            <TokenButton
                                toggle={() => {
                                    chartToken(SHIBASWAP_SHIB_TOKEN_ADDRESS[ChainId.MAINNET]);
                                    handleTokenButtonClick('SHIB')
                                }}
                                name="SHIB"
                                disabled={tokenButton !== 'SHIB'}
                            />
                            <TokenButton
                                toggle={() => {
                                    chartToken(SHIBASWAP_LEASH_TOKEN_ADDRESS[ChainId.MAINNET]);
                                    handleTokenButtonClick('LEASH')
                                }}
                                name="LEASH"
                                disabled={tokenButton !== 'LEASH'}
                            />
                            <TokenButton
                                toggle={() => {
                                    chartToken(SHIBASWAP_BONE_TOKEN_ADDRESS[chainId ? chainId: 1]);
                                    handleTokenButtonClick('BONE')
                                }}
                                name="BONE"
                                disabled={tokenButton !== 'BONE'}
                            />
                            <ToggleButton toggle={() => setChartMode(chartMode === 'line' ? 'candle' : 'line')} />
                        </div>
                        {chartDataLoading ? (
                            'Loading'
                        ) : chartMode === 'line' ? (
                            <Chart options={lineChartOptions} />
                        ) : (
                            <Chart options={candleChartOptions} />
                        )} */}
                        <div style={{textAlign:"center", height:"100%"}}>
                            <span style={{fontSize:"larger", position:"relative", top:"50%"}}>Coming Soon</span>
                        </div>
                    </div>
                    <div id="tableSection" className="total-container">
                        <div style={{textAlign:"center", height:"100%"}}>
                            <span style={{fontSize:"larger", position:"relative", top:"50%"}}>Coming Soon</span>
                        </div>
                        {/* <Table/> */}
                    </div>
                </div>
            </div>

            {!addIsUnsupported ? (
                // pair && !noLiquidity && pairState !== PairState.INVALID ? (
                //     <div className="w-full max-w-2xl flex flex-col" style={{ marginTop: '50px', marginBottom: '30px' }}>
                //         <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                //     </div>
                // ) : 
                null
            ) : (
                <UnsupportedCurrencyFooter
                    show={addIsUnsupported}
                    currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
                />
            )}


            <DigModal
                isOpen={showModal}
                onDismiss={handleDismiss}
            />
        </>
    )
}

