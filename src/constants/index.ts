import {
    ChainId,
    JSBI,
    Percent,
    Token,
    WETH,
    USDC as USDCToken,
    USDT as USDTToken,
    DAI as DAIToken,
    WBTC as WBTCToken,
    XFUND_TOKEN,
    BONE,
    PERL_TOKEN,
    F9_TOKEN,
    ZIG_TOKEN,
    RYOSHIS_TOKEN,
    UFO_TOKEN,
    VEMP_TOKEN,
    DAI_MERKLE_DISTRIBUTOR_ADDRESS,
    xSHIB_BONE_MERKLE_DISTRIBUTOR_ADDRESS,
    xSHIB_WETH_MERKLE_DISTRIBUTOR_ADDRESS,
    xLEASH_BONE_MERKLE_DISTRIBUTOR_ADDRESS,
    tBONE_BONE_MERKLE_DISTRIBUTOR_ADDRESS,
    USDC_MERKLE_DISTRIBUTOR_ADDRESS,
    WBTC_MERKLE_DISTRIBUTOR_ADDRESS,
    USDT_MERKLE_DISTRIBUTOR_ADDRESS,
    XFUND_MERKLE_DISTRIBUTOR_ADDRESS,
    PERL_MERKLE_DISTRIBUTOR_ADDRESS,
    ZIG_MERKLE_DISTRIBUTOR_ADDRESS,
    F9_MERKLE_DISTRIBUTOR_ADDRESS,
    RYOSHIS_MERKLE_DISTRIBUTOR_ADDRESS,
    BASIC_BONE_REWARDS_MERKLE_DISTRIBUTOR,
    LEASH,
    CIV_MERKLE_DISTRIBUTOR_ADDRESS,
    CIV_TOKEN,
    UFO_MERKLE_DISTRIBUTOR_ADDRESS,
    VEMP_MERKLE_DISTRIBUTOR_ADDRESS
} from '@shibaswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { fortmatic, injected, lattice, portis, torus, walletconnect, walletlink } from '../connectors'
import shibaSwapData from '@shibaswap/shibaswap-data-snoop'
// import amountsUSDC from './jsons/USDC/amounts.json'
// import merkleUSDC from './jsons/USDC/merkle.json'
// import amountsUSDT from './jsons/USDT/amounts.json'
// import merkleUSDT from './jsons/USDT/merkle.json'
// import amountsDAI from './jsons/DAI/amounts.json'
// import merkleDAI from './jsons/DAI/merkle.json'
// import amountsWBTC from './jsons/WBTC/amounts.json'
// import merkleWBTC from './jsons/WBTC/merkle.json'
// import amountxShibBone from './jsons/BuryShibBone/amounts.json'
// import merklexShibBone from './jsons/BuryShibBone/merkle.json'
// import amountxLeashBone from './jsons/BuryLeashBone/amounts.json'
// import merklexLeashBone from './jsons/BuryLeashBone/merkle.json'
// import amountxShibWeth from './jsons/BuryShibWeth/amounts.json'
// import merklexShibWeth from './jsons/BuryShibWeth/merkle.json'
// import amounttBoneBone from './jsons/BuryBoneBone/amounts.json'
// import merkletBoneBone from './jsons/BuryBoneBone/merkle.json'

export const POOL_DENY = ['14', '29', '45', '30']

// a list of tokens by chain
type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

type ChainTokenListNew = {
    readonly [chainId in ChainId]: (Token | undefined)[]
}

type ChainTokenMap = {
    readonly [chainId in ChainId]?: Token
}

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

