import { ethers } from 'ethers'
import { Fraction } from '../entities'
import { useActiveWeb3React, useBoneLockerContract } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'

const { BigNumber } = ethers

const useBoneLocker = () => {
    const { account } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const boneLockerContract = useBoneLockerContract() // withSigner

    const [claimableAmount, setClaimableAmount] = useState('')
    const [lockedAmount, setLockedAmount] = useState('')
    const [leftCorner, setLeftCorner] = useState('')
    const [rightCorner, setRightCorner] = useState('')

    const fetchClaimableAmount = useCallback(async () => {
        if (account && boneLockerContract) {
            try {
                const balance = await boneLockerContract.getClaimableAmount(account)
                const formatted = BigNumber.from(balance).toString()
                setClaimableAmount(formatted)
                return claimableAmount
            } catch(e) {
                console.error(e)
                return e
            }
        }
    }, [account, boneLockerContract, claimableAmount]);


    useEffect(() => {
        
        if (account && boneLockerContract) {
            fetchClaimableAmount()
        }
        // const refreshInterval = setInterval(fetchClaimableAmount, 5000)
        // return () => clearInterval(refreshInterval)


    }, [account, boneLockerContract, fetchClaimableAmount])


    const fetchLockedAmount = useCallback(async () => {
        if (account && claimableAmount && boneLockerContract) {
            try {
                const locked = await boneLockerContract.unclaimedTokensByUser(account)
                const unClaimable: any = BigNumber.from(locked).sub(claimableAmount).toString()
                setLockedAmount(unClaimable)
                return lockedAmount
            } catch(e) {
                console.error(e)
                return e
            }
        }
    }, [account, boneLockerContract, claimableAmount, lockedAmount]);

    const fetchLeftRightCorners = useCallback(async () => {
        if (account && boneLockerContract) {
            try {
                const corners = await boneLockerContract.getLeftRightCounters(account)
                setRightCorner(BigNumber.from(corners['1']).toString())
                setLeftCorner(BigNumber.from(corners['0']).toString())
                return rightCorner
            } catch(e) {
                console.error(e)
                return e
            }
        }
    }, [account, boneLockerContract, rightCorner]);

    useEffect(() => {
        if (account && boneLockerContract) {
            fetchLeftRightCorners()
        }
        // const refreshInterval = setInterval(fetchLeftRightCorners, 10000)
        // return () => clearInterval(refreshInterval)
    }, [account, boneLockerContract, fetchLeftRightCorners])

    const claimAll = useCallback(async () => {
        if (account && rightCorner && boneLockerContract) {
            try{
                const args = [rightCorner]
                const amnt = Fraction.from(BigNumber.from(claimableAmount), BigNumber.from(10).pow(18)).toString()
                return boneLockerContract.estimateGas['claimAll']( rightCorner,{from: account, value: 0}).then(estimatedGasLimit => {
                    return boneLockerContract
                        .claimAll(rightCorner, { from: account, value: 0, gasLimit: calculateGasMargin(estimatedGasLimit) })
                        .then((response: TransactionResponse) => {
                            addTransaction(response, {
                                summary: `Claimed ${parseFloat(amnt).toFixed(4)} Bones`,
                                claim: { recipient: account }
                            })
                            return response.hash
                        })
                }).catch(e=>{
                    console.error(e)
                })
            }catch(e){
                console.error(e)
                return e
            }
        }
    }, [account, rightCorner, boneLockerContract, claimableAmount, addTransaction]);

    const fetchLockInfoByLockId = useCallback(async ( lockId ) => {
        if (account && boneLockerContract) {
            try {
                const lockInfo = await boneLockerContract.lockInfoByUser(account, lockId)
                return lockInfo
            } catch(e) {
                console.error(e)
                return e
            }
        }
    }, [account, boneLockerContract]);

    const nextLockDate = useCallback(async () => {
        if (account && boneLockerContract && leftCorner && rightCorner) {
            try {
                for(let lockId = parseInt(leftCorner); lockId < parseInt(rightCorner); lockId++){
                    const lockInfo = await fetchLockInfoByLockId(lockId.toString())
                    let lockperiod
                    if(Boolean(lockInfo._isDev)){
                        lockperiod = await boneLockerContract?.devLockingPeriod();
                    }else{
                        lockperiod = await boneLockerContract?.lockingPeriod();
                    }
                    const timestamp = lockInfo._timestamp
                    const dateLock = new Date((parseInt(timestamp)+parseInt(lockperiod))*1000)
                    const datenow = new Date()
                    if(dateLock>datenow)
                        return dateLock.getTime()
                }
                return 0;
            } catch(e) {
                console.error(e)
                return e
            }
        }
    }, [account, boneLockerContract, fetchLockInfoByLockId, leftCorner, rightCorner]);

    const totalClaimed = useCallback(async () => {
        if (account && boneLockerContract && leftCorner) {
            try {
                let claimed = BigNumber.from('0');
                for(let lockId = 0; lockId < parseInt(leftCorner); lockId++){
                    const lockInfo = await fetchLockInfoByLockId(lockId.toString())
                    claimed = claimed.add(lockInfo._amount)
                }
                return claimed.toString();
            } catch(e) {
                console.error(e)
                return e
            }
        }
    }, [account, boneLockerContract, fetchLockInfoByLockId, leftCorner]);

    return {fetchClaimableAmount, fetchLockedAmount, claimAll, nextLockDate, totalClaimed}
}

export default useBoneLocker
