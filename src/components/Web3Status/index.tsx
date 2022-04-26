import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { MenuButton, GradientButton } from 'theme'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import LatticeIcon from '../../assets/images/gridPlusWallet.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { fortmatic, injected, lattice, portis, walletconnect, walletlink } from '../../connectors'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress, shortenDouble } from '../../utils'
import { ButtonSecondary } from '../ButtonLegacy'
import Loader from '../Loader'
import WalletModal from '../WalletModal'
import metamaskImage from '../../assets/images/home/metamask.png'
import { useETHBalances } from 'state/wallet/hooks'
import { NETWORK_ICON, NETWORK_LABEL } from 'constants/networks'
import { Currency } from '@shibaswap/sdk'
import ProfileMenu from '../ProfileMenu'
import { mainNetworkChainId } from '../../constants'
import useShiberseLandAuction from 'hooks/useShiberseLandAuction'
import { useLocation } from 'react-router-dom'

const IconWrapper = styled.div<{ size?: number }>`
    ${({ theme }) => theme.flexColumnNoWrap};
    align-items: center;
    justify-content: center;
    margin-left: .5rem;
    & > * {
        height: ${({ size }) => (size ? size + 'px' : '32px')};
        width: ${({ size }) => (size ? size + 'px' : '32px')};
    }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    align-items: center;
    padding: 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    cursor: pointer;
    user-select: none;
    :focus {
        outline: none;
    }
`
const Web3StatusError = styled(Web3StatusGeneric)`
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
    color: ${({ theme }) => theme.white};
    font-weight: 500;
    :hover,
    :focus {
        background-color: ${({ theme }) => darken(0.1, theme.red1)};
    }
`

const Text = styled.p`
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0.5rem 0 0.25rem;
    font-size: 0.8rem;
    width: fit-content;
    font-weight: 500;
    font-family: 'Kanit'
`

const NetworkIcon = styled(Activity)`
    margin-left: 0.25rem;
    margin-right: 0.5rem;
    width: 25px;
    height: 25px;
`

const WalletBalance = styled.div`
    color: white;

    @media( max-width: 420px ) {
        display: none;
    }
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
    return b.addedTime - a.addedTime
}

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
    if (connector === injected) {
        return <></>
        // return <Identicon />
    } else if (connector === walletconnect) {
        return (
            <IconWrapper size={25}>
                <img src={WalletConnectIcon} alt={'Wallet Connect'} />
            </IconWrapper>
        )
    } else if (connector === lattice) {
        return (
            <IconWrapper size={25}>
                <img src={LatticeIcon} alt={'Lattice'} />
            </IconWrapper>
        )
    } else if (connector === walletlink) {
        return (
            <IconWrapper size={25}>
                <img src={CoinbaseWalletIcon} alt={'Coinbase Wallet'} />
            </IconWrapper>
        )
    } else if (connector === fortmatic) {
        return (
            <IconWrapper size={25}>
                <img src={FortmaticIcon} alt={'Fortmatic'} />
            </IconWrapper>
        )
    } else if (connector === portis) {
        return (
            <IconWrapper size={25}>
                <img src={PortisIcon} alt={'Portis'} />
            </IconWrapper>
        )
    }
    return null
}

function Web3StatusInner() {
    const { t } = useTranslation()
    const { account, connector, error, chainId } = useWeb3React()

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
    
    const chainLabel = NETWORK_LABEL[(chainId as keyof typeof NETWORK_LABEL)]
    const currentBalance = userEthBalance?.toSignificant()
    const currentChainIcon = NETWORK_ICON[(chainId as keyof typeof NETWORK_ICON)]
    const currentSymbol = chainId ? Currency.getNativeCurrencySymbol(chainId) : ''

    const { ENSName } = useENSName(account ?? undefined)

    const allTransactions = useAllTransactions()

    const { currentBidCount } = useShiberseLandAuction({})

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])

    const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

    const hasPendingTransactions = !!pending.length

    const toggleWalletModal = useWalletModalToggle()

    const CorrectNetwork = mainNetworkChainId === chainId

    const { pathname } = useLocation()
    const isOnMapPage = () => pathname === '/map'

    if (account) {
        return (
            <div
                id="web3-status-connected"
                className="flex items-center text-sm text-secondary btn-round bold btn btn-blue btn-round nav-tvl-btn inline-flex items-center cursor-pointer"
                // onClick={toggleWalletModal}
            >
                {hasPendingTransactions ? (
                    <div className="flex justify-between items-center">
                        <div className="pr-2 text-white">{pending?.length} Pending</div> <Loader stroke="white" />
                    </div>
                ) : CorrectNetwork ? (
                    <div className='flex items-center'>
                        {/* { isOnMapPage() ? (
                            <div className='text-white mr-4'>
                                <div className='network_label text-xs mb-1 text-center'>Bid Power</div>
                                <div className='flex items-center justify-center'>
                                    <div className='text-base flex items-center'>
                                        { currentBidCount } lands
                                    </div>
                                </div>
                            </div>
                        ): null } */}

                        <WalletBalance>
                            <div className='network_label text-xs mb-1 text-center'>{ chainLabel } Network</div>
                            <div className='flex items-center justify-center'>
                                <div className='mr-1'><img src={ currentChainIcon } width={22}></img></div>
                                <div className='text-base flex items-center'>
                                    { currentBalance ? `${ shortenDouble( parseFloat(currentBalance as any), 2) } ` : <Loader stroke="white" /> }
                                    { currentSymbol }
                                </div>
                            </div>
                        </WalletBalance>

                        {/* {ENSName || shortenAddress(account)} */}
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="pr-2 text-white">Wrong Network</div>
                    </div>
                )}
                {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
                
                <ProfileMenu />
            </div>
        )
    } else if (error) {
        return (
            <Web3StatusError onClick={toggleWalletModal}>
                <NetworkIcon />
                <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
            </Web3StatusError>
        )
    } else {
        return (
            <MenuButton onClick={toggleWalletModal} className="font-bold">
                <span className='full'>
                    { 'Connect Wallet' }
                </span>
                <img className='shorten' src={ metamaskImage }></img>
            </MenuButton>
        )
    }
}

export default function Web3Status() {
    const { active, account } = useWeb3React()
    const contextNetwork = useWeb3React(NetworkContextName)

    const { ENSName } = useENSName(account ?? undefined)

    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])

    const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
    const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

    if (!contextNetwork.active && !active) {
        return null
    }

    return (
        <>
            <Web3StatusInner />
            <WalletModal
                ENSName={ENSName ?? undefined}
                pendingTransactions={pending}
                confirmedTransactions={confirmed}
            />
        </>
    )
}
