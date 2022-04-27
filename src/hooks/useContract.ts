import { Contract } from '@ethersproject/contracts'
import {
    ChainId,
    SUSHI_FACTORY_ADDRESS,
    WETH,
    SHIBASWAP_ROUTER_ADDRESS,
    SHIBASWAP_FACTORY_ADDRESS,
    SHIBASWAP_SHIB_TOKEN_ADDRESS,
    SHIBASWAP_BONE_TOKEN_ADDRESS,
    SHIBASWAP_LEASH_TOKEN_ADDRESS,
    SHIBASWAP_BURY_SHIB_ADDRESS,
    SHIBASWAP_BURY_BONE_ADDRESS,
    SHIBASWAP_BURY_LEASH_ADDRESS,
    SHIBASWAP_TOPDOG_ADDRESS,
    SHIBASWAP_UNI_FETCH_ADDRESS,
    SHIBASWAP_SUSHI_FETCH_ADDRESS,
    SHIBA_BORING_HELPER_ADDRESS,
    SHIBA_DASHBOARD_1_ADDRESS,
    SHIBA_DASHBOARD_2_ADDRESS,
    BONE_LOCKER_ADDRESS
} from '@shibaswap/sdk'
import SHIBASWAP_UNI_FETCH_ABI from '../constants/abis/ShibaUniFetch.json'; //TODO GOLIVE
import SHIBASWAP_SUSHI_FETCH_ABI from '../constants/abis/ShibaSushiFetch.json'; //TODO GOLIVE

import { abi as UNI_ABI } from '@uniswap/governance/build/Uni.json'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'
import { abi as MERKLE_DISTRIBUTOR_ABI } from '@uniswap/merkle-distributor/build/MerkleDistributor.json'
import { FACTORY_ADDRESS as UNI_FACTORY_ADDRESS } from '@uniswap/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { abi as UNI_FACTORY_ABI } from '@uniswap/v2-core/build/UniswapV2Factory.json'

import { useMemo } from 'react'
import { BORING_HELPER_ADDRESS, mainNetworkChainId, MERKLE_DISTRIBUTOR_ADDRESS, shiberseContractAddresses, SUSHI } from '../constants'
import {
    ARGENT_WALLET_DETECTOR_ABI,
    ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
} from '../constants/abis/argent-wallet-detector'
import BORING_HELPER_ABI from '../constants/abis/boring-helper.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import BAR_ABI from '../constants/abis/bar.json'
import BENTOBOX_ABI from '../constants/abis/bentobox.json'
import CHAINLINK_ORACLE_ABI from '../constants/abis/chainlink-oracle.json'
import DASHBOARD_ABI from '../constants/abis/dashboard.json'
import SHIBA_DASHBOARD1_ABI from '../constants/abis/shibadashboard1.json' //TODO GOLIVE
import SHIBA_DASHBOARD2_ABI from '../constants/abis/shibadashboard2.json' //TODO GOLIVE
import BONE_LOCKER_ABI from '../constants/abis/bone-locker.json' //TODO GOLIVE_S

import DASHBOARD2_ABI from '../constants/abis/dashboard2.json'
import SUSHI_FACTORY_ABI from '../constants/abis/factory.json'
import KASHIPAIR_ABI from '../constants/abis/kashipair.json'
import MAKER_ABI from '../constants/abis/maker.json'
import MASTERCHEF_ABI from '../constants/abis/masterchef.json'
import PENDING_ABI from '../constants/abis/pending.json'
import ROUTER_ABI from '../constants/abis/router.json'
import SAAVE_ABI from '../constants/abis/saave.json'
import SUSHI_ABI from '../constants/abis/sushi.json'
import BASE_SWAPPER_ABI from '../constants/abis/swapper.json'
import TIMELOCK_ABI from '../constants/abis/timelock.json'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'

import SHIBASWAP_TOPDOG_ABI from '../constants/abis/shibaswap_topdog.json' //TODO GOLIVE
import SHIBASWAP_ROUTER_ABI from '../constants/abis/shibaswap_uniswapv2router02.json' //TODO GOLIVE
import SHIBASWAP_FACTORY_ABI from '../constants/abis/shibaswap_uniswapv2factory.json' //TODO GOLIVE

