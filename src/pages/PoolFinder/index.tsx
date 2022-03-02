import { Currency, ETHER, JSBI, TokenAmount } from '@shibaswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight } from '../../components/ButtonLegacy'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'
import { Helmet } from 'react-helmet'
import { BackButton } from '../../components/Button'

enum Fields {
    TOKEN0 = 0,
    TOKEN1 = 1
}

export default function PoolFinder() {
    const { account, chainId } = useActiveWeb3React()

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

    const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
    const [currency1, setCurrency1] = useState<Currency | null>(null)

    const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
    const addPair = usePairAdder()
    useEffect(() => {
        if (pair) {
            addPair(pair)
        }
    }, [pair, addPair])

    const validPairNoLiquidity: boolean =
        pairState === PairState.NOT_EXISTS ||
        Boolean(
            pairState === PairState.EXISTS &&
                pair &&
                JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
                JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
        )

    const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
    const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

    const handleCurrencySelect = useCallback(
        (currency: Currency) => {
            if (activeField === Fields.TOKEN0) {
                setCurrency0(currency)
            } else {
                setCurrency1(currency)
            }
        },
        [activeField]
    )

    const handleSearchDismiss = useCallback(() => {
        setShowSearch(false)
    }, [setShowSearch])

    const prerequisiteMessage = (
        <LightCard className="pool-buttons">
            <Text textAlign="center">
                {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
            </Text>
        </LightCard>
    )

    return (
        <>
            <Helmet>
                <title>Find Pool | ShibaSwap</title>
            </Helmet>
            <AppBody className="relative m-auto fetch-container mobile-container">
            <BackButton defaultRoute="/pool" className="back_button"/>
                <FindPoolTabs />
                <AutoColumn style={{ padding: '1rem' }} gap="md">
                    <BlueCard className="pl-1">
                        <AutoColumn gap="10px">
                            <TYPE.link  color=" #bbbbbd" className="hebbo-font">
                                <b>Tip:</b> Use this tool to find pairs that don&apos;t automatically appear in the
                                interface.
                            </TYPE.link>
                        </AutoColumn>
                    </BlueCard>
                    <ButtonDropdownLight
                    className="mt-0"
                        onClick={() => {
                            setShowSearch(true)
                            setActiveField(Fields.TOKEN0)
                        }}
                    >
                        {currency0 ? (
                            <Row>
                                <CurrencyLogo currency={currency0} />
                                <Text  fontSize={20} marginLeft={'12px'} className="hebbo-font">
                                    {currency0.getSymbol(chainId)}
                                </Text>
                            </Row>
                        ) : (
                            <Text  fontSize={20} marginLeft={'12px'} className="hebbo-font">
                                Select a Token
                            </Text>
                        )}
                    </ButtonDropdownLight>

                    <ColumnCenter >
                        <Plus size="16" color="#888D9B" />
                    </ColumnCenter>

                    <ButtonDropdownLight
                        className="mt-0"
                        onClick={() => {
                            setShowSearch(true)
                            setActiveField(Fields.TOKEN1)
                        }}
                    >
                        {currency1 ? (
                            <Row>
                                <CurrencyLogo currency={currency1} />
                                <Text  fontSize={20} marginLeft={'12px'} className="hebbo-font">
                                    {currency1.getSymbol(chainId)}
                                </Text>
                            </Row>
                        ) : (
                            <Text  fontSize={20} marginLeft={'12px'} className="hebbo-font">
                                Select a Token
                            </Text>
                        )}
                    </ButtonDropdownLight>

                    {hasPosition && (
                        <ColumnCenter
                            style={{
                                justifyItems: 'center',
                                backgroundColor: '',
                                padding: '12px 0px',
                                borderRadius: '12px'
                            }}
                        >
                            <Text textAlign="center"  className="hebbo-font">
                                Pool Found!
                            </Text>
                            <StyledInternalLink to={`/pool`}>
                                <Text textAlign="center" className="hebbo-font">Manage this pool.</Text>
                            </StyledInternalLink>
                        </ColumnCenter>
                    )}

                    {currency0 && currency1 ? (
                        pairState === PairState.EXISTS ? (
                            hasPosition && pair ? (
                                <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
                            ) : (
                                <LightCard padding="45px 10px">
                                    <AutoColumn gap="sm" justify="center">
                                        <Text textAlign="center" className="hebbo-font">You don’t have liquidity in this pool yet.</Text>
                                        <StyledInternalLink
                                            to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                        >
                                            <Text textAlign="center" className="hebbo-font">Add liquidity.</Text>
                                        </StyledInternalLink>
                                    </AutoColumn>
                                </LightCard>
                            )
                        ) : validPairNoLiquidity ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center" className="hebbo-font">No pool found.</Text>
                                    <StyledInternalLink style={{ color: '#ffb73c' }} to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`} className="hebbo-font">
                                        Create pool.
                                    </StyledInternalLink >
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.INVALID ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center"  className="hebbo-font">
                                        Invalid pair.
                                    </Text>
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.LOADING ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center" className="hebbo-font">
                                        Loading
                                        <Dots />
                                    </Text>
                                </AutoColumn>
                            </LightCard>
                        ) : null
                    ) : (
                        prerequisiteMessage
                    )}
                </AutoColumn>

                <CurrencySearchModal
                    isOpen={showSearch}
                    onCurrencySelect={handleCurrencySelect}
                    onDismiss={handleSearchDismiss}
                    showCommonBases
                    selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
                />
            </AppBody>
        </>
    )
}