// SUSHI
export const SUSHI: ChainTokenMap = {
    [ChainId.MAINNET]: new Token(
        ChainId.MAINNET,
        '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
        18,
        'SUSHI',
        'SushiToken'
    ),
    [ChainId.ROPSTEN]: new Token(
        ChainId.ROPSTEN,
        '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
        18,
        'SUSHI',
        'SushiToken'
    ),
    [ChainId.RINKEBY]: new Token(
        ChainId.RINKEBY,
        '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
        18,
        'SUSHI',
        'SushiToken'
    ),
    [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', 18, 'SUSHI', 'SushiToken'),
    [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', 18, 'SUSHI', 'SushiToken'),
    [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC', 18, 'SUSHI', 'SushiToken')
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
    // [UNI_ADDRESS]: 'UNI',
    [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: '',
    [ChainId.ROPSTEN]: '',
    [ChainId.KOVAN]: '0x25B365dB50ca5b59FCA7eF046b4227E94FEe8d2c'
}

// TODO: update weekly with new constant
export const MERKLE_ROOT =
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-01/merkle-10959148-11003985.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-02/merkle-10959148-11049116.json'
    'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-03/merkle-10959148-11094829.json'

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
    [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
    [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
    [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
    [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
    [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
    [ChainId.FANTOM]: [WETH[ChainId.FANTOM]],
    [ChainId.FANTOM_TESTNET]: [WETH[ChainId.FANTOM_TESTNET]],
    [ChainId.MATIC]: [WETH[ChainId.MATIC]],
    [ChainId.MATIC_TESTNET]: [WETH[ChainId.MATIC_TESTNET]],
    [ChainId.XDAI]: [WETH[ChainId.XDAI]],
    [ChainId.BSC]: [WETH[ChainId.BSC]],
    [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
    [ChainId.ARBITRUM]: [WETH[ChainId.ARBITRUM]],
    [ChainId.MOONBASE]: [WETH[ChainId.MOONBASE]],
    [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]],
    [ChainId.FUJI]: [WETH[ChainId.FUJI]],
    [ChainId.HECO]: [WETH[ChainId.HECO]],
    [ChainId.HECO_TESTNET]: [WETH[ChainId.HECO_TESTNET]],
    [ChainId.HARMONY]: [WETH[ChainId.HARMONY]],
    [ChainId.HARMONY_TESTNET]: [WETH[ChainId.HARMONY_TESTNET]]
}

// Default Ethereum chain tokens
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const NFTX = new Token(ChainId.MAINNET, '0x87d73E916D7057945c9BcD8cdd94e42A6F47f776', 18, 'NFTX', 'NFTX')
export const STETH = new Token(ChainId.MAINNET, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'stakedETH')

export const Ropsten: { [key: string]: Token } = {
    DAI: new Token(ChainId.ROPSTEN, '0xdd049E9716a7cdeeeaac3890e6721A378ABa71d8', 18, 'DAI', 'DAI'),
    USDC: new Token(ChainId.ROPSTEN, '0x5067F6Dbdccd70771352e9d5E5a19DDf6A8fAfdb', 6, 'USDC', 'USD Coin'),
    USDT: new Token(ChainId.ROPSTEN, '0x3672Aec96464C945F8274BB22Ef1de64398deB44', 6, 'USDT', 'USDT'),
    WBTC: new Token(ChainId.ROPSTEN, '0xc59837d0AeBCC6AF23Dcb3c23eb757b07B0EaE0c', 8, 'wBTC', 'Wrapped BTC')
}

export const BSC: { [key: string]: Token } = {
    DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
    USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
    USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
    USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
    BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin')
}

export const FANTOM: { [key: string]: Token } = {
    USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
    WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
    DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
    WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether')
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    ...WRAPPED_NATIVE_ONLY,
    [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR, WBTC, RUNE, NFTX, STETH],
    [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
    [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB]
}

export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
export const USDP = new Token(
    ChainId.MAINNET,
    '0x1456688345527bE1f37E9e627DA0837D6f08C925',
    18,
    'USDP',
    'USDP Stablecoin'
)
export const DUCK = new Token(ChainId.MAINNET, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
export const BAB = new Token(ChainId.MAINNET, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
export const HBTC = new Token(ChainId.MAINNET, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
export const IBETH = new Token(
    ChainId.MAINNET,
    '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
    8,
    'ibETHv2',
    'Interest Bearing Ether v2'
)
export const PONT = new Token(
    ChainId.MAINNET,
    '0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2',
    9,
    'pONT',
    'Poly Ontology Token'
)
export const PWING = new Token(
    ChainId.MAINNET,
    '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a',
    9,
    'pWING',
    'Poly Ontology Wing Token'
)

export const UMA = new Token(ChainId.MAINNET, '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', 18, 'UMA', 'UMA')

export const UMA_CALL = new Token(
    ChainId.MAINNET,
    '0x1062aD0E59fa67fa0b27369113098cC941Dd0D5F',
    18,
    'UMA',
    'UMA 35 Call [30 Apr 2021]'
)

export const DOUGH = new Token(
    ChainId.MAINNET,
    '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
    18,
    'DOUGH',
    'PieDAO Dough v2'
)

export const PLAY = new Token(
    ChainId.MAINNET,
    '0x33e18a092a93ff21aD04746c7Da12e35D34DC7C4',
    18,
    'PLAY',
    'Metaverse NFT Index'
)

export const XSUSHI_CALL = new Token(
    ChainId.MAINNET,
    '0xada279f9301C01A4eF914127a6C2a493Ad733924',
    18,
    'XSUc25-0531',
    'XSUSHI 25 Call [31 May 2021]'
)

export const XSUSHI = new Token(ChainId.MAINNET, '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', 18, 'xSUSHI', 'SushiBar')

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
    [ChainId.MAINNET]: {
        [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
        [DUCK.address]: [USDP, WETH[ChainId.MAINNET]],
        [BAB.address]: [BAC, WETH[ChainId.MAINNET]],
        [HBTC.address]: [CREAM, WETH[ChainId.MAINNET]],
        [FRAX.address]: [FXS, WETH[ChainId.MAINNET]],
        [IBETH.address]: [ALPHA, WETH[ChainId.MAINNET]],
        [PONT.address]: [PWING, WETH[ChainId.MAINNET]],
        [UMA_CALL.address]: [UMA, WETH[ChainId.MAINNET]],
        [PLAY.address]: [DOUGH, WETH[ChainId.MAINNET]],
        [XSUSHI_CALL.address]: [XSUSHI, WETH[ChainId.MAINNET]]
    }
}

//mapping allowed pars for liquidity
export const MAPPED_PAIRS: any = {
    ETH: ['SHIB', 'SUSHI', 'UNI', 'SNX', 'MEME', 'GRT', 'LEASH', 'XFUND', 'BONE', 'SDAI', 'SUSDT', 'SWBTC', 'SUSDT'],
    SHIB: ['ETH', 'SUSDT'],
    SUSHI: ['ETH'],
    UNI: ['ETH'],
    SNX: ['ETH'],
    MEME: ['ETH'],
    GRT: ['ETH'],
    LEASH: ['ETH'],
    XFUND: ['ETH'],
    BONE: ['ETH'],
    SDAI: ['ETH'],
    SUSDT: ['ETH', 'SHIB'],
    SWBTC: ['ETH']
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
    ...WRAPPED_NATIVE_ONLY,
    [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
    [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
    [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB],
    [ChainId.ROPSTEN]: [...WRAPPED_NATIVE_ONLY[ChainId.ROPSTEN], Ropsten.DAI, Ropsten.USDC, Ropsten.USDT, Ropsten.WBTC]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
    ...WRAPPED_NATIVE_ONLY,
    [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
    [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
    [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB],
    [ChainId.KOVAN]: [...WRAPPED_NATIVE_ONLY[ChainId.KOVAN]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
    [ChainId.MAINNET]: [
        [SUSHI[ChainId.MAINNET] as Token, WETH[ChainId.MAINNET]],
        [
            new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
            new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
        ],
        [USDC, USDT],
        [DAI, USDT]
    ]
}

export interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconName: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
        connector: injected,
        name: 'Injected',
        iconName: 'arrow-right.svg',
        description: 'Injected web3 provider.',
        href: null,
        color: '#010101',
        primary: true
    },
    METAMASK: {
        connector: injected,
        name: 'Metamask',
        iconName: 'metamask.png',
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D'
    },
    WALLET_CONNECT: {
        connector: walletconnect,
        name: 'WalletConnect',
        iconName: 'walletConnectIcon.svg',
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
        mobile: true,
        // mobileOnly: true
    },
    // LATTICE: {
    //     connector: lattice,
    //     name: 'Lattice',
    //     iconName: 'gridPlusWallet.png',
    //     description: 'Connect to GridPlus Wallet.',
    //     href: null,
    //     color: '#40a9ff',
    //     mobile: true
    // },
    // WALLET_LINK: {
    //     connector: walletlink,
    //     name: 'Coinbase Wallet',
    //     iconName: 'coinbaseWalletIcon.svg',
    //     description: 'Use Coinbase Wallet app on mobile device',
    //     href: null,
    //     color: '#315CF5'
    // },
    // COINBASE_LINK: {
    //     name: 'Open in Coinbase Wallet',
    //     iconName: 'coinbaseWalletIcon.svg',
    //     description: 'Open in Coinbase Wallet app.',
    //     href: 'https://go.cb-w.com',
    //     color: '#315CF5',
    //     mobile: true,
    //     mobileOnly: true
    // }
    // FORTMATIC: {
    //     connector: fortmatic,
    //     name: 'Fortmatic',
    //     iconName: 'fortmaticIcon.png',
    //     description: 'Login using Fortmatic hosted wallet',
    //     href: null,
    //     color: '#6748FF',
    //     mobile: true
    // },
    // Portis: {
    //     connector: portis,
    //     name: 'Portis',
    //     iconName: 'portisIcon.png',
    //     description: 'Login using Portis hosted wallet',
    //     href: null,
    //     color: '#4A6C9B',
    //     mobile: true
    // },
    // Torus: {
    //     connector: torus,
    //     name: 'Torus',
    //     iconName: 'torusIcon.png',
    //     description: 'Login using Torus hosted wallet',
    //     href: null,
    //     color: '#315CF5',
    //     mobile: true
    // }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
    '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
    '0x901bb9583b24D97e995513C6778dc6888AB6870e',
    '0xA7e5d5A720f06526557c513402f2e6B5fA20b008'
]

// BentoBox Swappers
export const BASE_SWAPPER: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: '0x0',
    [ChainId.ROPSTEN]: '0xe4E2540D421e56b0B786d40c5F5268891288c6fb'
}

// Boring Helper
export const BORING_HELPER_ADDRESS = '0x11Ca5375AdAfd6205E41131A4409f182677996E6'

export interface MerkelData {
    merkleRoot: string
    tokenTotal: string
    claims: {
        [key: string]: {
            index: number
            amount: string
            proof: string[]
        }
    }
}

export interface MerkleAmountAndProofs {
    uniqueId: string
    rewardTokenName: string
    amounts: any
    merkel_root: any
    distributorAddress: { [chainId in ChainId]?: string }
    tokenAddress: ChainTokenMap
    decimals: number
    fileName: string
    vesting: any
    disableLockInfo?: boolean
    showComingSoon?: boolean
    tooltip: string
}

export const xSHIB_MERKEL: Array<MerkleAmountAndProofs> = [
    {
        uniqueId: '14',
        rewardTokenName: 'Ryoshis',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/12/21/2021/outputs/BuryShibRyoshi/lockInfo-13637553-13737553.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/12/21/2021/outputs/BuryShibRyoshi/Merkle/',
        distributorAddress: RYOSHIS_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: RYOSHIS_TOKEN,
        decimals: 18,
        fileName: 'buryShibRyoshi',
        vesting: shibaSwapData.swapRyoRewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip:
            'Your Woofed Ryoshis will be released weekly for the next 6 months. Unclaimed amounts will continue to accrue onto the next. Only for xShib holders Rewards are calculated on weekly basis depending on the percentage pool ownership and the total available rewards of that week.'
    }
]

export const xLEASH_MERKEL: Array<MerkleAmountAndProofs> = []

export const MERKEL_AMOUNTS_AND_PROOFS: Array<MerkleAmountAndProofs> = [
    {
        uniqueId: '16',
        rewardTokenName: 'BONE',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/BASIC_R/lockInfo-14142786-14233427.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/BASIC_R/Merkle/',
        distributorAddress: BASIC_BONE_REWARDS_MERKLE_DISTRIBUTOR,
        tokenAddress: BONE,
        decimals: 18,
        fileName: 'basicBone',
        vesting: shibaSwapData.allBasicBoneRewardsVesting,
        showComingSoon: false,
        tooltip: ''
    },
    {
        uniqueId: '10',
        rewardTokenName: 'xFund',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/XFUND/lockInfo-14142786-14233427.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/XFUND/Merkle/',
        distributorAddress: XFUND_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: XFUND_TOKEN,
        decimals: 9,
        fileName: 'xfund',
        vesting: shibaSwapData.swapXFUNDRewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip: 'xFUND rewards are 20 week double rewards program, no xFUND is locked as part of this program.'
    },
    {
        uniqueId: '11',
        rewardTokenName: 'Perl',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/PERL/lockInfo-14170782-14268850.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/PERL/Merkle/',
        distributorAddress: PERL_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: PERL_TOKEN,
        decimals: 18,
        fileName: 'perl',
        vesting: shibaSwapData.swapPerlRewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip: 'PERL rewards are 20 week double rewards program, no PERL is locked as part of this program.'
    },
    {
        uniqueId: '12',
        rewardTokenName: 'F9',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/F9/lockInfo-14142786-14233427.json',
        merkel_root: 'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/F9/Merkle/',
        distributorAddress: F9_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: F9_TOKEN,
        decimals: 9,
        fileName: 'f9',
        vesting: shibaSwapData.swapF9RewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip: 'F9 rewards are 20 week double rewards program, no F9 is locked as part of this program.'
    },
    {
        uniqueId: '13',
        rewardTokenName: 'ZIG',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/12/06/2021/outputs/ZIG/lockInfo-13642570-13730349.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/12/06/2021/outputs/ZIG/Merkle/',
        distributorAddress: ZIG_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: ZIG_TOKEN,
        decimals: 18,
        fileName: 'zig',
        vesting: shibaSwapData.swapZigRewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip: 'ZIG rewards are 20 week double rewards program, no ZIG is locked as part of this program.'
    },
    {
        uniqueId: '15',
        rewardTokenName: 'CIV',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/CIV/lockInfo-14142786-14233427.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/CIV/Merkle/',
        distributorAddress: CIV_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: CIV_TOKEN,
        decimals: 18,
        fileName: 'civ',
        vesting: shibaSwapData.swapCivRewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip: 'CIV rewards are 20 week double rewards program, no CIV is locked as part of this program.'
    },
    {
        uniqueId: '17',
        rewardTokenName: 'UFO',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/UFO/lockInfo-14142786-14233427.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/UFO/Merkle/',
        distributorAddress: UFO_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: UFO_TOKEN,
        decimals: 18,
        fileName: 'ufo',
        vesting: shibaSwapData.swapUFORewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip: 'UFO rewards are 20 week double rewards program, no UFO is locked as part of this program.'
    },
    {
        uniqueId: '18',
        rewardTokenName: 'VEMP',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/VEMP/lockInfo-14142786-14233427.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/02/26/2022/outputs/VEMP/Merkle/',
        distributorAddress: VEMP_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: VEMP_TOKEN,
        decimals: 18,
        fileName: 'vemp',
        vesting: shibaSwapData.swapVempRewardsVesting,
        disableLockInfo: true,
        showComingSoon: false,
        tooltip: 'VEMP rewards are 20 week double rewards program, no VEMP is locked as part of this program.'
    }
]

export const tBONE_MERKEL: Array<MerkleAmountAndProofs> = []

export const OLD_REWARDS: Array<MerkleAmountAndProofs> = [
    {
        uniqueId: '1',
        rewardTokenName: 'Bury Shib Bone',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryShibBone/lockInfo-13244155-13324155.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryShibBone/Merkle/',
        distributorAddress: xSHIB_BONE_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: BONE,
        decimals: 18,
        fileName: 'buryShibBone',
        vesting: shibaSwapData.buryshibBoneVesting,
        showComingSoon: false,
        tooltip:
            'Your Woofed Bone will be released weekly for the next 6 months. Unclaimed amounts will continue to accrue onto the next. Only for xShib holders Rewards are calculated on weekly basis depending on the percentage pool ownership and the total available rewards of that week.'
    },
    {
        uniqueId: '2',
        rewardTokenName: 'WETH',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryShibWeth/lockInfo-13244155-13324155.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryShibWeth/Merkle/',
        distributorAddress: xSHIB_WETH_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: WETH,
        decimals: 18,
        fileName: 'buryShibWeth',
        vesting: shibaSwapData.buryshibWETHVesting,
        showComingSoon: false,
        tooltip:
            'Your Woofed Weth will be released weekly for the next 6 months. Unclaimed amounts will continue to accrue onto the next. Only for xShib holders Rewards are calculated on weekly basis depending on the percentage pool ownership and the total available rewards of that week.'
    },
    {
        uniqueId: '3',
        rewardTokenName: 'Bury Leash Bone',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryLeashBone/lockInfo-13295093-13387621.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryLeashBone/Merkle/',
        distributorAddress: xLEASH_BONE_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: BONE,
        decimals: 18,
        fileName: 'buryLeashBone',
        vesting: shibaSwapData.buryleashBoneVesting,
        tooltip:
            'Your Woofed Bone will be released weekly for the next 6 months. Unclaimed amounts will continue to accrue onto the next. Only for xLeash holders Rewards are calculated on weekly basis depending on the percentage pool ownership and the total available rewards of that week.'
    },
    {
        uniqueId: '8',
        rewardTokenName: 'Bury Bone Bone',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryBoneBone/lockInfo-13295093-13387621.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/BuryBoneBone/Merkle/',
        distributorAddress: tBONE_BONE_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: BONE,
        decimals: 18,
        fileName: 'buryBoneBone',
        vesting: shibaSwapData.buryboneBoneVesting,
        tooltip:
            'Your Woofed Bone will be released weekly for the next 6 months. Unclaimed amounts will continue to accrue onto the next. Only for tBone holders Rewards are calculated on weekly basis depending on the percentage pool ownership and the total available rewards of that week.'
    },
    {
        uniqueId: '4',
        rewardTokenName: 'USDC',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/USDC/lockInfo-13293229-13387621.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/USDC/Merkle/',
        distributorAddress: USDC_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: USDCToken,
        decimals: 6,
        fileName: 'usdc',
        vesting: shibaSwapData.swapUSDCRewardsVesting,
        tooltip: `
        ONLY FOR LEASH-ETH SSLP Stakers.
        33% of your USDC  rewards are distributed weekly. You can Woof them while they accrue. The remaining 67% of the rewards are time-locked for 6 months.
        Rewards are calculated on weekly basis, depending on your share of the pool, and the total available rewards of that week.
        `
    },
    {
        uniqueId: '5',
        rewardTokenName: 'WBTC',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/WBTC/lockInfo-13293229-13387621.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/WBTC/Merkle/',
        distributorAddress: WBTC_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: WBTCToken,
        decimals: 8,
        fileName: 'wbtc',
        vesting: shibaSwapData.swapWBTCRewardsVesting,
        tooltip: `
        ONLY FOR LEASH-ETH SSLP Stakers.
        33% of your WBTC  rewards are distributed weekly. You can Woof them while they accrue. The remaining 67% of the rewards are time-locked for 6 months.
        Rewards are calculated on weekly basis, depending on your share of the pool, and the total available rewards of that week.
        `
    },
    {
        uniqueId: '6',
        rewardTokenName: 'DAI',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/DAI/lockInfo-13293229-13387621.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/DAI/Merkle/',
        distributorAddress: DAI_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: DAIToken,
        decimals: 18,
        fileName: 'dai',
        vesting: shibaSwapData.swapDAIRewardsVesting,
        tooltip: `
        ONLY FOR BONE-ETH SSLP Stakers.
        33% of your DAI  rewards are distributed weekly. You can Woof them while they accrue. The remaining 67% of the rewards are time-locked for 6 months.
        Rewards are calculated on weekly basis, depending on your share of the pool, and the total available rewards of that week.
        `
    },
    {
        uniqueId: '7',
        rewardTokenName: 'USDT',
        amounts:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/USDT/lockInfo-13293229-13387621.json',
        merkel_root:
            'https://raw.githubusercontent.com/KaalDhairya/rewards-distribution/10/11/2021/outputs/USDT/Merkle/',
        distributorAddress: USDT_MERKLE_DISTRIBUTOR_ADDRESS,
        tokenAddress: USDTToken,
        decimals: 6,
        fileName: 'usdt',
        vesting: shibaSwapData.swapUSDTRewardsVesting,
        tooltip: `
        ONLY FOR BONE-ETH SSLP Stakers.
        33% of your USDT  rewards are distributed weekly. You can Woof them while they accrue. The remaining 67% of the rewards are time-locked for 6 months.
        Rewards are calculated on weekly basis, depending on your share of the pool, and the total available rewards of that week.
        `
    }
]

export const BONE_REWARD_UNIQUEID = '9'

export const FARMS = [
    {
        id: 0,
        type: 'SSLP',
        symbol: 'SHIB-WBTC',
        name: 'SHIBA INU / WBTC',
        pid: 0,
        allocation: 500,
        pairAddress: '0xd217398Bb4F4B0C2DaE75007caE3e27c8476A13C',
        liquidityPair: {
            token0: {
                id: '0x0b2367E0e56Fd9b63388F1478830c8a4b1bA5963',
                name: 'SHIBA INU',
                symbol: 'SHIB'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 1,
        type: 'SSLP',
        symbol: 'LEASH-WBTC',
        name: 'LEASH / WBTC',
        pid: 1,
        allocation: 700,
        pairAddress: '0xD54004D93fa52cECC2c69a93A124C1360DB2748f',
        liquidityPair: {
            token0: {
                id: '0xf90e84b13FaA6a50A5c361a8d35019C4236b1582',
                name: 'LEASH',
                symbol: 'LEASH'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 2,
        type: 'SSLP',
        symbol: 'WETH-WBTC',
        name: 'WETH / WBTC',
        pid: 2,
        allocation: 300,
        pairAddress: '0x82586467E3d00FfC1Cb7B0eB864414353d452093',
        liquidityPair: {
            token0: {
                id: '0xaE15AcEB46f6477543F2BF641d9547FB8607a9fE',
                name: 'WETH',
                symbol: 'WETH'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'Wrapped Bitcoin',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 3,
        type: 'SSLP',
        symbol: 'WBTC-USDC',
        name: 'WBTC / USDC',
        pid: 3,
        allocation: 300,
        pairAddress: '0x619497EbFDf1d6aFaA7A402D515d9B78141B3794',
        liquidityPair: {
            token0: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            },
            token1: {
                id: '0x72dd868Fe89113531b18f997844b77563CB665b8',
                name: 'USDC',
                symbol: 'USDC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 4,
        type: 'SSLP',
        symbol: 'SUSHI-WBTC',
        name: 'SUSHI / WBTC',
        pid: 4,
        allocation: 300,
        pairAddress: '0x5db2F84df83D1c6fE2ce0255a26C39d9de65572D',
        liquidityPair: {
            token0: {
                id: '0xa4cf91da62F3AB5DFF84ceB5aec7DC47c774E7B2',
                name: 'SUSHI',
                symbol: 'SUSHI'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 5,
        type: 'SSLP',
        symbol: 'UNI-WBTC',
        name: 'UNI / WBTC',
        pid: 5,
        allocation: 300,
        pairAddress: '0x2f7F8B9d3414f33F87139cfFbF0aF78E7f55e28f',
        liquidityPair: {
            token0: {
                id: '0xd0893E6047a9a539B23c2FD272a59b876A8A43F3',
                name: 'UNI',
                symbol: 'UNI'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 6,
        type: 'SSLP',
        symbol: 'LINK-WBTC',
        name: 'LINK / WBTC',
        pid: 6,
        allocation: 100,
        pairAddress: '0x8123a0900464A64df58eDF913d159f3D70EB808E',
        liquidityPair: {
            token0: {
                id: '0xb176FbDD8e53458Fc6AA01208105412Ff67c56ab',
                name: 'LINK',
                symbol: 'LINK'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 7,
        type: 'SSLP',
        symbol: 'DAI-WBTC',
        name: 'DAI / WBTC',
        pid: 7,
        allocation: 100,
        pairAddress: '0x086CBc20e242eb589A449c1FE70C5f0836f1d2E8',
        liquidityPair: {
            token0: {
                id: '0x560EA439FA3c8ee6A4cE43a2A74320AcE26Aa97a',
                name: 'DAI',
                symbol: 'DAI'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 8,
        type: 'SSLP',
        symbol: 'MEME-WBTC',
        name: 'MEME / WBTC',
        pid: 8,
        allocation: 50,
        pairAddress: '0x48697f4660984DcD43FD8F3ABce21f29ae8516e0',
        liquidityPair: {
            token0: {
                id: '0xD72b6f5865f13a6cB0fBf1A96838763063867ca2',
                name: 'MEME',
                symbol: 'MEME'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 9,
        type: 'SSLP',
        symbol: 'GRT-WBTC',
        name: 'GRT / WBTC',
        pid: 9,
        allocation: 50,
        pairAddress: '0x0fAf7758E3b2AD1b9cB707378791034D66FFBeb4',
        liquidityPair: {
            token0: {
                id: '0xaA8Ed9e5e75892ab055D30CCd77676D293956F55',
                name: 'GRT',
                symbol: 'GRT'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 10,
        type: 'SSLP',
        symbol: 'DUCK-WBTC',
        name: 'DUCK / WBTC',
        pid: 10,
        allocation: 50,
        pairAddress: '0xf7ECa944a4FcE52F08935d6D95d6194e10494C99',
        liquidityPair: {
            token0: {
                id: '0x746715f016f76a610E276265A7bf3F79AdDc6E66',
                name: 'DUCK',
                symbol: 'DUCK'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    },
    {
        id: 11,
        type: 'SSLP',
        symbol: 'BONE-WBTC',
        name: 'BONE / WBTC',
        pid: 11,
        allocation: 3000,
        pairAddress: '0xAb36F8a0E1034D80A41d64Ea9518fC7FB8D1d944',
        liquidityPair: {
            token0: {
                id: '0x6d4bB7b0559Aebfc55A42cFEAAeb287c01a7f244',
                name: 'BONE',
                symbol: 'BONE'
            },
            token1: {
                id: '0x3673628B0a9B27480c57026FCddc9Ac16d61A6EA',
                name: 'WBTC',
                symbol: 'WBTC'
            }
        },
        tvl: 0,
        sslpBalance: 0,
        roiPerYear: 0
    }
]

export const shiberseContractAddresses = {
    [ChainId.MAINNET] : {
        'LEASH_TOKEN': '0x27C70Cd1946795B66be9d954418546998b546634',
        'SHIBOSHI_TOKEN': '0x11450058d796B02EB53e65374be59cFf65d3FE7f',
        'BONE': '0x9813037ee2218799597d83D4a5B6F3b6778218d9',
        'STAKE_LEASH': '0xCdEfD353Ba028a77C1cFbbF9571E7A19df582380',
        'STAKE_SHIBOSHI': '0xBe4E191B22368bfF26aA60Be498575C477AF5Cc3',
        'MOCKSALE': ''
    },
    [ChainId.ROPSTEN]: {
        'LEASH_TOKEN': '0x62efD9F0e349d83b0aa6c01FC5a9a5D3A0DF0F2D',
        'SHIBOSHI_TOKEN': '0x253A46a5C75c667f19203BCD638819478AB9bBab',
        'BONE': '0x5CA454a716de461Ad2E0afF716c367b35901eD57',
        'STAKE_LEASH': '0x96e799C44bC3B05bc78C3e110A2512C06D0eC3e7',
        'STAKE_SHIBOSHI': '0x5c4943d7bb2de8034e211d7b512ab0a1d6ef581c',
        'MOCKSALE': '0x736f9284b43c058b84a5e32ab57942db6cc5c1aa'
    },
    [ChainId.RINKEBY]: {
        'LEASH_TOKEN': '0x673f2692b432EAF69B50fE9C46657e8a5dC89599',
        'SHIBOSHI_TOKEN': '0x253A46a5C75c667f19203BCD638819478AB9bBab',
        'BONE': '0x5CA454a716de461Ad2E0afF716c367b35901eD57',
        'STAKE_LEASH': '0x7eB5E13128e20f6c8d77f6b95Ee7CD0128f86D1D',
        'STAKE_SHIBOSHI': '0x0F432c22FaFF300c9D62daa61fBD9f8cBe5A20d7',
        'MOCKSALE': '0x736f9284b43c058b84a5e32ab57942db6cc5c1aa',
        'LAND_AUCTION': '0xB71352a05a4AD5F90717A456a03a8966A3ffE61E'
    }
}

/* For development network : Rinkby */
export const mainNetworkChainId = ChainId.RINKEBY

/* For product network : Main net */
// export const mainNetworkChainId = ChainId.MAINNET

export const alchemyApi = {
    [ChainId.MAINNET]: {
        'api_key': 'WA2AXzOrXOj664de25fmJr7dSzsQXx42',
        'https': 'https://eth-mainnet.alchemyapi.io/v2/WA2AXzOrXOj664de25fmJr7dSzsQXx42',
        'wss': 'wss://eth-mainnet.alchemyapi.io/v2/WA2AXzOrXOj664de25fmJr7dSzsQXx42'
    },
    [ChainId.RINKEBY]: {
        'api_key': '98S0aeOjT9paE0bz4424qsAk9QndTBUi',
        'https': 'https://eth-rinkeby.alchemyapi.io/v2/98S0aeOjT9paE0bz4424qsAk9QndTBUi',
        'wss': 'wss://eth-rinkeby.alchemyapi.io/v2/98S0aeOjT9paE0bz4424qsAk9QndTBUi'        
    }
}

export const metadataURL = 'https://shiboshis.mypinata.cloud/ipfs/QmUEiYGcZJWZWp9LNCTL5PGhGcjGvokKfcaCoj23dbp79J/'