import SHIBASWAP_BURY_SHIB_ABI from '../constants/abis/shibaswap_buryshib.json' //TODO GOLIVE
import SHIBASWAP_BURY_LEASH_ABI from '../constants/abis/shibaswap_buryleash.json' //TODO GOLIVE
import SHIBASWAP_BURY_BONE_ABI from '../constants/abis/shibaswap_burybone.json' //TODO GOLIVE

// These will change from erc20.json to the actual ones in mainnet only needed if they are not standard ERC20
import SHIBASWAP_SHIB_TOKEN_ABI from '../constants/abis/shibaswap_erc20.json' //TODO GOLIVE
import SHIBASWAP_LEASH_TOKEN_ABI from '../constants/abis/shibaswap_erc20.json' //TODO GOLIVE
import SHIBASWAP_BONE_TOKEN_ABI from '../constants/abis/shibaswap_erc20.json' //TODO GOLIVE

import SHIBASWAP_ERC20 from '../constants/abis/shibaswap_erc20.json' //TODO GOLIVE

import SHIBERSE_STAKE_LEASH_ABI from '../constants/abis/shiberse_stakeleash.json'
import SHIBERSE_STAKE_SHIBOSHI_ABI from '../constants/abis/shiberse_stakeshiboshi.json'

import SHIBERSE_LEASH_TOKEN_ABI from '../constants/abis/shiberse_leashToken.json'
import SHIBERSE_SHIBOSHI_TOKEN_ABI from '../constants/abis/shiberse_shiboshi.json'

import SHIBERSE_LANDAUCTION_ABI from '../constants/abis/shiberse_landAuction.json'
import SHIBERSE_LANDAUCTIONV2_ABI from '../constants/abis/shiberse_landAuctionV2.json'
import SHIBERSE_LANDAUCTIONV3_ABI from '../constants/abis/shiberse_landAuctionV3.json'
import SHIBERSE_LANDREGISTRY from '../constants/abis/shiberse_landregistry.json';

// returns null on errors
export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
    const { library, account } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
    return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(
        chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
        ARGENT_WALLET_DETECTOR_ABI,
        false
    )
}

//TODO HIGHPRIORITY_INVESTIGATE
export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
            case ChainId.GÖRLI:
            case ChainId.ROPSTEN:
            case ChainId.RINKEBY:
                address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
                break
        }
    }
    return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
    return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMerkleDistributorContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useShibaMerkleDistributorContract(distributorAaddress: { [chainId in ChainId]?: string }): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? distributorAaddress[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useUniContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? SUSHI[chainId]?.address : undefined, UNI_ABI, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible)
}

export function useBoringHelperContract(): Contract | null {
    return useContract(BORING_HELPER_ADDRESS, BORING_HELPER_ABI, false)
}

export function useShibaHelperContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBA_BORING_HELPER_ADDRESS[chainId], BORING_HELPER_ABI, false)
}

export function useBoneLockerContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && BONE_LOCKER_ADDRESS[chainId], BONE_LOCKER_ABI , true)
}

export function useMulticallContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

// experimental:
export function useUniV2FactoryContract(): Contract | null {
    return useContract(UNI_FACTORY_ADDRESS, UNI_FACTORY_ABI, false)
}

export function useFetchFactoryToken(tokenFetchKey:string){

    const { chainId } = useActiveWeb3React()
    let factoryAbi : any;
    let address : string | undefined;

    switch(tokenFetchKey){
        case "unifetch" :
            address = UNI_FACTORY_ADDRESS
            factoryAbi = UNI_FACTORY_ABI;
            break;

        case "sushifetch" :
            address = chainId && SUSHI_FACTORY_ADDRESS[chainId]
            factoryAbi = SUSHI_FACTORY_ABI;
            break;

        default:
            break;
    }

    return useContract(address,factoryAbi,false);
}

export function useTokenFetch(tokenFetchKey:string){
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    let swapFetchAbi : any;

    if(chainId){
        switch(tokenFetchKey){
            case "unifetch" :
                address = SHIBASWAP_UNI_FETCH_ADDRESS[chainId];
                swapFetchAbi = SHIBASWAP_UNI_FETCH_ABI;
                break;

            case "sushifetch" :
                address = SHIBASWAP_SUSHI_FETCH_ADDRESS[chainId];
                swapFetchAbi = SHIBASWAP_SUSHI_FETCH_ABI;
                break;

            default:
                break;
        }
    }

    return useContract(address, swapFetchAbi, true)
}

