import { useWeb3React } from '@web3-react/core'
import { mainNetworkChainId } from '../../constants'
import { useCallback, useEffect } from 'react'

export default function Updater(): null {
    const { active, library, chainId } = useWeb3React()

    const switchNetwork = useCallback(async () => {
        await library.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x' + mainNetworkChainId.toString(16) }],
        });
    }, [library, chainId])

    useEffect(() => {
        if( active && chainId !== mainNetworkChainId ) {
           switchNetwork() 
        }
    }, [library, chainId, active])

    return null
}
