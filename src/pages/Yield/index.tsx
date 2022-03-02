/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/rules-of-hooks */
import { useActiveWeb3React, useContract, useFuse, useSortableData } from 'hooks'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import CrossImage from '../../assets/images/home/close.png'
import styled, { ThemeContext } from 'styled-components'
import useShibaSwapFarms from 'hooks/useShibaSwapFarms';
import { RowBetween, AutoRow } from '../../components/Row'
import { formattedNum, formatLessThan, isAddress, secondsToTime, formattedPercent, tempCountDays } from '../../utils'
import { Card, CardHeader, Paper, Search, DoubleLogo, TokenLogo } from './components'
import InputGroup from './InputGroup'
// import { Dots } from 'kashi/components'
import { Helmet } from 'react-helmet'
import { CardHeading, Col, CardsubTitle } from '../../pages/Home/Card'
import YieldImage from '../../assets/images/home/yield_icon.svg'
import { BONE, JSBI, Pair, TokenAmount, USDT } from '@shibaswap/sdk'
import { FACTORY_ADDRESS as SUSHI_FACTORY_ADDRESS } from '@sushiswap/sdk'
import { FACTORY_ADDRESS as UNI_FACTORY_ADDRESS } from '@uniswap/sdk'
import Fraction from '../../entities/Fraction'
import { BigNumber } from 'ethers'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleSelfClaimModal } from 'state/application/hooks'
import { useClaimCallback, useUserUnclaimedAmount } from 'state/claim/hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { CloseIcon, TYPE } from '../../theme'
import { CardSection, DataCard, CardSectionAuto } from 'components/earn/styled'
import Loader from 'components/Loader'
import QuestionHelper from 'components/QuestionHelper'
import { ButtonPrimary } from 'components/ButtonLegacy'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { transparentize } from 'polished'
import { MERKEL_AMOUNTS_AND_PROOFS, FARMS, USDC, BONE_REWARD_UNIQUEID, MerkleAmountAndProofs } from '../../constants'
import YieldModal from '../Yield/YieldModal'
import useBoneLocker from 'hooks/useBoneLocker'
import { MigrateV2, MigrateV2Sushi, filterLiquidityPair } from '../MigrateV2'
import Modal from 'components/Modal';
import useMigrateState from 'hooks/useMigrateState';
import { Button } from './components'
import { ChevronRight } from 'react-feather'
import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { HelpCircle as Question } from 'react-feather'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { NavLink } from '../../components/Link'
import shibaSwapData from '@shibaswap/shibaswap-data-snoop'
import useSWR from 'swr'
import { request } from 'graphql-request'

const QuestionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: none;
    background: none;
    outline: none;
    cursor: default;
    border-radius: 36px;
    // background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text2};

    :hover,
    :focus {
        opacity: 0.7;
    }
` 
const Dots = styled.span`
    &::after {
        display: inline-block;
        animation: ellipsis 1.25s infinite;
        content: '.';
        width: 1em;
        text-align: left;
    }
    @keyframes ellipsis {
        0% {
            content: '.';
        }
        33% {
            content: '..';
        }
        66% {
            content: '...';
        }
    }
`

const PageWrapper = styled(AutoColumn)`
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
`

const VoteCard = styled(DataCard)`
  overflow: hidden;
`

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`