export function useShibaSwapUniV2FetchContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_UNI_FETCH_ADDRESS[chainId], SHIBASWAP_UNI_FETCH_ABI, false)
}

export function useShibaSwapSushiFetchContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_SUSHI_FETCH_ADDRESS[chainId], SHIBASWAP_SUSHI_FETCH_ABI, false)
}
export function useDashboardContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0xD132Ce8eA8865348Ac25E416d95ab1Ba84D216AF'
                break
            case ChainId.ROPSTEN:
                address = '0xC95678C10CB8b3305b694FF4bfC14CDB8aD3AB35'
                break
            case ChainId.KOVAN:
                address = '0x7803a532dadE25d89116bfd995850dc0d3c59EC9'
                break
        }
    }
    return useContract(address, DASHBOARD_ABI, false)
}
// TODO GOLIVE_T
export function useShibaSwapDashboard1Contract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBA_DASHBOARD_1_ADDRESS[chainId], SHIBA_DASHBOARD1_ABI, false)
}
// TODO GOLIVE_S
export function useShibaSwapDashboard2Contract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBA_DASHBOARD_2_ADDRESS[chainId], SHIBA_DASHBOARD2_ABI, false)
}

export function useDashboard2Contract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0x1B13fC91c6f976959E7c236Ac1CF17E052d113Fc'
                break
            case ChainId.ROPSTEN:
                address = '0xbB7091524A6a42228E396480C9C43f1C4f6c50e2'
                break
            case ChainId.KOVAN:
                address = '0x0c7d4ABd92eAAA91Caf8447666D7244B6474ca89'
                break
        }
    }
    return useContract(address, DASHBOARD2_ABI, false)
}

//Equivalent to MasterChef
export function useShibaSwapTopDogContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_TOPDOG_ADDRESS[chainId], SHIBASWAP_TOPDOG_ABI, withSignerIfPossible)
}

// UniswapRouter
export function useShibaSwapRouterContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_ROUTER_ADDRESS[chainId], SHIBASWAP_ROUTER_ABI, false)
}

// UniswapFactory
export function useShibaSwapFactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_FACTORY_ADDRESS[chainId], SHIBASWAP_FACTORY_ABI, false)
}

// Sushi Bar equivalent
export function useShibaSwapBuryBoneContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_BURY_BONE_ADDRESS[chainId], SHIBASWAP_BURY_BONE_ABI, withSignerIfPossible)
}

// Sushi Bar equivalent
export function useShibaSwapBuryLeashContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_BURY_LEASH_ADDRESS[chainId], SHIBASWAP_BURY_LEASH_ABI, withSignerIfPossible)
}

// Sushi Bar equivalent
export function useShibaSwapBuryShibContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_BURY_SHIB_ADDRESS[chainId], SHIBASWAP_BURY_SHIB_ABI, withSignerIfPossible)
}

// Shib Token
export function useShibaSwapShibTokenContract(withSignerIfPossible = true): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_SHIB_TOKEN_ADDRESS[chainId], SHIBASWAP_SHIB_TOKEN_ABI, withSignerIfPossible)
}

// Leash Token
export function useShibaSwapLeashTokenContract(withSignerIfPossible = true): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_LEASH_TOKEN_ADDRESS[chainId], SHIBASWAP_LEASH_TOKEN_ABI, withSignerIfPossible)
}

// Bone Token
export function useShibaSwapBoneTokenContract(withSignerIfPossible = true): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SHIBASWAP_BONE_TOKEN_ADDRESS[chainId], SHIBASWAP_BONE_TOKEN_ABI, withSignerIfPossible)
}

export function useShibaSwapTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, SHIBASWAP_ERC20, withSignerIfPossible)
}

