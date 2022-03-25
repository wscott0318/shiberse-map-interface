import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import {
    ChainId,
    Currency,
    CurrencyAmount,
    ETHER,
    JSBI,
    Percent,
    SHIBASWAP_ROUTER_ADDRESS,
    Token,
    WETH
} from '@shibaswap/sdk'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { ethers } from 'ethers'
import Numeral from 'numeral'
import { Fraction } from '../entities'
import { TokenAddressMap } from '../state/lists/hooks'
import SHIBASWAP_ROUTER_ABI from '../constants/abis/shibaswap_uniswapv2router02.json'
import { useActiveWeb3React } from '../hooks'


export const formatFromBalance = (value: BigNumber | undefined, decimals = 18): string => {
    if (value) {
        return Fraction.from(BigNumber.from(value), BigNumber.from(10).pow(decimals)).toString()
    } else {
        return ''
    }
}
export const formatToBalance = (value: string | undefined, decimals = 18) => {
    if (value) {
        return { value: ethers.utils.parseUnits(Number(value).toFixed(decimals), decimals), decimals: decimals }
    } else {
        return { value: BigNumber.from(0), decimals: decimals }
    }
}

export function isWETH(value: any, chainId: ChainId = 1): string {
    if (value.toLowerCase() === WETH[chainId].address.toLowerCase()) {
        return 'ETH'
    }
    return value
}

export const formatBalance = (value: ethers.BigNumberish, decimals = 18, maxFraction = 0) => {
    const formatted = ethers.utils.formatUnits(value, decimals)
    if (maxFraction > 0) {
        const split = formatted.split('.')
        if (split.length > 1) {
            return split[0] + '.' + split[1].substr(0, maxFraction)
        }
    }
    return formatted
}

export const parseBalance = (value: string, decimals = 18) => {
    return ethers.utils.parseUnits(value || '0', decimals)
}

export const isEmptyValue = (text: string) =>
    ethers.BigNumber.isBigNumber(text)
        ? ethers.BigNumber.from(text).isZero()
        : text === '' || text.replace(/0/g, '').replace(/\./, '') === ''

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}
export function isAddressString(value: any): string {
    try {
        return getAddress(value)
    } catch {
        return ''
    }
}

// Vision Formatting
export const toK = (num: string) => {
    return Numeral(num).format('0.[00]a')
}

// using a currency library here in case we want to add more in future
const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

export const formattedNum = (number: any, usd = false) => {
    if (isNaN(number) || number === '' || number === undefined || number === '0') {
        return usd ? '$0.00' : '-'
    }
    const num = parseFloat(number)

    if (num > 500000000) {
        return (usd ? '$' : '') + toK(num.toFixed(0))
    }

    if (num === 0) {
        if (usd) {
            return '$0.00'
        }
        return '0'
    }

    if (num < 0.0001 && num > 0) {
        return usd ? '< $0.0001' : '< 0.0001'
    }

    if (num > 1000) {
        return usd
            ? '$' + Number(parseFloat(String(num)).toFixed(5)).toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})
            : '' + Number(parseFloat(String(num)).toFixed(5)).toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})
    }

    if (usd) {
        if (num < 0.1) {
            return '$' + Number(parseFloat(String(num)).toFixed(4))
        } else {
            const usdString = priceFormatter.format(num)
            return '$' + usdString.slice(1, usdString.length)
        }
    }

    return parseFloat(String(num)).toFixed(5)
}

export const formatLessThan = (number: any) =>{
    const num = number?.toFixed(number.token.decimals)

    if ( num === '' || num === undefined) {
        return Number(0).toFixed(4)
    }
    const numS = parseFloat(num)

    if (numS < 0.0001 && numS > 0) {
        return '< 0.0001'
    }

    return number.toFixed(4, { groupSeparator: ',' } ?? '-')
}

