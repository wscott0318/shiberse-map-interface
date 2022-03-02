import { Currency, Pair } from '@shibaswap/sdk'
import { darken } from 'polished'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { HelpCircle as Question } from 'react-feather'

import { useActiveWeb3React } from '../../hooks'
import useTheme from '../../hooks/useTheme'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween } from '../Row'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import Button from '../Button'
import selectCoinAnimation from '../../assets/animation/select-coin.json'
import Lottie from 'lottie-react'
import { Field } from 'state/mint/actions'


const InputRow = styled.div<{ selected: boolean }>`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
    align-items: center;
    height: 100%;
    font-size: 20px;
    font-weight: 500;
    background-color: #171a23;
    min-width: 160px;
    // color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    // border-radius: ${({ theme }) => theme.borderRadius};
    // box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
    // padding: 0 0.5rem;

    :focus,
    :hover {
        background-color: transparent;
    }
`

const LabelRow = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    color: ${({ theme }) => theme.text1};
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.75rem 1rem 0 1rem;
    span:hover {
        cursor: pointer;
        color: ${({ theme }) => darken(0.2, theme.text2)};
    }
`

const Aligner = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
    margin: 0 0.25rem 0 0.5rem;
    height: 35%;
    color: white;

    path {
        stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
        stroke-width: 1.5px;
    }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
//   ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
//   font-size:  ${({ active }) => (active ? '24px' : '12px')};
`

const StyledBalanceMax = styled.button`
    height: 28px;
    padding-right: 8px;
    padding-left: 8px;
    background-color: ${({ theme }) => theme.primary5};
    border: 1px solid ${({ theme }) => theme.primary5};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 0.875rem;

    font-weight: 500;
    cursor: pointer;
    margin-right: 0.5rem;
    color: ${({ theme }) => theme.primaryText1};
    :hover {
        border: 1px solid ${({ theme }) => theme.primary1};
    }
    :focus {
        border: 1px solid ${({ theme }) => theme.primary1};
        outline: none;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

const InputGroupStyle: any = {
    backgroundColor:"#171a23",
    borderRadius: '1rem',
    margin: '0.5rem',
    paddingTop: '0.5rem',
}

const InputTextStyle: any = {
    outline: "none",
    background: "transparent !important",
    border: "none",
    width: "100%",
    padding: "0.5rem 0",
    fontSize: "120%",
    color: "#d5d5d5",
}
const QuestionMark = styled.span`
    font-size: 2rem;
