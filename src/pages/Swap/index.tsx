import { CurrencyAmount, JSBI, LEASH, SHIBA_INU, Token, Trade } from '@shibaswap/sdk'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { isTradeBetter } from 'utils/trades'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/ButtonLegacy'
import Card, { GreyCard } from '../../components/Card'
import Column, { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import Loader from '../../components/Loader'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import ProgressSteps from '../../components/ProgressSteps'
import { AutoRow, RowBetween } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import BetterTradeLink, { DefaultVersionLink } from '../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import SwapHeader from '../../components/swap/SwapHeader'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { getTradeVersion } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
    useDefaultsFromURLSearch,
    useDerivedSwapInfo,
    useSwapActionHandlers,
    useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from '../../state/user/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import swapArrowsAnimationData from '../../assets/animation/swap-arrows.json'
import Lottie from 'lottie-react'
import { Helmet } from 'react-helmet'
import { CardHeading, Col, CardsubTitle } from '../../pages/Home/Card'
import Table from '../../components/Table'
import Chart from '../../components/Chart'
import getCurrencyQuotesData from '../../utils/getCurrencyQuotesData'
import {prepareLineChartOptions, prepareCandleChartOptions} from '../../components/Chart/chartOptions'
import ToggleButton from '../../components/Toggle/ToggleButton'
import SwapImage from '../../assets/images/home/swap_icon.svg'
import DownArrow from '../../assets/images/right-down-arrow.svg'
import TokenButton from '../../components/Toggle/TokenButton'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH, ChainId, SHIBASWAP_SHIB_TOKEN_ADDRESS, SHIBASWAP_BONE_TOKEN_ADDRESS, SHIBASWAP_LEASH_TOKEN_ADDRESS, SHIBASWAP_BURY_BONE_ADDRESS, SHIBASWAP_BURY_SHIB_ADDRESS, SHIBASWAP_BURY_LEASH_ADDRESS} from '@shibaswap/sdk'
import Settings from '../../components/Settings'
import styled from 'styled-components'
import { BackButton } from '../../components/Button'
import SwapModal from '../Swap/SwapModal'

const StyledMenuIcon = styled(Settings)`
    height: 20px;
    width: 20px;
    `

