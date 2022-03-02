import { BigNumber } from '@ethersproject/bignumber'
import {useActiveWeb3React, useShibaSwapTopDogContract} from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { Fraction } from '../entities'

const useShibaSwapPendingBone = (pid: number) => {
    const [balance, setBalance] = useState<string>('0')
    const { account } = useActiveWeb3React()

    const topDogContract = useShibaSwapTopDogContract()
    const currentBlockNumber = useBlockNumber()

    const fetchPending = useCallback(async () => {
        const pending = await topDogContract?.pendingBone(pid, account)
        const formatted = Fraction.from(BigNumber.from(pending), BigNumber.from(10).pow(18)).toString()
        setBalance(formatted)
    }, [account, topDogContract, pid])

    useEffect(() => {
        if (account && topDogContract && String(pid)) {
            // pid = 0 is evaluated as false
            fetchPending()
        }
    }, [account, currentBlockNumber, fetchPending, topDogContract, pid])

    return balance
}

export default useShibaSwapPendingBone