export default function Yield(): JSX.Element {
    const query = useShibaSwapFarms()
    const farms = query?.farms
    // const farms = FARMS
    // const userFarms = query?.userFarms
    // console.log(farms)
    const userFarms = [] as any

    // Search Setup
    const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }
    const { result, search, term } = useFuse({
        data: farms && farms.length > 0 ? farms : [],
        options
    })
    
    const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))
    // Sorting Setup
    const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults, {key: "allocation", direction: "descending"})

    const theme = useContext(ThemeContext)

    const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
    const toggleClaimModal = useToggleSelfClaimModal()

    const { account, chainId } = useActiveWeb3React()

    // get user claim data
    // const userClaimData = useUserClaimData(account)

    const [showModal, setShowModal] = useState<boolean>(false)

    const handleDismiss = useCallback(() => {
        setShowModal(false)
    }, [setShowModal])


    const boneLocker = useBoneLocker();

    const [claimableAmount, setClaimableAmount] = useState('0')

    useEffect(() => {
        boneLocker?.fetchClaimableAmount().then(
            (value)=>{
                if(value && !isNaN(parseInt(value))){
                    setClaimableAmount(value)
                }
            }
        )
    }, [boneLocker, chainId])

    const [lockedAmount, setLockedAmount] = useState('-')

    useEffect(() => {
        boneLocker?.fetchLockedAmount().then(
            (value)=>{
                if(value && !isNaN(parseInt(value))){
                    const amount = Fraction.from(
                        BigNumber.from(value),
                        BigNumber.from(10).pow(18)
                    ).toString()
                    setLockedAmount(amount)
                }
            }
        )
    }, [boneLocker, chainId])

    const [totalCliamed, setTotalClaimed] = useState('-')

    useEffect(() => {
        boneLocker?.totalClaimed().then(
            (value)=>{
                if(value && !isNaN(parseInt(value))){
                    const amount = Fraction.from(
                        BigNumber.from(String(value)),
                        BigNumber.from(10).pow(18)
                        ).toString()
                    setTotalClaimed(amount)
                }
            }
        )
    }, [boneLocker, chainId])


    const [nextLocktTime, setNextLockTime] = useState('0')

    useEffect(() => {
        boneLocker?.nextLockDate().then(
            (value)=>{
                value && setNextLockTime(value.toString())
            }
        )
    }, [boneLocker, chainId, nextLocktTime])


    const date = new Date(parseInt(nextLocktTime))
    const dateBone = parseInt(nextLocktTime) !== 0 ? date.toLocaleString() : '-'

    const token = chainId ? BONE[chainId] : undefined
    const claimAmount = token && claimableAmount? new TokenAmount(token, JSBI.BigInt(parseInt(claimableAmount))) : undefined
    const boneAmount = {unclaimedAmount: claimAmount, onClaim: boneLocker.claimAll, totalLocked: lockedAmount, tokenName: "BONE", uniqueId: BONE_REWARD_UNIQUEID, claimed:totalCliamed, nextLockDate: dateBone}

    const [countDown, setcountDown] = useState("-")
    useEffect(()=>{
        setInterval(()=>{
            if(parseInt(nextLocktTime)){
                const currenDate = new Date()
                const timeDiff = date.getTime() - currenDate.getTime();
                const countD = secondsToTime(timeDiff)
                setcountDown(countD)
            }
        }, 1000)
    }, [date, nextLocktTime])

    const [rewardCountDown, setRewardCountDown] = useState("-")
    useEffect(()=>{
        setInterval(()=>{
            const currenDate = new Date()
            const target = new Date("2021-07-18")
            const timeDiff = target.getTime() - currenDate.getTime();
            const countD = tempCountDays(timeDiff)
            setRewardCountDown(countD)
        }, 1000)
    }, [])

    // remove once treasury signature passed
    const pendingTreasurySignature = false
    
    const stateUNI = useMigrateState('unifetch', UNI_FACTORY_ADDRESS)
    const stateSushi = useMigrateState('sushifetch', SUSHI_FACTORY_ADDRESS[chainId ? chainId : 1])
    // console.log(stateUNI)

    return (
        <>
            <Helmet>
                <title>WOOF | ShibaSwap</title>
                <meta name="description" content="Farm BONE by staking LP (Liquidity Provider) tokens" />
            </Helmet>
            <div className="container relative yield_card_mobile my-auto">
                <div className="row">
                <div className="col-lg-12 col-xl-6">
                <Card
                    className="h-full yield-card fetch-container"
                    header={
                        <CardHeader className="flex justify-between items-center">
                            <div className="flex w-full justify-between">
                                <div className="items-center">
                                    {/* <BackButton defaultRoute="/pool" /> */}
                                    <CardHeading>WOOF</CardHeading>
                                    <CardsubTitle className="flex-end">Claim your returns</CardsubTitle>
                                    <div className="text-gray-5000 text mr-12 mt-4" style={{fontSize:"15px"}}>When you deposit or withdraw your SSLP, all of your pending BONE for that pool will be WOOFED automatically.</div>
                                    <br />
                                </div>
                            </div>
                            <div className="image-div -mt-20">
                                <img src={YieldImage} width="40" height="40" />
                            </div>
                        </CardHeader>
                        
                    }
                >
                    <div className="row ml-2 mr-2 -mt-8" style={{marginBottom:"18px"}}>
                        <p className=" read-more font-medium no-underline not-italic" style={{fontSize:"15px"}} 
                        onClick={() => {
                                        setShowModal(true)
                                    }}>
                                        <div className="tooltips">
                                                <QuestionWrapper className="float-left m-0.5">
                                                    <Question size={14} />
                                                </QuestionWrapper>
                                                <span className="hebbo-font" style={{ fontSize: "14px" }}>Read more about how to claim your returns</span>
                                            </div>
                                        
                        
                        </p>
                    </div>
                    
                    {/* <Search search={search} term={term} /> */}
                    {/* UserFarms */}
                    {userFarms && userFarms.length > 0 && (
                        <>
                            <div className="pb-4">
                                <div className="grid grid-cols-3 pb-4 px-4 text-sm  text-secondary">
                                    <div className="flex items-center">
                                        <div>Your Yields</div>
                                    </div>
                                    {/* {/* <div className="flex items-center justify-end">
                                        <div>Deposited</div>
                                    </div> */}
                                    <div className="flex items-center justify-end">
                                        <div>Claim</div>
                                    </div>
                                </div>
                                <div className="flex-col space-y-2">
                                    {userFarms.map((farm: any, i: number) => {
                                        return <UserBalance key={farm.address + '_' + i} farm={farm} />
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                    {/* All Farms */}
                    <div className="grid grid-cols-3 pb-4 px-4 text-sm  text-secondary">
                        <div
                            className="flex items-center cursor-pointer hover:text-secondary"
                            onClick={() => requestSort('symbol')}
                        >
                            {/* <div>Instruments</div> */}
                            {sortConfig &&
                                sortConfig.key === 'symbol' &&
                                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                    (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                        </div>
                        <div className="hover:text-secondary cursor-pointer relative -bottom-2.5" onClick={() => requestSort('tvl')}>
                           <div className="flex items-center justify-end">
                               <div>TVL</div>
                               {sortConfig &&
                                   sortConfig.key === 'tvl' &&
                                   ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                       (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                           </div>
                        </div>
                        <div className="hover:text-secondary cursor-pointer relative -bottom-2.5" onClick={() => requestSort('roiPerYear')}>
                           <div className="flex items-center justify-end">
                               <div>APR</div>
                               {sortConfig &&
                                   sortConfig.key === 'roiPerYear' &&
                                   ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                       (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                           </div>
                        </div>
                    </div>
                    <div className="flex-col space-y-2">
                        {items && items.length > 0 ? (
                            items.map((farm: any, i: number) => {
                                return <TokenBalance key={farm.address + '_' + i} farm={farm} stateUNI={stateUNI} stateSUSHI={stateSushi} />
                            })
                        ) : (
                            <>
                                {term ? (
                                    <div className="w-full text-center py-6">No Results.</div>
                                ) : (
                                    <div className="w-full text-center py-6">
                                        <Dots>Fetching Instruments</Dots>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
                </div>  
                <div className="col-lg-12 col-xl-6">
                    <div className="row">
                    <VoteCard className="col-md-12 col-lg-12 col-xl-12 relative h-full -mt-4 yield_card">
                        <CardSectionAuto gap="sm" className="fetch-container votecontainer relative">
                            <NavLink to="/archive">
                                <TYPE.white fontSize={'18px'} style={{textAlign:'center', textDecoration: 'underline'}}>
                                    Archived rewards 
                                </TYPE.white>
                            </NavLink>
                        </CardSectionAuto>
                    </VoteCard>
                    {MERKEL_AMOUNTS_AND_PROOFS && MERKEL_AMOUNTS_AND_PROOFS.length > 0 &&
                    (
                        MERKEL_AMOUNTS_AND_PROOFS.map((merkel, i)=>{
                            if(merkel.rewardTokenName === "BONE"){
                                return <VoteCard key={i} className="col-md-12 col-lg-12 col-xl-12 relative h-full -mt-4 yield_card">
                                    <RewardBox merkel={merkel} pendingTreasurySignature={pendingTreasurySignature} 
                                            theme={theme} account={account} />
                                </VoteCard>
                            }
                            return <VoteCard key={i} className="col-md-6 col-lg-3 col-xl-6 relative h-full -mt-4 yield_card">
                                <RewardBox merkel={merkel} pendingTreasurySignature={pendingTreasurySignature} 
                                        theme={theme} account={account} />
                            </VoteCard>
                                
                        })
                    )}
                    <VoteCard className="col-md-12 col-lg-12 col-xl-12 relative h-full -mt-4 yield_card">
                        <BoneRewardBox boneAmount={boneAmount} pendingTreasurySignature={pendingTreasurySignature} 
                                        theme={theme} account={account} countDown={countDown} />
                        </VoteCard>
                </div>
                </div>
                </div>
            </div>
            <YieldModal
                isOpen={showModal}
                onDismiss={handleDismiss}
            />
        </>
    )
}

const MigrateButton = ({state, liquidityPair, type, onClick }: any) => {
    const pairs = filterLiquidityPair(state, liquidityPair)
    if(pairs && pairs.length > 0 && pairs[0].balance.toFixed(0) !== '0'){
        return (
            <Button
                color="blue"
                onClick={onClick}
                className="col-sm ml-1 mr-4"
            >
                Migrate {pairs[0].balance.toFixed(4)} {type} LP
            </Button>
            )
        }
    return <></>
}

const TokenBalance = ({ farm, stateUNI, stateSUSHI }: any) => {
    const [expand, setExpand] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [pair, setPair] = useState<any>(null)
    const [type, setType] = useState<String>("UNI")

    return (
        <>
            
            <Modal isOpen={showModal} onDismiss={()=>{setShowModal(false)}} padding={2} maxHeight={90}>
                {pair && type==="UNI"?<MigrateV2 pair={pair} /> : <MigrateV2Sushi pair={pair} /> }
            </Modal>
            {farm.type === 'SSLP' && (
                <Paper className="bg-dark-9000">
                    <div className="cursor-pointer" onClick={() => setExpand(!expand)}>
                    <div
                        className="grid grid-cols-3 py-4 px-4 select-none rounded text-sm"
                    >
                        <div className="flex items-center pt-1">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={farm.liquidityPair.token0.id}
                                    a1={farm.liquidityPair.token1.id}
                                    size={32}
                                    margin={true}
                                />
                            </div>
                            <div className="whitespace-pre relative -bottom-0.5">
                                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right pt-1">{formattedNum(farm.tvl, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.sslpBalance / 1e18, false)} SSLP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center pt-1">
                            <div className="text-right font-semibold text-xl">
                                {formattedPercent(farm.roiPerYear * 100)}{' '}
                            </div>
                        </div>
                    </div>
                   {expand ? (
                        <div className="text-right text-gray-5000 text-sm relative right-2">
                        <span>Click to close</span> <img height={11} width={11} src={CrossImage} className="inline ml-1 mr-2"/>
                        </div>
                    ) : (
                        <div className="text-right text-gray-5000 text-sm relative right-2">
                        <span>Click to open</span> <ChevronRight className="inline"/>
                    </div>
                    )}
                    </div>
                    {expand && (
                        <div>
                            <InputGroup
                                pid={farm.pid}
                                pairAddress={farm.pairAddress}
                                pairSymbol={farm.symbol}
                                token0Address={farm.liquidityPair.token0.id}
                                token1Address={farm.liquidityPair.token1.id}
                                type={'LP'}
                            />
                            <div className="woof_cards pb-4">
                                <div className="row migrate">
                                <MigrateButton 
                                    state={stateUNI} 
                                    liquidityPair={farm.liquidityPair}
                                    type="UNI-V2"
                                    onClick={()=>{
                                        setType("UNI")
                                        setPair(farm.liquidityPair)
                                        setShowModal(true)
                                    }} 
                                />
                                <MigrateButton 
                                    state={stateSUSHI} 
                                    liquidityPair={farm.liquidityPair}
                                    type="SUSHI"
                                    onClick={()=>{
                                        setType("SUSHI")
                                        setPair(farm.liquidityPair)
                                        setShowModal(true)
                                    }} 
                                />
                                </div>
                            </div>
                        </div>
                    )}
                </Paper>
            )}
        </>
    )
}

const UserBalance = ({ farm }: any) => {
    const [expand, setExpand] = useState<boolean>(false)
    return (
        <>
            {farm.type === 'SSLP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={farm.liquidityPair.token0.id}
                                    a1={farm.liquidityPair.token1.id}
                                    size={26}
                                    margin={true}
                                />
                            </div>
                            <div className="whitespace-pre">
                                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
                            </div>
                        </div>
                        {/* <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.depositedUSD, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.depositedLP, false)} SSLP
                                </div>
                            </div>
                        </div> */}
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.pendingBone)} </div>
                                <div className="text-secondary text-right">BONE</div>
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.token0.id}
                            token1Address={farm.liquidityPair.token1.id}
                            type={'LP'}
                        />
                    )}
                </Paper>
            )}
          
        </>
    )
}


export function RewardBox({
    theme,
    account,
    pendingTreasurySignature,
    merkel
  }:{
    theme: any,
    account: any,
    pendingTreasurySignature: boolean,
    merkel: MerkleAmountAndProofs
  }): JSX.Element{

    const unclaimedAmount: TokenAmount | undefined = !merkel.showComingSoon? useUserUnclaimedAmount(account, merkel): undefined
    // monitor the status of the claim from contracts and txns
    const { claimCallback } = useClaimCallback(account, merkel)
    const tokenName = merkel.rewardTokenName;

    const [totalLocked, setTotalLocked] = useState<string>()
    const [totalClaimed, setTotalClaimed] = useState<string>()
    const [nextLockDate, setNextLockDate] = useState<any>("-")
    useEffect(() => {
        const fetchLockup = async () => {
            if (account && !merkel.showComingSoon) {
                fetch(merkel.amounts)
                    .then(response => response.json())
                    .then(data => {
                        // console.log('vesting:', data)
                        const userLockedInfo = data[account.toLowerCase()] ? data[account.toLowerCase()] : undefined
                        if(userLockedInfo){
                            const userLocked = Fraction.from(
                                BigNumber.from(Number(userLockedInfo.locked).toLocaleString('fullwide', {useGrouping: false})),
                                BigNumber.from(10).pow(merkel.decimals)
                            ).toString()
                            setTotalLocked(userLocked)
                            setTotalClaimed(userLockedInfo.totalClaimed.toString())
                            const date = new Date(parseInt(userLockedInfo.nextLockDate))
                            const dateLock = date?.toLocaleString() ?? "-"
                            setNextLockDate(dateLock)
                        }
                        // console.log('userLocked:', userLocked)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            return []
        }
        fetchLockup()
    }, [account])
  
    const [pendingTx, setPendingTx] = useState<string | null>(null)
  
    function onClaimClick(){
        claimCallback().then((hash:any)=>{
        setPendingTx(hash)
      }).catch((err: any)=>{
        console.error(err)
      })
    }
  
    const attempting = useIsTransactionPending(pendingTx ?? undefined)

    const [claimedtill, setClaimedTill] = useState<string>()

    useEffect(()=>{
        const fetchClaim = async () =>{
            merkel.vesting.users().then((claims:any[])=>{
                const TotalClaimedTill = claims.find(u => account?.toLowerCase() === u.id)?.totalClaimed ?? 0    
                setClaimedTill((TotalClaimedTill*Math.pow(10,18-merkel.decimals)).toString())
            })
            return []
        }
        fetchClaim()
    },[])
  
    return(
        <CardSection gap="sm" className="yield-card fetch-container votecontainer relative">
            <RowBetween>
                <TYPE.white fontWeight={700} color={theme.text1} className="yield_fonts pr-4">
                    {tokenName === "BONE"? 
                        <span>Your Cumulative Bone Rewards</span> 
                    :
                    <span>Woofable {tokenName} this Week</span>
                    }
                </TYPE.white>

                <QuestionHelper text={merkel.tooltip} /> 
                {/* <QuestionHelper text={`33% of your ${amount.tokenName} rewards are distributed weekly. You can Woof them while they accrue. The remaining 67% of the rewards are time-locked for 6 months.
                 Only for ${amount.tokenName === "WBTC" || amount.tokenName === "USDC"? "Leash-Weth" : "Bone-Weth"} SSLP stakers. Rewards are calculated on weekly basis depending on the percentage pool ownership and the total available rewards of that week. `} /> */}



                 
            </RowBetween>
            {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
            <div style={{ alignItems: 'baseline' }}>
                <TYPE.white fontWeight={700} fontSize={36} color={theme.text1} className="yield_fonts">
                    {account && formatLessThan(unclaimedAmount)}
                </TYPE.white>
                <TYPE.white fontWeight={500} fontSize={15} color={theme.text3}>
                    <p className="green_title">Woofed till now: {formattedNum(claimedtill)}</p> 
                    {!merkel.disableLockInfo &&
                        <div>
                            <p>UnWoofable: {formattedNum(totalLocked)}</p>
                            <p>Woofable date: {nextLockDate}</p>
                        </div>
                    }
                    {/* {amount.tokenName === "WBTC" || amount.tokenName === "USDC"?
                    <p>Only for Leash-Weth SSLP stakers</p>
                    :
                    <p>Only for Bone-Weth SSLP stakers</p>
                    } */}
                    
                </TYPE.white>
            </div>
            { merkel.showComingSoon?
          <ButtonPrimary
          className="yield_button yield"
              disabled={true}
              padding="16px 16px"
              width="100%"
              borderRadius="10px"
              mt="0.5rem"
          >
                  <> {`Coming Soon...`}</>
          </ButtonPrimary>
          :
            <ButtonPrimary
                className="yield_button yield"
                disabled={
                    !isAddress(account ?? '') ||
                    attempting ||
                    !unclaimedAmount ||
                    Number(unclaimedAmount?.toFixed(unclaimedAmount?.token.decimals)) <= 0 ||
                    pendingTreasurySignature
                }
                padding="16px 16px"
                width="100%"
                borderRadius="10px"
                mt="0.5rem"
                onClick={onClaimClick}
            >
                {pendingTreasurySignature ? (
                    <Dots>Pending Treasury Transfer</Dots>
                ) : (
                    <> {`WOOF ${tokenName}`}</>
                )}

                {attempting && <Loader stroke="white" style={{ marginLeft: '10px' }} />}
            </ButtonPrimary>
            }
            {/* <ButtonPrimary
                className="yield_button yield"
                disabled={true}
                padding="16px 16px"
                width="100%"
                borderRadius="10px"
                mt="0.5rem"
            >
                In {rewardCountDown}
            </ButtonPrimary> */}
        </CardSection>
    ) 
  }

  export function BoneRewardBox({
    boneAmount,
    theme,
    account,
    pendingTreasurySignature,
    countDown
  }:{
    boneAmount: any,
    theme: any,
    account: any,
    pendingTreasurySignature: boolean,
    countDown?: any
  }): JSX.Element{
  
    const [pendingTx, setPendingTx] = useState<string | null>(null)
  
    function onClaimClick(){
        boneAmount.onClaim().then((hash:any)=>{
        setPendingTx(hash)
      }).catch((err: any)=>{
        console.error(err)
      })
    }
  
    const attempting = useIsTransactionPending(pendingTx ?? undefined)
  
    return(
        <CardSection gap="sm" className="yield-card fetch-container votecontainer relative">
            <RowBetween>
                <TYPE.white fontWeight={700} color={theme.text1} className="yield_fonts pr-4">
                    Woofable {boneAmount.tokenName}
                </TYPE.white>
                <QuestionHelper text={`67% of your generated BONE will be time-locked for 6 months. They can be WOOFED after the locking period is complete`} />
            </RowBetween>
            {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
            <div style={{ alignItems: 'baseline' }}>
                <TYPE.white fontWeight={700} fontSize={36} color={theme.text1} className="yield_fonts">
                    {account && formatLessThan(boneAmount.unclaimedAmount)}
                </TYPE.white>
                <TYPE.white fontWeight={500} fontSize={15} color={theme.text3}>
                    <p className="green_title">Woofed until now: {formattedNum(boneAmount.claimed)}</p> 
                    <p>UnWoofable: {formattedNum(boneAmount.totalLocked)}</p>
                    <p>Woofable next date: {boneAmount.nextLockDate}</p>
                </TYPE.white>
            </div>

            <ButtonPrimary
                className="yield_button yield"
                disabled={
                    !isAddress(account ?? '') ||
                    attempting ||
                    !boneAmount.unclaimedAmount ||
                    Number(boneAmount.unclaimedAmount?.toFixed(boneAmount.unclaimedAmount.token.decimals)) <= 0 ||
                    pendingTreasurySignature
                }
                padding="16px 16px"
                width="100%"
                borderRadius="10px"
                mt="0.5rem"
                onClick={onClaimClick}
            >
                {pendingTreasurySignature ? (
                    <Dots>Pending Treasury Transfer</Dots>
                ) : (
                    <> 
                        <p> {
                            Number(boneAmount.unclaimedAmount?.toFixed(boneAmount.unclaimedAmount.token.decimals)) > 0 ?
                            (`WOOF ${boneAmount.tokenName}`)
                        : "Next Woof in : " + countDown
                        } </p>
                        
                    </>
                )}

                {attempting && <Loader stroke="white" style={{ marginLeft: '10px' }} />}
            </ButtonPrimary>
        </CardSection>
    ) 
  }