export function useShibaSwapBuryTokenContract(tokenType?: string, withSignerIfPossible?: boolean): Contract | null{
    const { chainId } = useActiveWeb3React()
    
    let buryAddress : string;
    let buryAbi : any;

    switch(tokenType){
        case 'SHIB':
            buryAddress = SHIBASWAP_BURY_SHIB_ADDRESS[chainId ?? 1];
            buryAbi = SHIBASWAP_BURY_SHIB_ABI;
            break;
        case 'LEASH':
            buryAddress = SHIBASWAP_BURY_LEASH_ADDRESS[chainId ?? 1];
            buryAbi = SHIBASWAP_BURY_LEASH_ABI;
            break;
        case 'BONE':
            buryAddress = SHIBASWAP_BURY_BONE_ADDRESS[chainId ?? 1];
            buryAbi = SHIBASWAP_BURY_BONE_ABI;
            break;
        default:
            buryAddress = SHIBASWAP_BURY_SHIB_ADDRESS[chainId ?? 1];
            buryAbi = SHIBASWAP_BURY_SHIB_ABI;
            break;
        
    } 

    return useContract(chainId && buryAddress, buryAbi, withSignerIfPossible)
}

export function useShiberseTokenContract( tokenType?: string, withSignerIfPossible?: boolean ): Contract | null {
    let tokenAddress : string
    let tokenAbi : any

    switch( tokenType ) {
        case 'LEASH':
            tokenAddress = shiberseContractAddresses[mainNetworkChainId]['LEASH_TOKEN']
            tokenAbi = SHIBERSE_LEASH_TOKEN_ABI
            break;
        case 'SHIBOSHI':
            tokenAddress = shiberseContractAddresses[mainNetworkChainId]['SHIBOSHI_TOKEN']
            tokenAbi = SHIBERSE_SHIBOSHI_TOKEN_ABI
            break;
        default:
            tokenAddress = shiberseContractAddresses[mainNetworkChainId]['LEASH_TOKEN']
            tokenAbi = SHIBERSE_LEASH_TOKEN_ABI
            break;
    }

    return useContract(tokenAddress, tokenAbi, withSignerIfPossible)
}

export function useShiberseStakeContract( tokenType?: string, withSignerIfPossible?: boolean ): Contract | null{
    const { chainId } = useActiveWeb3React()

    let stakeAddress : string
    let stakeAbi : any

    switch( tokenType ) {
        case 'LEASH':
            stakeAddress = shiberseContractAddresses[mainNetworkChainId]['STAKE_LEASH']
            stakeAbi = SHIBERSE_STAKE_LEASH_ABI
            break;
        case 'SHIBOSHI':
            stakeAddress = shiberseContractAddresses[mainNetworkChainId]['STAKE_SHIBOSHI']
            stakeAbi = SHIBERSE_STAKE_SHIBOSHI_ABI
            break;
        default:
            stakeAddress = shiberseContractAddresses[mainNetworkChainId]['STAKE_LEASH']
            stakeAbi = SHIBERSE_STAKE_LEASH_ABI
            break;
    }

    return useContract( chainId && stakeAddress, stakeAbi, withSignerIfPossible )
}

export function useShiberseLandAuctionContract( withSignerIfPossible?: boolean ): Contract | null{
    const contractAddress = shiberseContractAddresses[mainNetworkChainId]['LAND_AUCTION']
    const contractAbi = SHIBERSE_LANDAUCTION_ABI

    return useContract( contractAddress, contractAbi, withSignerIfPossible )
}

export function useShiberseLandAuctionV2Contract( withSignerIfPossible?: boolean ): Contract | null{
    const contractAddress = shiberseContractAddresses[mainNetworkChainId]['LAND_AUCTIONV2']
    const contractAbi = SHIBERSE_LANDAUCTIONV2_ABI

    return useContract( contractAddress, contractAbi, withSignerIfPossible )
}

export function useShiberseLandAuctionV3Contract( withSignerIfPossible?: boolean ): Contract | null{
    const contractAddress = shiberseContractAddresses[mainNetworkChainId]['LAND_AUCTIONV3']
    const contractAbi = SHIBERSE_LANDAUCTIONV3_ABI

    return useContract( contractAddress, contractAbi, withSignerIfPossible )
}

export function useShiberseLandRegistryContract( withSignerIfPossible?: boolean ): Contract | null{
    const contractAddress = shiberseContractAddresses[mainNetworkChainId]['LAND_NFT']
    const contractAbi = SHIBERSE_LANDREGISTRY

    return useContract( contractAddress, contractAbi, withSignerIfPossible )
}