`

interface CurrencyInputPanelProps {
    value: string
    onUserInput: (value: string) => void
    onMax?: () => void
    showMaxButton: boolean
    label?: string
    onCurrencySelect?: (currency: Currency) => void
    currency?: Currency | null
    disableCurrencySelect?: boolean
    hideBalance?: boolean
    pair?: Pair | null
    hideInput?: boolean
    customStyle: any
    otherCurrency?: Currency | null
    currenciesAB?: { [field in Field]?: Currency },
    type?: Field,
    id: string
    showCommonBases?: boolean
    customBalanceText?: string
    cornerRadiusBottomNone?: boolean
    cornerRadiusTopNone?: boolean
    containerBackground?: string
}

export default function CurrencyInputPanel({
    value,
    onUserInput,
    onMax,
    showMaxButton,
    label = 'Input',
    onCurrencySelect,
    currency,
    disableCurrencySelect = false,
    hideBalance = false,
    pair = null, // used for double token logo
    hideInput = false,
    otherCurrency,
    customStyle,
    currenciesAB,
    type,
    id,
    showCommonBases,
    customBalanceText,
    cornerRadiusBottomNone,
    cornerRadiusTopNone,
    containerBackground
}: CurrencyInputPanelProps) {
    const { t } = useTranslation()

    const [modalOpen, setModalOpen] = useState(false)
    const { account, chainId } = useActiveWeb3React()
    const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
    const theme = useTheme()

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    return (
        <div id={id} style={InputGroupStyle} className={'pd-5 mb-2 relative ' + customStyle}>
            {!hideInput && (
                        <>
            {account && (
                                <div onClick={onMax} className="font-medium cursor-pointer text-xs text-low-emphesis balance absolute right-4">
                                    {!hideBalance && !!currency && selectedCurrencyBalance
                                        ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                                        : ' -'}
                                </div>
                            )}

                            </>
            )}
            <div
                className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between"
                // hideInput={hideInput}
                // cornerRadiusBottomNone={cornerRadiusBottomNone}
                // cornerRadiusTopNone={cornerRadiusTopNone}
                // containerBackground={containerBackground}
            >
                {/* {!hideInput && (
                    <LabelRow>
                        <RowBetween>
                            <TYPE.body color={theme.text3} fontWeight={500} fontSize={14}>
                                {label}
                            </TYPE.body>
                            {account && (
                                <TYPE.body
                                    onClick={onMax}
                                    color={theme.text3}
                                    fontWeight={500}
                                    fontSize={14}
                                    style={{ display: 'inline', cursor: 'pointer' }}
                                >
                                    {!hideBalance && !!currency && selectedCurrencyBalance
                                        ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                                        : ' -'}
                                </TYPE.body>
                            )}
                        </RowBetween>
                    </LabelRow>
                )} */}
                
                <div
                    style={{ minWidth: '170px' }}
                    className="w-full sm:w-2/5"
                    // style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
                    // selected={disableCurrencySelect}
                >
                    <CurrencySelect
                        selected={!!currency}
                        className="open-currency-select-button float-left"
                        onClick={() => {
                            if (!disableCurrencySelect) {
                                setModalOpen(true)
                            }
                        }}
                    >
                        <div className="flex">
                            {pair ? (
                                <DoubleCurrencyLogo
                                    currency0={pair.token0}
                                    currency1={pair.token1}
                                    size={54}
                                    margin={true}
                                />
                            ) : currency ? (
                                <div className="flex-1" style={{ width: 54, height: 54 }}>
                                    <CurrencyLogo currency={currency} size={'54px'} />
                                </div>
                            ) : (
                                <div className="rounded" style={{ maxWidth: 54, maxHeight: 54 }}>
                                    <div style={{ width: 54, height: 54 }} className="questions">
                                         <QuestionMark>?</QuestionMark>
                                    </div>
                                </div>
                            )}
                            {pair ? (
                                <StyledTokenName className="pair-name-container">
                                    {pair?.token0.symbol}:{pair?.token1.symbol}
                                </StyledTokenName>
                            ) : (
                                <div className="flex flex-1 flex-col items-start justify-center mx-3.5">
                                    {label && (
                                        <div className="text-xs text-secondary font-medium whitespace-nowrap label-style">
                                            {label}
                                        </div>
                                    )}
                                    <div className="flex items-center relative">
                                        {/* <StyledTokenName
                                            className="token-symbol-container"
                                            active={Boolean(currency && currency.symbol)}
                                        > */}
                                        <div
                                            style={{ fontFamily: 'Metric - Bold' }}
                                            className="text-lg md:text-2xl font-bold token-style"
                                        >
                                            {(currency && currency.symbol && currency.symbol.length > 20
                                                ? currency.symbol.slice(0, 4) +
                                                  '...' +
                                                  currency.symbol.slice(
                                                      currency.symbol.length - 5,
                                                      currency.symbol.length
                                                  )
                                                : currency?.getSymbol(chainId)) || (
                                                <div
                                                    className="bg-transparent border border-low-emphesis rounded-full py-1 px-0 text-secondary text-xs font-medium mt-1 whitespace-nowrap row"
                                                    style={{ border: 0, fontFamily: 'Metric - Bold' }}
                                                >
                                                    {t('selectToken')}
                                                    {/* <img
                                                        src="/images/drop-down.png"
                                                        style={{
                                                            height: '0.7rem',
                                                            paddingTop: '0.2rem',
                                                            paddingLeft: '0.3rem'
                                                        }}
                                                    /> */}
                                                </div>
                                            )}
                                        </div>
                                        {/* </StyledTokenName> */}
                                        {!disableCurrencySelect && currency && <StyledDropDown selected={!!currency} className="absolute -right-3.5"/>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CurrencySelect>
                    {/* {!hideInput && (
                        <>
                            <NumericalInput
                                className="token-amount-input"
                                value={value}
                                onUserInput={val => {
                                    onUserInput(val)
                                }}
                            />
                            {account && currency && showMaxButton && label !== 'To' && (
                                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                            )}
                        </>
                    )} */}
                </div>
                <div style={InputTextStyle} className="ml-4 flex items-center rounded space-x-3 p-3 w-full sm:w-3/5 currency-div">
                    {!hideInput && (
                        <>
                            {account && label !== 'To' && (
                                <Button
                                    onClick={onMax}
                                    className="bg-transparent hover:bg-primary border border-low-emphesis rounded-full py-1 px-2 text-secondary text-xs font-medium whitespace-nowrap ml-3"
                                >
                                    MAX
                                </Button>
                            )}
                            <NumericalInput
                                className="token-amount-input"
                                value={value}
                                onUserInput={val => {
                                    onUserInput(val)
                                }}
                            />
                            
                        </>
                    )}
                </div>
            </div>
            {!disableCurrencySelect && onCurrencySelect && (
                <CurrencySearchModal
                    isOpen={modalOpen}
                    onDismiss={handleDismissSearch}
                    onCurrencySelect={onCurrencySelect}
                    selectedCurrency={currency}
                    otherSelectedCurrency={otherCurrency}
                    showCommonBases={showCommonBases}
                    currenciesAB={currenciesAB}
                    type={type}
                />
            )}
        </div>
    )
}

CurrencyInputPanel.defaultProps = {
    customStyle: ''
}