export default function Swap() {
    const loadedUrlParams = useDefaultsFromURLSearch()

    // token warning stuff
    const [loadedInputCurrency, loadedOutputCurrency] = [
        useCurrency(loadedUrlParams?.inputCurrencyId),
        useCurrency(loadedUrlParams?.outputCurrencyId)
    ]
    const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
    const urlLoadedTokens: Token[] = useMemo(
        () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
        [loadedInputCurrency, loadedOutputCurrency]
    )
    const handleConfirmTokenWarning = useCallback(() => {
        setDismissTokenWarning(true)
    }, [])

    // dismiss warning if all imported tokens are in active lists
    const defaultTokens = useAllTokens()
    const importTokensNotInDefault =
        urlLoadedTokens &&
        urlLoadedTokens.filter((token: Token) => {
            return !Boolean(token.address in defaultTokens)
        })

    const { account, chainId } = useActiveWeb3React()
    const theme = useContext(ThemeContext)

    // toggle wallet when disconnected
    const toggleWalletModal = useWalletModalToggle()

    // for expert mode
    const toggleSettings = useToggleSettingsMenu()
    const [isExpertMode] = useExpertModeManager()

    // get custom setting values for user
    const [allowedSlippage] = useUserSlippageTolerance()

    // swap state
    const { independentField, typedValue, recipient } = useSwapState()
    const {
        v1Trade,
        v2Trade,
        currencyBalances,
        parsedAmount,
        currencies,
        inputError: swapInputError
    } = useDerivedSwapInfo()
    const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        typedValue
    )
    const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
    const { address: recipientAddress } = useENSAddress(recipient)
    const toggledVersion = useToggledVersion()
    const tradesByVersion = {
        [Version.v1]: v1Trade,
        [Version.v2]: v2Trade
    }
    const trade = showWrap ? undefined : tradesByVersion[toggledVersion]
    const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION]

    const betterTradeLinkV2: Version | undefined =
        toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade) ? Version.v2 : undefined

    const parsedAmounts = showWrap
        ? {
              [Field.INPUT]: parsedAmount,
              [Field.OUTPUT]: parsedAmount
          }
        : {
              [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
              [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
          }

    const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
    const isValid = !swapInputError
    const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput]
    )
    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput]
    )

    // modal and loading
    const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
        showConfirm: boolean
        tradeToConfirm: Trade | undefined
        attemptingTxn: boolean
        swapErrorMessage: string | undefined
        txHash: string | undefined
    }>({
        showConfirm: false,
        tradeToConfirm: undefined,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined
    })

    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: showWrap
            ? parsedAmounts[independentField]?.toExact() ?? ''
            : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
    }

    const route = trade?.route
    const userHasSpecifiedInputOutput = Boolean(
        currencies[Field.INPUT] &&
            currencies[Field.OUTPUT] &&
            parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
    )
    const noRoute = !route

    // check whether the user has approved the router on the input token
    const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
        if (approval === ApprovalState.PENDING) {
            setApprovalSubmitted(true)
        }
    }, [approval, approvalSubmitted])

    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

    // the callback to execute the swap
    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

    const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

    const [singleHopOnly] = useUserSingleHopOnly()

    const handleSwap = useCallback(() => {
        if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
            return
        }
        if (!swapCallback) {
            return
        }
        setSwapState({
            attemptingTxn: true,
            tradeToConfirm,
            showConfirm,
            swapErrorMessage: undefined,
            txHash: undefined
        })
        swapCallback()
            .then(hash => {
                setSwapState({
                    attemptingTxn: false,
                    tradeToConfirm,
                    showConfirm,
                    swapErrorMessage: undefined,
                    txHash: hash
                })

                ReactGA.event({
                    category: 'Swap',
                    action:
                        recipient === null
                            ? 'Swap w/o Send'
                            : (recipientAddress ?? recipient) === account
                            ? 'Swap w/o Send + recipient'
                            : 'Swap w/ Send',
                    label: [
                        trade?.inputAmount?.currency?.getSymbol(chainId),
                        trade?.outputAmount?.currency?.getSymbol(chainId),
                        getTradeVersion(trade)
                    ].join('/')
                })

                ReactGA.event({
                    category: 'Routing',
                    action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled'
                })
            })
            .catch(error => {
                setSwapState({
                    attemptingTxn: false,
                    tradeToConfirm,
                    showConfirm,
                    swapErrorMessage: error.message,
                    txHash: undefined
                })
            })
    }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, showConfirm, recipient, recipientAddress, account, trade, chainId, singleHopOnly])

    // errors
    const [showInverted, setShowInverted] = useState<boolean>(false)

    // warnings on slippage
    const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    // never show if price impact is above threshold in non expert mode
    const showApproveFlow =
        !swapInputError &&
        (approval === ApprovalState.NOT_APPROVED ||
            approval === ApprovalState.PENDING ||
            (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
        !(priceImpactSeverity > 3 && !isExpertMode)

    const handleConfirmDismiss = useCallback(() => {
        setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onUserInput(Field.INPUT, '')
        }
    }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

    const handleAcceptChanges = useCallback(() => {
        setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
    }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

    const handleInputSelect = useCallback(
        inputCurrency => {
            setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.INPUT, inputCurrency)
        },
        [onCurrencySelection]
    )

    const handleMaxInput = useCallback(() => {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }, [maxAmountInput, onUserInput])

    const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
        onCurrencySelection
    ])

    const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

    const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false)

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
    const handleTokenButtonClick = (tokenName: string) => {
        // console.log("tokenName", tokenName);
        setTokenButton(tokenName);
    }

    const chartToken = (baseCurrency:string) => {
        getCurrencyQuotesData(baseCurrency).then((data) => {
            setLineChartOptions( prepareLineChartOptions(data))
            setCandleChartOptions(prepareCandleChartOptions(data))
            setChartDataLoading(false)
        })
    }
    const digSectionHeight = document.getElementById('digSection')?.clientHeight;
    

    let chartSectionHeight = digSectionHeight?digSectionHeight*0.488:276;
    document.getElementById('chart-container')?.setAttribute("style",`min-height:${chartSectionHeight}px;height:${chartSectionHeight}px`);
    document.getElementById('tableSection')?.setAttribute("style",`min-height:${chartSectionHeight}px;height:${chartSectionHeight}px`);

    const [showModal, setShowModal] = useState<boolean>(false)

    const handleDismiss = useCallback(() => {
        setShowModal(false)
    }, [setShowModal])
    return (
        <>
            <Helmet>
                <title>SWAP | ShibaSwap</title>
                <meta
                    name="description"
                    content="ShibaSwap allows for swapping of ERC20 compatible tokens across multiple networks"
                />
            </Helmet>
            <TokenWarningModal
                isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
                tokens={importTokensNotInDefault}
                onConfirm={handleConfirmTokenWarning}
            />
            <SwapPoolTabs active={'swap'} />
            <div className="dig-container container my-auto pb-10">
                <div className="dig" id="digSection">
                <BackButton defaultRoute="" className="back_button"/>
                    <div className="wrapper mt-0 contents">
                        <div className="dig--inner">
                            <div className="left" style={{ marginRight: '0rem' }}>
                                <div className="inner">
                                    <div className="top">
                                        <div className="top-left">
                                            <CardHeading>SWAP</CardHeading>
                                            <div className="description" style={{ margin: '10px 0px' }}>
                                            Swap your tokens for other tokens
                                            </div>
                                            {/* <div className="read-more mt-5 font-medium" onClick={() => {
                                                setShowModal(true)
                                            }}>Read more about swapping tokens</div> */}
                                        </div>

                                        
                                        <div className="image-div mt-2">
                                            <img src={SwapImage} width="40" height="40" />
                                        </div>
                                    </div>

                                    <div className="bottom" style={{ marginTop: '2rem' }}>
                                    <div className="swaparea">
                                    <div className="settings_dig">
                                            <StyledMenuIcon />
                                        </div>
                                        <Wrapper id="swap-page" className="p-0">
                                            <ConfirmSwapModal
                                                isOpen={showConfirm}
                                                trade={trade}
                                                originalTrade={tradeToConfirm}
                                                onAcceptChanges={handleAcceptChanges}
                                                attemptingTxn={attemptingTxn}
                                                txHash={txHash}
                                                recipient={recipient}
                                                allowedSlippage={allowedSlippage}
                                                onConfirm={handleSwap}
                                                swapErrorMessage={swapErrorMessage}
                                                onDismiss={handleConfirmDismiss}
                                            />

                                        <AutoColumn gap={'md'}>
                                            <CurrencyInputPanel
                                                label={
                                                    independentField === Field.OUTPUT && !showWrap && trade
                                                        ? 'Swap From (est.):'
                                                        : 'Swap From:'
                                                }
                                                value={formattedAmounts[Field.INPUT]}
                                                showMaxButton={!atMaxAmountInput}
                                                currency={currencies[Field.INPUT]}
                                                onUserInput={handleTypeInput}
                                                onMax={handleMaxInput}
                                                onCurrencySelect={handleInputSelect}
                                                otherCurrency={currencies[Field.OUTPUT]}
                                                id="swap-currency-input"
                                                showCommonBases
                                            />
                                            {/* <AutoColumn justify="space-between">
                                                <AutoRow
                                                    justify={isExpertMode ? 'space-between' : 'flex-start'}
                                                    style={{ padding: '0 1rem' }}
                                                >
                                                    <button
                                                        className="bg-dark-900 rounded-full p-3px -mt-6 -mb-6 z-10"
                                                        onClick={() => {
                                                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                                                            onSwitchTokens()
                                                        }}
                                                    >
                                                        <div
                                                            className="bg-dark-800 hover:bg-dark-700 rounded-full p-3"
                                                            onMouseEnter={() => setAnimateSwapArrows(true)}
                                                            onMouseLeave={() => setAnimateSwapArrows(false)}
                                                        >
                                                            <Lottie
                                                                animationData={swapArrowsAnimationData}
                                                                autoplay={animateSwapArrows}
                                                                loop={false}
                                                                style={{ width: 32, height: 32 }}

                                                               
                                                            />
                                                        </div>
                                                    </button>
                                                    <ArrowWrapper clickable>
                                                        <ArrowDown
                                                            size="16"
                                                            onClick={() => {
                                                                setApprovalSubmitted(false) // reset 2 step UI for approvals
                                                                onSwitchTokens()
                                                            }}
                                                            color={
                                                                currencies[Field.INPUT] && currencies[Field.OUTPUT]
                                                                    ? theme.primary1
                                                                    : theme.text2
                                                            }
                                                        />
                                                    </ArrowWrapper>
                                                    {recipient === null && !showWrap && isExpertMode ? (
                                                        <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                                                            + Add a send (optional)
                                                        </LinkStyledButton>
                                                    ) : null}
                                                </AutoRow>
                                            </AutoColumn> */}
                                            <ColumnCenter
                                                style={{cursor:'pointer'}}
                                                onClick={() => {
                                                    setApprovalSubmitted(false) // reset 2 step UI for approvals
                                                    onSwitchTokens()
                                                }}
                                                >
                                            <img src={DownArrow} width="11" height="18" className="-m-2.5"/>
                                            </ColumnCenter>
                                            <CurrencyInputPanel
                                                value={formattedAmounts[Field.OUTPUT]}
                                                onUserInput={handleTypeOutput}
                                                label={
                                                    independentField === Field.INPUT && !showWrap && trade ? 'Swap To (est.):' : 'Swap To:'
                                                }
                                                showMaxButton={false}
                                                currency={currencies[Field.OUTPUT]}
                                                onCurrencySelect={handleOutputSelect}
                                                otherCurrency={currencies[Field.INPUT]}
                                                id="swap-currency-output"
                                                showCommonBases
                                            />
                                            <hr className="m-0"/>
                                            <div className="poolPriceBar pb-0 mt-0">
                                                {!swapIsUnsupported ? (
                                                    <AdvancedSwapDetailsDropdown trade={trade} />
                                                ) : (
                                                    <UnsupportedCurrencyFooter
                                                        show={swapIsUnsupported}
                                                        currencies={[currencies.INPUT, currencies.OUTPUT]}
                                                    />
                                                )}
                                            </div>

                                            {recipient !== null && !showWrap ? (
                                                <>
                                                    <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                                                        <ArrowWrapper clickable={false}>
                                                            <ArrowDown size="16" color={theme.text2} />
                                                        </ArrowWrapper>
                                                        <LinkStyledButton
                                                            id="remove-recipient-button"
                                                            onClick={() => onChangeRecipient(null)}
                                                        >
                                                            - Remove send
                                                        </LinkStyledButton>
                                                    </AutoRow>
                                                    <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                                                </>
                                            ) : null}

                                            {showWrap ? null : (
                                                <Card padding={showWrap ? '.25rem 1rem 0 1rem' : '0px'} borderRadius={'20px'}>
                                                    <AutoColumn gap="8px" style={{ padding: '0 16px' }}>
                                                        {Boolean(trade) && (
                                                            <RowBetween align="center">
                                                                <Text fontWeight={500} fontSize={14} color={theme.text2}>
                                                                    Price
                                                                </Text>
                                                                <TradePrice
                                                                    price={trade?.executionPrice}
                                                                    showInverted={showInverted}
                                                                    setShowInverted={setShowInverted}
                                                                />
                                                            </RowBetween>
                                                        )}
                                                        {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                                                            <RowBetween align="center">
                                                                <ClickableText
                                                                    fontWeight={500}
                                                                    fontSize={14}
                                                                    color={theme.text2}
                                                                    onClick={toggleSettings}
                                                                >
                                                                    Slippage Tolerance
                                                                </ClickableText>
                                                                <ClickableText
                                                                    fontWeight={500}
                                                                    fontSize={14}
                                                                    color={theme.text2}
                                                                    onClick={toggleSettings}
                                                                >
                                                                    {allowedSlippage / 100}%
                                                                </ClickableText>
                                                            </RowBetween>
                                                        )}
                                                    </AutoColumn>
                                                </Card>
                                            )}
                                        </AutoColumn>
                    <BottomGrouping>
                        {swapIsUnsupported ? (
                            <ButtonPrimary disabled={true}>
                                <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
                            </ButtonPrimary>
                        ) : !account ? (
                            <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
                        ) : showWrap ? (
                            <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                                {wrapInputError ??
                                    (wrapType === WrapType.WRAP
                                        ? 'Wrap'
                                        : wrapType === WrapType.UNWRAP
                                        ? 'Unwrap'
                                        : null)}
                            </ButtonPrimary>
                        ) : noRoute && userHasSpecifiedInputOutput ? (
                            <GreyCard style={{ textAlign: 'center' }}>
                                <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
                                {singleHopOnly && <TYPE.main mb="4px">Try enabling multi-hop trades.</TYPE.main>}
                            </GreyCard>
                        ) : showApproveFlow ? (
                            <RowBetween>
                                <ButtonConfirmed
                                    onClick={approveCallback}
                                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                                    width="48%"
                                    altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                                    confirmed={approval === ApprovalState.APPROVED}
                                >
                                    {approval === ApprovalState.PENDING ? (
                                        <AutoRow gap="6px" justify="center">
                                            Approving <Loader stroke="white" />
                                        </AutoRow>
                                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                                        'Approved'
                                    ) : (
                                        'Approve ' + currencies[Field.INPUT]?.getSymbol(chainId)
                                    )}
                                </ButtonConfirmed>
                                <ButtonError
                                    onClick={() => {
                                        if (isExpertMode) {
                                            handleSwap()
                                        } else {
                                            setSwapState({
                                                tradeToConfirm: trade,
                                                attemptingTxn: false,
                                                swapErrorMessage: undefined,
                                                showConfirm: true,
                                                txHash: undefined
                                            })
                                        }
                                    }}
                                    width="48%"
                                    id="swap-button"
                                    disabled={
                                        !isValid ||
                                        approval !== ApprovalState.APPROVED ||
                                        (priceImpactSeverity > 3 && !isExpertMode)
                                    }
                                    error={isValid && priceImpactSeverity > 2}
                                >
                                    <Text fontSize={16} fontWeight={500}>
                                        {priceImpactSeverity > 3 && !isExpertMode
                                            ? `Price Impact High`
                                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                                    </Text>
                                </ButtonError>
                            </RowBetween>
                        ) : (
                            <ButtonError
                                onClick={() => {
                                    if (isExpertMode) {
                                        handleSwap()
                                    } else {
                                        setSwapState({
                                            tradeToConfirm: trade,
                                            attemptingTxn: false,
                                            swapErrorMessage: undefined,
                                            showConfirm: true,
                                            txHash: undefined
                                        })
                                    }
                                }}
                                id="swap-button"
                                disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                                error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                            >
                                <Text fontSize={16} fontWeight={700}>
                                    {swapInputError
                                        ? swapInputError
                                        : priceImpactSeverity > 3 && !isExpertMode
                                        ? `Price Impact Too High`
                                        : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                                </Text>
                            </ButtonError>
                        )}
                        {showApproveFlow && (
                            <Column style={{ marginTop: '1rem' }}>
                                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                            </Column>
                        )}
                        {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                        {betterTradeLinkV2 && !swapIsUnsupported && toggledVersion === Version.v1 ? (
                            <BetterTradeLink version={betterTradeLinkV2} />
                        ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
                            <DefaultVersionLink />
                        ) : null}
                    </BottomGrouping>
                </Wrapper>
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

            <SwapModal
                    isOpen={showModal}
                    onDismiss={handleDismiss}
                />
        </>
    )
}
