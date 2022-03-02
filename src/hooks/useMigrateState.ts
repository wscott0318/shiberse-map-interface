import { parseUnits } from '@ethersproject/units'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import { useIsTransactionPending, useTransactionAdder } from '../state/transactions/hooks'
import useLPTokensState, { LPTokensState } from './useLPTokensState'
import useShibaFetch from "./useShibaFetch";

export type MigrateMode = 'permit' | 'approve'

export interface MigrateState extends LPTokensState {
    amount: string
    setAmount: (amount: string) => void
    mode?: MigrateMode
    setMode: (_mode?: MigrateMode) => void
    onMigrate: () => Promise<void>
    pendingMigrationHash: string | null
    isMigrationPending: boolean
}

const useMigrateState: (tokenFetchKey:string, fetchTokenAddress:string) => MigrateState = (tokenFetchKey:string, fetchTokenAddress:string) => {

    const { library, account } = useActiveWeb3React()
    const state = useLPTokensState(tokenFetchKey,fetchTokenAddress)
    const { migrate, migrateWithPermit } = useShibaFetch(tokenFetchKey)
    const [mode, setMode] = useState<MigrateMode>()
    const [amount, setAmount] = useState('')
    const addTransaction = useTransactionAdder()
    const [pendingMigrationHash, setPendingMigrationHash] = useState<string | null>(null)
    const isMigrationPending = useIsTransactionPending(pendingMigrationHash ?? undefined)

    useEffect(() => {
        state.setSelectedLPToken(undefined)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode])

    const onMigrate = useCallback(async () => {
        if (mode && state.selectedLPToken && account && library) {
            const units = parseUnits(amount || '0', state.selectedLPToken.decimals)
            const func = mode === 'approve' ? migrate : migrateWithPermit
            const tx = await func(state.selectedLPToken, units)

            addTransaction(tx, { summary: `Migrate Uniswap ${state.selectedLPToken.symbol} liquidity to ShibaSwap` })
            setPendingMigrationHash(tx.hash)

            await tx.wait()
            state.setSelectedLPToken(undefined)
            await state.updateLPTokens()
        }
    }, [mode, state, account, library, amount, migrate, migrateWithPermit, addTransaction])

    return {
        ...state,
        amount,
        setAmount,
        mode,
        setMode,
        onMigrate,
        pendingMigrationHash,
        isMigrationPending
    }
}
export default useMigrateState