export function gradientColor(percent: any) {
    percent = parseFloat(percent)
    if (percent < 100 && percent >= 90) {
        return '#ff3a31'
    }
    if (percent < 90 && percent >= 80) {
        return '#f85815'
    }
    if (percent < 80 && percent >= 70) {
        return '#ed7000'
    }
    if (percent < 70 && percent >= 60) {
        return '#de8400'
    }
    if (percent < 60 && percent >= 50) {
        return '#ce9700'
    }
    if (percent < 50 && percent >= 40) {
        return '#bba700'
    }
    if (percent < 40 && percent >= 30) {
        return '#a6b500'
    }
    if (percent < 30 && percent >= 20) {
        return '#8fc21b'
    }
    if (percent < 20 && percent >= 10) {
        return '#73ce42'
    }
    if (percent < 10 && percent >= 0) {
        return '#4ed864'
    }
    if (percent == 0) {
        return '#4ed864'
    }
    return '#ff3a31'
}

export function gradientColorAsc(percent: any) {
    percent = parseFloat(percent)
    if (percent < 10 && percent >= 0) {
        return '#ff3a31'
    }
    if (percent < 20 && percent >= 10) {
        return '#f85815'
    }
    if (percent < 30 && percent >= 20) {
        return '#ed7000'
    }
    if (percent < 40 && percent >= 30) {
        return '#de8400'
    }
    if (percent < 50 && percent >= 40) {
        return '#ce9700'
    }
    if (percent < 60 && percent >= 50) {
        return '#bba700'
    }
    if (percent < 70 && percent >= 60) {
        return '#a6b500'
    }
    if (percent < 80 && percent >= 70) {
        return '#8fc21b'
    }
    if (percent < 90 && percent >= 80) {
        return '#73ce42'
    }
    if (percent < 100 && percent >= 90) {
        return '#4ed864'
    }
    if (percent >= 100) {
        return '#4ed864'
    }
    return '#ff3a31'
}

export function formattedPercent(percentString: any) {
    const percent = parseFloat(percentString)
    if (!percent || percent === 0) {
        return '0%'
    }
    if (percent < 0.0001 && percent > 0) {
        return '< 0.0001%'
    }
    if (percent < 0 && percent > -0.0001) {
        return '< 0.0001%'
    }
    const fixedPercent = percent.toFixed(2)
    if (fixedPercent === '0.00') {
        return '0%'
    }
    return `${fixedPercent}%`
    // if (Number(fixedPercent) > 0) {
    //     if (Number(fixedPercent) > 100) {
    //         if(Number(fixedPercent) > 10000)
    //             return '10000+%'
    //         return `${percent?.toFixed(0).toLocaleString()}%`
    //     } else {
    //         return `${fixedPercent}%`
    //     }
    // } else {
    //     return `${fixedPercent}%`
    // }
}

// Multichain Explorer
const builders = {
    etherscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = `https://${chainName ? `${chainName}.` : ''}etherscan.io`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    fantom: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = 'https://ftmscan.com'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    xdai: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = `https://blockscout.com/poa/xdai`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return `${prefix}/tokens/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    bscscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = `https://${chainName ? `${chainName}.` : ''}bscscan.com`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    matic: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = `https://explorer-${chainName}.maticvigil.com`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return `${prefix}/tokens/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    // token is not yet supported for arbitrum
    arbitrum: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = `https://explorer.offchainlabs.com/#`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return prefix
            default:
                return `${prefix}/${type}/${data}`
        }
    },
    moonbase: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = 'https://moonbeam-explorer.netlify.app'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'address':
                return `${prefix}/address/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    avalanche: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = `https://cchain.explorer.avax${chainName ? `-${chainName}` : ''}.network`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    heco: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = `https://${chainName ? `${chainName}.` : ''}hecoinfo.com`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    harmony: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = 'https://explorer.harmony.one/#'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    harmonyTestnet: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
        const prefix = 'https://explorer.pops.one/#'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    }
}

interface ChainObject {
    [chainId: number]: {
        chainName: string
        builder: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
    }
}

