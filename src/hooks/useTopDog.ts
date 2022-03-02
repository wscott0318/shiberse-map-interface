import { ethers } from 'ethers'
import { useShibaSwapTopDogContract} from 'hooks'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'

const useTogDog = () => {
    const addTransaction = useTransactionAdder()
    const topDogContract = useShibaSwapTopDogContract() // withSigner

    // Deposit
    const deposit = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            // KMP decimals depend on asset, SLP is always 18
            try {
                const tx = await topDogContract?.deposit(pid, ethers.utils.parseUnits(amount, decimals))
                return addTransaction(tx, { summary: `Deposit ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [addTransaction, topDogContract]
    )

    // Withdraw
    const withdraw = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            try {
                const tx = await topDogContract?.withdraw(pid, ethers.utils.parseUnits(amount, decimals))
                return addTransaction(tx, { summary: `Withdraw ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [addTransaction, topDogContract]
    )

    const harvest = useCallback(
        async (pid: number, name: string) => {
            try {
                const tx = await topDogContract?.deposit(pid, '0')
                addTransaction(tx, { summary: `WOOF ${name} FOR BONE` })
                return tx;
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [addTransaction, topDogContract]
    )

    return { deposit, withdraw, harvest }
}

export default useTogDog