const chains: ChainObject = {
    [ChainId.MAINNET]: {
        chainName: '',
        builder: builders.etherscan
    },
    [ChainId.ROPSTEN]: {
        chainName: 'ropsten',
        builder: builders.etherscan
    },
    [ChainId.RINKEBY]: {
        chainName: 'rinkeby',
        builder: builders.etherscan
    },
    [ChainId.GÖRLI]: {
        chainName: 'goerli',
        builder: builders.etherscan
    },
    [ChainId.KOVAN]: {
        chainName: 'kovan',
        builder: builders.etherscan
    },
    [ChainId.MATIC]: {
        chainName: 'mainnet',
        builder: builders.matic
    },
    [ChainId.MATIC_TESTNET]: {
        chainName: 'mumbai',
        builder: builders.matic
    },
    [ChainId.FANTOM]: {
        chainName: '',
        builder: builders.fantom
    },
    [ChainId.FANTOM_TESTNET]: {
        chainName: 'testnet',
        builder: builders.fantom
    },
    [ChainId.XDAI]: {
        chainName: 'xdai',
        builder: builders.xdai
    },
    [ChainId.BSC]: {
        chainName: '',
        builder: builders.bscscan
    },
    [ChainId.BSC_TESTNET]: {
        chainName: 'testnet',
        builder: builders.bscscan
    },
    [ChainId.ARBITRUM]: {
        chainName: 'arbitrum',
        builder: builders.arbitrum
    },
    [ChainId.MOONBASE]: {
        chainName: '',
        builder: builders.moonbase
    },
    [ChainId.AVALANCHE]: {
        chainName: '',
        builder: builders.avalanche
    },
    [ChainId.FUJI]: {
        chainName: 'test',
        builder: builders.avalanche
    },
    [ChainId.HECO]: {
        chainName: '',
        builder: builders.heco
    },
    [ChainId.HECO_TESTNET]: {
        chainName: 'testnet',
        builder: builders.heco
    },
    [ChainId.HARMONY]: {
        chainName: '',
        builder: builders.harmony
    },
    [ChainId.HARMONY_TESTNET]: {
        chainName: '',
        builder: builders.harmonyTestnet
    }
}

export function getExplorerLink(
    chainId: ChainId,
    data: string,
    type: 'transaction' | 'token' | 'address' | 'block'
): string {
    const chain = chains[chainId]
    return chain.builder(chain.chainName, data, type)
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
    return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
    if (slippage < 0 || slippage > 10000) {
        throw Error(`Unexpected slippage value: ${slippage}`)
    }
    return [
        JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
        JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
    ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
    return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function getShibaSwapRouterAddress(chainId?: ChainId) {
    if (!chainId) {
        throw Error(`Undefined 'chainId' parameter '${chainId}'.`)
    }
    return SHIBASWAP_ROUTER_ADDRESS[chainId]
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
    if (currency === ETHER) return true
    return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}


export function getShibaSwapRouterContract(chainId: number, library: Web3Provider, account?: string): Contract {
    return getContract(getShibaSwapRouterAddress(chainId), SHIBASWAP_ROUTER_ABI, library, account)
}

export function secondsToTime(difference: number):any{
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

    const timeString = (!days ? "" : days + " Days ") + 
                       (!days && !hours? "" : hours + " Hours ") + 
                       minutes + " Minutes " + 
                       seconds + " Seconds";

    return timeString;
  }

export function tempCountDays(difference: number):any{
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    return days > 0? days + " days" : hours + " hours";
}

export function formatMillion(number: number): any {
    
    const units = ["","K","M","B","T","Q"]
    const unit = Math.floor((number / 1.0e+1).toFixed(0).toString().length)
    const r = unit%3
    const x =  (Number(number)/Number('1.0e+'+(unit-r))).toFixed(2)
    return x + units[Math.floor(unit / 3)]
}

export function shortenDouble( number: number, downCount: number ) {
    return number.toFixed( downCount )
}