import React, { useState, useEffect, useCallback } from 'react'
// import axios from 'axios'
import { SPACE } from '../../graphql/config'
import {
    pairsQuery,
    PAIR_DENY,
    pairsTimeTravelQuery,
    getSevenDayBlock,
    getOneDayBlock,
    useInterval
} from '../../graphql/getPairs'
import { shibaExchange, snapshotHub } from 'apollo/client'
import { Heading, Section, Card } from '../Proposal/Proposal.elements'
import QuestionHelper from '../../components/QuestionHelper'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import SnapModal from './SnapModal'
import * as _ from 'lodash'
import './index.css'
import {
    ListGroup,
    ListItem,
    Address,
    CardHead,
    Div,
    P,
    CardBody,
    Status,
    Select,
    Option,
    OptionLabel,
    Progress,
    ActiveButton,
    CardHeading
} from './SnapShot.elements'

import SortableTable from '../../components/SortableTable/SortableTable'
import IsLoadingHOC from '../../helper/IsLoaderHOC'
import { useLocation, useParams } from 'react-router'
import { gql, useQuery } from '@apollo/client'
import snapshot from '@snapshot-labs/snapshot.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import { DateFormat } from '../../helper/dateformat'
import { isNil, isNull, isUndefined, omitBy } from 'lodash'
import styled, { ThemeContext } from 'styled-components'
import StakeDepositPanel from '../../pages/Bury/StakeDepositPanel'
import BuryWithdrawlPanel from '../../pages/Bury/BuryWithdrawlPanel'
import {
    // SHIBASWAP_SHIB_TOKEN_ADDRESS,
    SHIBASWAP_BONE_TOKEN_ADDRESS,
    // SHIBASWAP_LEASH_TOKEN_ADDRESS,
    SHIBASWAP_BURY_BONE_ADDRESS
    // SHIBASWAP_BURY_SHIB_ADDRESS,
    // SHIBASWAP_BURY_LEASH_ADDRESS,
    // TokenAmount,
    // DAI,
    // USDC,
    // WBTC,
    // USDT,
    // WETH,
} from '@shibaswap/sdk'

import { useActiveWeb3React } from '../../hooks'
import usePrices from 'hooks/usePrices'
import { HelpCircle as Question } from 'react-feather'
const snapConst = require('../../constants/snapshot/constants.json')
const StakeSection = styled.div`
    width: 100%;
    height: auto;
    margin: auto;
    margin-top: 0;
    text-align: center;

    @media (max-width: 800px) {
        text-align: center;
        width: 100%;
    }
`

const StakeButton = styled.div`
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    font-family: 'Heebo' !important;
    letter-spacing: 0.1px;
    line-height: normal;
    float: right;
    margin: 10px 10px;
    cursor: pointer;
`

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

const SnapShot = props => {
    const { account, activate, library } = useWeb3React()
    const location = useLocation()
    if (location.state) {
        sessionStorage.setItem('snapLocation', JSON.stringify(location.state))
    }
    const lastLoc = sessionStorage.getItem('snapLocation') ? JSON.parse(sessionStorage.getItem('snapLocation')) : ''
    location.state = location.state ? location.state : lastLoc
    const { start, author, choices, state, title, space, end } = location.state

    const { id } = useParams()

    const [DataForVote, setDataForVote] = useState({
        percentage1: 0,
        percentage2: 0,
        power1: 0,
        power2: 0
    })

    const GET_VOTES = gql`
        query Votes($proposal: String!) {
            proposals(first: 20, skip: 0, where: { id: $proposal }, orderBy: "created", orderDirection: desc) {
                id
                title
                body
                choices
                start
                end
                snapshot
                state
                author
                type
                space {
                    id
                    name
                }
            }
            votes(first: 1000000, skip: 0, where: { proposal: $proposal }, orderBy: "created", orderDirection: desc) {
                id
                voter
                created
                proposal {
                    id
                    title
                    body
                    choices
                    start
                    end
                    snapshot
                    state
                    author
                    created
                    plugins
                    network
                    type
                }
                choice
                space {
                    id
                    name
                }
            }
        }
    `
    const { chainId } = useActiveWeb3React()
    let { tokenName } = useParams()

    const { bonePrice } = usePrices()

    tokenName = tokenName == undefined ? snapConst.REACT_APP_BONE : tokenName

    const tokenAddresses = () => {
        return {
            tokenAddress: SHIBASWAP_BONE_TOKEN_ADDRESS && chainId ? SHIBASWAP_BONE_TOKEN_ADDRESS[chainId] : '',
            buryTokenAddress: SHIBASWAP_BURY_BONE_ADDRESS && chainId ? SHIBASWAP_BURY_BONE_ADDRESS[chainId] : '',
            tokenType: tokenName.toLowerCase(),
            tokenPrice: bonePrice
        }
    }

    const { tokenType, tokenAddress, buryTokenAddress, tokenPrice } = tokenAddresses()

    const [showModal, setShowModal] = useState(false)
    const [votesData, setVotesData] = useState([])
    const [spaceData, setSpaceData] = useState([])
    const [pairsData, setPairsData] = useState({})
    const [proposalData, setProposalData] = useState([])
    const [currentResultData, setCurrentResultData] = useState([])
    const [voteUpdate, setVoteUpdate] = useState(0)
    const [voteDetails, setVoteDetails] = useState([])
    const [myScore, setMyScore] = useState(0)
    const [choiceType, setChoiceType] = useState('')
    const [isStakeSelected, setIsStakeSelected] = useState(true)
    // const [datas, setData] = useState( {} );
    const [type, setType] = useState(0)

    const { data, refetch, loading } = useQuery(GET_VOTES, {
        variables: { proposal: id }
    })

    const LIMIT = 10
    const LENGTH = voteDetails.length
    const [showMore, setShowMore] = useState(true)
    const [list, setList] = useState([])
    const [index, setIndex] = useState(0)

    useEffect(() => {
        refetch()
    }, [voteUpdate])
    useEffect(() => {
        props.setLoading(loading)
    }, [loading])
    useEffect(() => {
        spaceDatafetch()
        if (data) {
            setVotesData(data.votes)
            if (data.proposals.length) {
                setChoiceType(data.proposals[0].type)
                setProposalData(data.proposals[0])
            }
        }
    }, [data, voteUpdate])

    useEffect(() => {
        // if (votesData.length > 0) {
        if (choiceType == 'single-choice') {
            onclickbutton()
        } else {
            getCurrentResult()
        }
        // }
    }, [votesData])

    useEffect(() => {
        if (list.length < 10) {
            // console.log('list'+LIMIT)
            const sliceList = voteDetails

            setTimeout(() => {
                const slicer = sliceList.sort((data1, data2) => (data1.score >= data2.score ? -1 : 1)).map(data => data)
                // console.log(sliceList.slice(0, 10))
                setList(list.concat(slicer.slice(0, 10)))
            }, 500)

            // loadMore()
        }
    }, [voteDetails])
    const handleDismiss = useCallback(() => {
        setShowModal(false)
    }, [setShowModal])

    const spaceDatafetch = async () => {
        const apiResult = await snapshotHub.query({
            // results[1]
            query: SPACE,
            variables: {}
        })
        // const apiResult = await axios.post(API, {
        //     query: SPACE
        // })
        props.setLoading(true)
        await getPairs()
        const result = apiResult.data.space
        setSpaceData(result)
        props.setLoading(false)
    }
    const locales = ['en-US']
    const currencyFormatter = new Intl.NumberFormat(locales, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    const getPairs = async () => {
        props.setLoading(true)
        const apiResult = await shibaExchange.query({
            query: pairsQuery
        })

        const pairList = {}

        const sevenDayBlock = await getSevenDayBlock()
        const oneDayBlock = await getOneDayBlock()

        const pairAddresses = apiResult.data.pairs.map(pair => pair.id).sort()
        const {
            data: { pairs: sevenDayPairs }
        } = await shibaExchange.query({
            query: pairsTimeTravelQuery,
            variables: {
                block: sevenDayBlock,
                pairAddresses
            },
            fetchPolicy: 'no-cache'
        })

        const {
            data: { pairs: oneDayPairs }
        } = await shibaExchange.query({
            query: pairsTimeTravelQuery,
            variables: {
                block: oneDayBlock,
                pairAddresses
            },
            fetchPolicy: 'no-cache'
        })

        const rows = apiResult.data.pairs
            .filter(row => {
                return !PAIR_DENY.includes(row.id)
            })
            .map(pair => {
                const sevenDayPair = sevenDayPairs.find(({ id }) => pair.id === id)
                const oneDayPair = oneDayPairs.find(({ id }) => pair.id === id)

                const oneDay = {
                    untrackedVolumeUSD: String(oneDayPair?.untrackedVolumeUSD),
                    volumeUSD: String(oneDayPair?.volumeUSD),
                    reserveUSD: String(oneDayPair?.reserveUSD),
                    txCount: String(oneDayPair?.txCount)
                }

                const sevenDay = {
                    untrackedVolumeUSD: String(sevenDayPair?.untrackedVolumeUSD),
                    volumeUSD: String(sevenDayPair?.volumeUSD),
                    reserveUSD: String(sevenDayPair?.reserveUSD),
                    txCount: String(oneDayPair?.txCount)
                }
                // const twoDayVolumeUSD = pair?.twoDay?.volumeUSD === "0" ? pair?.twoDay?.untrackedVolumeUSD : pair?.twoDay?.volumeUSD
                // console.log("volPaor");    console.log(pair);
                const volumeUSD = pair?.volumeUSD === '0' ? pair?.untrackedVolumeUSD : pair?.volumeUSD

                const oneDayVolumeUSD = oneDay?.volumeUSD === '0' ? oneDay?.untrackedVolumeUSD : oneDay?.volumeUSD

                const sevenDayVolumeUSD =
                    sevenDay?.volumeUSD === '0' ? sevenDay?.untrackedVolumeUSD : sevenDay?.volumeUSD

                const oneDayVolume = volumeUSD - oneDayVolumeUSD
                const oneDayFees = oneDayVolume * 0.003
                const oneYearFees = (oneDayVolume * 0.003 * 365 * 100) / pair.reserveUSD
                const sevenDayVolume = volumeUSD - sevenDayVolumeUSD

                return {
                    ...pair,
                    displayName: `${pair.token0.symbol.replace('WETH', 'ETH')}-${pair.token1.symbol.replace(
                        'WETH',
                        'ETH'
                    )}`,
                    // oneDayVolume: !Number.isNaN(oneDayVolume) ? oneDayVolume : 0,
                    sevenDayVolume: !Number.isNaN(sevenDayVolume) ? sevenDayVolume : 0,
                    oneDayFees: !Number.isNaN(oneDayFees) ? oneDayFees : 0,
                    oneYearFees
                }
            })

        rows.map(pair => {
            pairList[pair.name] = pair
        })
        // console.log(rows)
        // console.log(pairList['A12-WETH'])
        setPairsData(pairList)
        props.setLoading(false)
    }

    const generatePayloadData = () => {
        return {
            version: '0.1.3',
            timestamp: (Date.now() / 1e3).toFixed(),
            space: snapConst.REACT_APP_SPACE
        }
    }

    function handleStakeSelect(selectedKey) {
        setIsStakeSelected(selectedKey === 'Stake')
    }

    const loadMore = () => {
        const newIndex = index + LIMIT
        const newShowMore = newIndex < LENGTH - 1
        const newList = list.concat(
            voteDetails
                .sort((data1, data2) => (data1.score >= data2 ? -1 : 1))
                .map(data => data)
                .slice(index, newIndex)
        )
        setIndex(newIndex)
        setList(newList)
        setShowMore(newShowMore)
    }

    const signMessage = async (provider, account, message) => {
        // if (window.ethereum) {
        //   const { signature } = await window.ethereum.signMessage(account, message);
        //   return signature;
        // }

        /**
         * Wallet Connect does not sign the message correctly unless you use their method
         * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
         */
        if (provider.provider?.wc) {
            const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
            const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
            return signature
        }

        return provider.getSigner(account).signMessage(message)
    }

    const sendSnaphotData = async message => {
        const response = await fetch(snapConst.REACT_APP_HUBMESSAGE, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        // console.log( response );
        if (!response.ok) {
            // const error = await response.json();
            // throw new Error( error?.error_description );
            return
        }

        const data = await response.json()
        // console.log( data );
        return data
    }

    const VoteHandler = async (propsalid, votingChoice = {}) => {
        let finalChoice = votingChoice
        if (choiceType != 'single-choice') {
            // console.table(voteCount)
            let i = 1
            Object.keys(voteCount).map(key => {
                votingChoice[i] = voteCount[key].voteCount
                i++
            })
            finalChoice = omitBy(votingChoice, v => isUndefined(v) || isNull(v) || v === '' || v == 0)
        }
        // console.log(finalChoice)
        const voteMsg = JSON.stringify({
            ...generatePayloadData(),
            type: 'vote',
            payload: {
                proposal: propsalid,
                choice: finalChoice,
                metadata: {}
            }
        })

        const sig = await signMessage(library, account, voteMsg)
        // console.log( sig );
        const msg = { address: account, msg: voteMsg, sig }
        // console.log( msg );
        // Save proposal to snapshot
        props.setLoading(true)
        sendSnaphotData(msg)
            .then(res => {
                // window.location.reload()
                setVoteUpdate(voteUpdate + 1)
                //  props.setSnapshotkey(t=>!t)
                data = null
            })
            .catch(err => {
                console.log(err)
            })
    }

    function trimAdd(add = '0x00', l = 5) {
        if (add.toLowerCase() === 'you') {
            return add
        }
        return (
            String(add).slice(0, 2) +
            String(add).slice(2, 2 + l) +
            '...' +
            String(add).slice(add.length - l, add.length)
        )
    }

    function endInDate(startDate, endDate) {
        const startTime = new Date(startDate).getDay()
        const endTime = new Date(endDate).getDay()
        return (
            <>
                <span>{startDate < endDate ? new Date(startDate).getDay() : new Date(endDate).getDay()}</span>
            </>
        )
    }
    const onclickbutton = () => {
        var arrayFinal = []
        const arrAddress = []
        const votesPowerCal = []
        let totalPower = 0
        let voteCountForYES = 0
        let voteCountForNO = 0
        let powerForYES = 0
        let powerForNO = 0
        // console.table(votesData)
        if (votesData.length > 0) {
            // console.log( spaceData )
            // console.log( "votes" )
            votesData.map((i, index) => {
                arrAddress.push(votesData[index].voter)
                votesPowerCal.push(votesData[index].choice)
            })
            // setVoteDetails(votesData)
            const network = snapConst.REACT_APP_NETWORK
            const providerrr = snapshot.utils.getProvider(network)

            const space = snapConst.REACT_APP_SPACE
            const strategies = [
                {
                    name: 'erc20-balance-of',
                    params: {
                        address: snapConst.REACT_APP_STARTAGY_ADDRESS,
                        symbol: snapConst.REACT_APP_STARTAGY_SYMBOL,
                        decimals: 18
                    }
                }
            ]

            const voters = arrAddress
            const blockNumber = proposalData?.snapshot

            snapshot.utils.getScores(space, strategies, network, providerrr, voters, blockNumber).then(scores => {
                // console.log( "Scores", scores );
                // console.log( scores[0] )
                arrAddress.map((i, index) => {
                    arrayFinal.push([arrAddress[index], scores[0][arrAddress[index]], votesPowerCal[index]])
                })
                const tempdetails = []
                arrayFinal.forEach((res, myIndex) => {
                    totalPower = totalPower + res['1']
                    if (res['2'] == 1) {
                        voteCountForYES += 1
                        powerForYES += res['1']
                    } else if (res['2'] == 2) {
                        voteCountForNO += 1
                        powerForNO += res['1']
                    }
                    tempdetails.push({
                        voter:
                            (res['0'].toLowerCase() == account.toLowerCase()) == res[0].toLowerCase() ? 'You' : res[0],
                        choice: location.state.choices[res['2'] - 1],
                        score: res['1']
                    })
                })
                const percentage1 = Math.abs(((powerForYES * 100) / totalPower).toFixed(2))
                const percentage2 = Math.abs(((powerForNO * 100) / totalPower).toFixed(2))
                setDataForVote({
                    percentage1: percentage1,
                    percentage2: percentage2,
                    power1: powerForYES,
                    power2: powerForNO
                })
                // setSingleVoteDetails(tempdetails);
                setVoteDetails(tempdetails)
                // console.log('tempdetails', tempdetails)
            })
            snapshot.utils.getScores(space, strategies, network, providerrr, [account], blockNumber).then(score => {
                setMyScore(score[0][account])
                // console.log(score[0][account],'Myyyyyyy')
            })
        } else {
            const network = snapConst.REACT_APP_NETWORK
            const providerrr = snapshot.utils.getProvider(network)

            const space = snapConst.REACT_APP_SECRET_NAME
            const strategies = [
                {
                    name: 'erc20-balance-of',
                    params: {
                        address: snapConst.REACT_APP_STARTAGY_ADDRESS,
                        symbol: snapConst.REACT_APP_STARTAGY_SYMBOL,
                        decimals: 18
                    }
                }
            ]

            // const voters = votersAddress
            const blockNumber = proposalData?.snapshot
            snapshot.utils.getScores(space, strategies, network, providerrr, [account], blockNumber).then(score => {
                setMyScore(score[0][account])
                // console.log("Score "+score)
            })
        }
    }

    const getCurrentResult = () => {
        var tempResults = []
        const currentResults = []
        const votersAddress = []
        const voteChoices = []
        const tempChoices = {}
        const voteDetailss = []

        let totalPower = 0
        // console.table(votesData);
        if (votesData.length > 0) {
            // console.log( spaceData )
            // console.log( "votes" )
            // console.log(votesData)
            votesData.map((i, index) => {
                votersAddress.push(votesData[index].voter)
                voteChoices.push(votesData[index].choice)
            })

            const network = snapConst.REACT_APP_NETWORK
            const providerrr = snapshot.utils.getProvider(network)

            const space = snapConst.REACT_APP_SECRET_NAME
            const strategies = [
                {
                    name: 'erc20-balance-of',
                    params: {
                        address: snapConst.REACT_APP_STARTAGY_ADDRESS,
                        symbol: snapConst.REACT_APP_STARTAGY_SYMBOL,
                        decimals: 18
                    }
                }
            ]

            const voters = votersAddress
            const blockNumber = parseInt(proposalData?.snapshot)
            // console.log('block', blockNumber)
            snapshot.utils.getScores(space, strategies, network, providerrr, voters, blockNumber).then(scores => {
                console.log('Scores', scores)
                // console.log( votersAddress )
                votersAddress.map((i, index) => {
                    // console.log("voteIndex"+index)
                    tempResults.push({
                        voterAddress: votersAddress[index],
                        score: scores[0][votersAddress[index]],
                        choices: voteChoices[index]
                    })
                })
                // console.log('Temp Results')
                // console.log(tempResults)
                let totalScore = 0
                tempResults.forEach((res, myIndex) => {
                    totalScore += res.score
                })
                // console.log('total' + totalScore)
                tempResults.forEach((res, myIndex) => {
                    let voteSharePercentage = ''
                    let totalVote = 0
                    totalPower += res.score
                    location.state.choices.forEach((e, index) => {
                        tempChoices[index + 1] = 0
                    })
                    const choiceKeys = Object.keys(res.choices)

                    let powerPerVote = 0
                    // console.log('choices',choiceKeys)
                    choiceKeys.forEach(ch => {
                        if ([ch]) {
                            totalVote += res.choices[ch]
                        }
                    })
                    // console.log('score '+res.score+'--'+totalVote)
                    powerPerVote = Math.ceil(res.score) / totalVote
                    let vShare = ''
                    // console.log('choiceKeys')
                    // console.log(res.choices)
                    choiceKeys.forEach(chs => {
                        if (res.choices[chs]) {
                            currentResults.push({
                                choice: chs,
                                votePower: res.choices[chs] * powerPerVote,
                                score: res.score,
                                choiceText: location?.state?.choices[chs - 1],
                                voterAddress: res.voterAddress
                            })
                            vShare =
                                Math.abs(((res.choices[chs] * 100) / totalVote).toFixed(2)) +
                                '% for ' +
                                location.state.choices[chs - 1]
                        }
                        voteSharePercentage = voteSharePercentage + ' ' + vShare
                    })

                    voteDetailss.push({
                        voter: res.voterAddress.toLowerCase() == account.toLowerCase() ? 'You' : res.voterAddress,
                        voteSharePercentage: voteSharePercentage,
                        score: res.score
                    })
                    setVoteDetails(voteDetailss)
                })
                // console.log('currentResults',currentResults)
                // console.log('voteDetails', voteDetailss)
                const groupData = _(currentResults)
                    .groupBy('choice')
                    .map((objs, key) => ({
                        choice: key,
                        choiceText: objs[0].choiceText,
                        score: _.sumBy(objs, 'score'),
                        votePower: _.sumBy(objs, 'votePower')
                    }))
                    .value()
                // console.log(totalPower)
                // console.log('groupData', groupData)
                groupData.forEach(ele => {
                    ele.votePercent = ((ele.votePower * 100) / totalPower).toFixed(2)
                })
                setCurrentResultData(groupData)

                // console.log( 'totalVote',totalVote )
            })
            snapshot.utils.getScores(space, strategies, network, providerrr, [account], blockNumber).then(score => {
                setMyScore(score[0][account])
                // console.log("Score "+score)
            })
        } else {
            // votersAddress.push(account)
            // voteChoices.push(votesData[index].choice)
            const network = snapConst.REACT_APP_NETWORK
            const providerrr = snapshot.utils.getProvider(network)

            const space = snapConst.REACT_APP_SECRET_NAME
            const strategies = [
                {
                    name: 'erc20-balance-of',
                    params: {
                        address: snapConst.REACT_APP_STARTAGY_ADDRESS,
                        symbol: snapConst.REACT_APP_STARTAGY_SYMBOL,
                        decimals: 18
                    }
                }
            ]

            // const voters = votersAddress
            const blockNumber = parseInt(proposalData?.snapshot)
            snapshot.utils.getScores(space, strategies, network, providerrr, [account], blockNumber).then(score => {
                setMyScore(score[0][account])
                // console.log("Score "+score)
            })
        }
    }
    const TempArray = {}
    location?.state.choices.forEach(element => {
        TempArray[element] = { voteCount: 0, votePercent: 0 }
    })
    // console.log(TempArray['AKAINU-WETH'].voteCount)
    const [voteCount, setVoteCount] = useState(TempArray)
    const [inputKey, setinputKey] = useState(Math.random())
    const adjustVoteCount = (action, index) => {
        const temp = voteCount
        if (action == 'add') {
            temp[index]['voteCount'] = +temp[index]['voteCount'] + 1
        } else {
            const temp = voteCount
            if (+temp[index]['voteCount'] > 0) {
                temp[index]['voteCount'] = +temp[index]['voteCount'] - 1
            }
        }
        const voteList = Object.values(temp)

        // console.table(voteList)
        const totalVotes = _.sumBy(voteList, 'voteCount')
        location?.state?.choices.forEach((e, i) => {
            temp[e].votePercent = totalVotes ? ((temp[e].voteCount * 100) / totalVotes).toFixed(1) : 0
        })
        setVoteCount(temp)
        setinputKey(Math.random())
    }
    const handleVoteChange = (value, index) => {
        const temp = voteCount
        temp[index]['voteCount'] = +value
        const voteList = Object.values(temp)
        // console.log(voteList)
        const totalVotes = _.sumBy(voteList, 'voteCount')
        location?.state?.choices.forEach(e => {
            temp[e].votePercent = ((temp[e].voteCount * 100) / totalVotes).toFixed(1)
        })
        setVoteCount(temp)

        setinputKey(Math.random())
    }

    const CastYourVote = (...rest) => {
        const stateChoices = []
        location?.state?.choices.map(name => {
            // reserveUSD:pairsData[name].reserveUSD, volume:pairsData[name].volumeUSD,
            if (pairsData[name]) {
                stateChoices.push({
                    choiceText: name,
                    pairName: pairsData[name].displayName,
                    reserveUSD: pairsData[name].reserveUSD,
                    volumeUSD: pairsData[name].sevenDayVolume,
                    other: pairsData[name]
                })
            } else {
                stateChoices.push({ choiceText: name, reserveUSD: 'N/A', volumeUSD: 'N/A', other: pairsData[name] })
            }
        })
        // console.log(stateChoices)
        // console.log('pairsState')
        // let idList = Object.values(stateChoices).map((pair) => pair.other.id).sort()
        // console.log(rest)
        return (
            <div style={{ padding: 0, margin: '0px 0px 1rem ' }}>
                {/* <h2
                    style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        fontSize: '20px',
                        fontWeight: '600'
                    }}
                >
                    Cast Your Vote
                </h2> */}
                <div>
                    {/* <ListGroup> */}

                    <SortableTable
                        orderBy="volumeUSD"
                        // title={location.state.title}
                        columns={[
                            {
                                key: 'pairName',
                                numeric: false,
                                render: (row, index) => (
                                    <div style={{ width: '100%', textAlign: 'left' }}>{row.pairName} </div>
                                ),
                                label: 'Name'
                            },
                            // {
                            //     key: 'reserveUSD',
                            //     render: (row, index) => {
                            //         if (row.reserveUSD != undefined) {
                            //             return currencyFormatter.format(row.reserveUSD)
                            //         } else {
                            //             return '$0'
                            //         }
                            //     },
                            //     align: 'right',
                            //     label: 'Liquidity'
                            // },
                            {
                                key: 'volumeUSD',
                                render: row => currencyFormatter.format(row.volumeUSD),
                                align: 'right',
                                label: 'Volume'
                            },
                            {
                                key: 'voting',
                                render: (row, index) => {
                                    return (
                                        <div
                                            style={{
                                                minWidth: '135px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '25px',
                                                    textAlign: 'center',
                                                    padding: '8px',
                                                    border: '1px solid #656565',
                                                    cursor: 'pointer',
                                                    display: 'inline-block'
                                                }}
                                                onClick={() => adjustVoteCount('remove', row.choiceText)}
                                            >
                                                -
                                            </div>
                                            <div
                                                style={{ width: '25px', textAlign: 'center', display: 'inline-block' }}
                                            >
                                                <input
                                                    type="text"
                                                    key={inputKey + '' + index}
                                                    onChange={e => handleVoteChange(row.target.value, row.choiceText)}
                                                    value={voteCount[row.choiceText].voteCount}
                                                    style={{
                                                        width: '100%',
                                                        color: '#333',
                                                        padding: '5px 6px 7px 6px',
                                                        textAlign: 'center'
                                                    }}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    width: '25px',
                                                    textAlign: 'center',
                                                    padding: '8px',
                                                    border: '1px solid #656565',
                                                    cursor: 'pointer',
                                                    display: 'inline-block'
                                                }}
                                                onClick={() => adjustVoteCount('add', row.choiceText)}
                                            >
                                                +
                                            </div>
                                            <div
                                                style={{
                                                    width: '60px',
                                                    textAlign: 'center',
                                                    padding: '8px',
                                                    border: '1px solid #656565',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {voteCount[row.choiceText].votePercent}%
                                            </div>
                                        </div>
                                    )
                                },
                                align: 'right',
                                label: 'Vote'
                            }
                        ]}
                        rows={stateChoices}
                        {...rest}
                    />

                    {/* </ListGroup> */}
                    <ActiveButton
                        style={{ width: '100%', marginTop: '1rem' }}
                        onClick={() => VoteHandler(id)}
                        // disabled={myScore < 98}
                    >
                        Vote
                    </ActiveButton>
                </div>
            </div>
        )
    }
    function convertToInternationalCurrencySystem(labelValue) {
        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e9
            ? Math.abs((Math.abs(Number(labelValue)) / 1.0e9).toFixed(2)) + 'B'
            : // Six Zeroes for Millions
            Math.abs(Number(labelValue)) >= 1.0e6
            ? Math.abs((Math.abs(Number(labelValue)) / 1.0e6).toFixed(2)) + 'M'
            : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? Math.abs((Math.abs(Number(labelValue)) / 1.0e3).toFixed(2)) + 'K'
            : Math.abs(Number(labelValue).toFixed(1))
    }
    return (
        <>
            <Section style={{ width: '80vw' }}>
                {location && location.state && (
                    <>
                        {' '}
                        <div className="col-md-12">
                            <Heading style={{ fontSize: '24px', display: 'inline-block' }}>
                                {location.state.title}
                            </Heading>
                            <Status style={{ marginLeft: '10px', display: 'inline-block' }}>{state}</Status>
                        </div>
                        {/* <Div className="col-md-12">
                            <p>
                                When you deposit or withdraw your SSLP, all of your pending BONE for that pool will be
                                WOOFED automatically.
                            </p>
                            <span
                                className=" read-more font-medium no-underline not-italic"
                                style={{ fontSize: '15px' }}
                                onClick={() => {
                                    setShowModal(true)
                                }}
                            >
                                <div className="tooltips">
                                    <QuestionWrapper className="float-left m-0.5">
                                        <Question size={14} />
                                    </QuestionWrapper>
                                    <span className="hebbo-font" style={{ fontSize: '14px' }}>
                                        Read more about how to claim your returns
                                    </span>
                                </div>
                            </span>
                        </Div> */}
                        <div className="col-md-12">
                            <p style={{ paddingBottom: '20px' }}>{location.state.body}</p>
                        </div>
                    </>
                )}
                {/* <button onClick={getCurrentResult}>click</button> */}
                {/* <div>percentage {DataForVote.percentage1} percentage2 {DataForVote.percentage2} power1 {DataForVote.power1} power2 {DataForVote.power2} </div> */}
                {/* <button onClick={onClickbutonncal}></button> */}
                <div className="row my-auto pb-10">
                    <div className="col-md-7">
                        {choiceType == 'single-choice' && state && state.toLowerCase() == 'active' && (
                            <div style={{ padding: 0, marginBottom: '1rem' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Div>
                                        <P style={{ opacity: 0.8, marginBottom: '0.5rem' }}>{spaceData.name}</P>

                                        <CardHeading style={{ marginTop: '0.75rem' }}>{title}</CardHeading>
                                    </Div>
                                    {/* <Div>
                  <Status>{state}</Status>
                </Div> */}
                                </div>

                                <div>
                                    <Select>
                                        <Option onClick={() => setType(1)} className={`${type === 1 ? 'active' : ''}`}>
                                            <OptionLabel>{choices[0]}</OptionLabel>
                                        </Option>
                                        <Option onClick={() => setType(2)} className={`${type === 2 ? 'active' : ''}`}>
                                            <OptionLabel>{choices[1]}</OptionLabel>
                                        </Option>
                                    </Select>
                                    <ActiveButton
                                        style={{ width: '100%', marginTop: '0.1rem' }}
                                        onClick={() => VoteHandler(id, type)}
                                        // disabled={myScore < 98}
                                    >
                                        Vote
                                    </ActiveButton>
                                </div>
                            </div>
                        )}

                        {state && state.toLowerCase() == 'active' && choiceType != 'single-choice' && <CastYourVote />}

                        <div style={{ padding: 0 }}>
                            <div>
                                <h2>
                                    Votes <span>{votesData.length}</span>
                                </h2>
                            </div>
                            <div>
                                <ListGroup>
                                    {list.map((item, index) => {
                                        // console.log(item)
                                        return (
                                            <ListItem key={index + 'vote'}>
                                                <Div>
                                                    <a
                                                        target="_blank"
                                                        href={'https://etherscan.io/address/' + item.voter}
                                                        rel="noreferrer"
                                                    >
                                                        {' '}
                                                        {trimAdd(item.voter)}{' '}
                                                    </a>
                                                </Div>
                                                <Div>
                                                    {choiceType == 'single-choice' && (
                                                        <P
                                                            style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                width: '100px',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {item.choice}
                                                        </P>
                                                    )}
                                                    {choiceType != 'single-choice' && (
                                                        <P
                                                            style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                width: '200px',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {item.voteSharePercentage}
                                                        </P>
                                                    )}
                                                </Div>
                                                <Div style={{ textAlign: 'right' }}>
                                                    <P>
                                                        {convertToInternationalCurrencySystem(item.score)}{' '}
                                                        {snapConst.REACT_APP_STARTAGY_SYMBOL}{' '}
                                                    </P>
                                                </Div>
                                            </ListItem>
                                        )
                                    })}
                                </ListGroup>
                                {showMore && (
                                    <div className="text-center">
                                        <button onClick={loadMore} className="btn btn-primary ">
                                            {' '}
                                            Load More{' '}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* {choiceType != 'single-choice' &&
              <Card style={{ padding: 0 }}>
              <CardHead>
                <CardHeading>
                  Votes <span>{votesData.length}</span>
                </CardHeading>
              </CardHead>
              <CardBody>
                <ListGroup>
                  {voteDetails.map( ( item, index ) => {
                    return (
                      <>
                        <ListItem key={index+'vote'}>
                          <Div>
                            <Address> {trimAdd( item.voter )} </Address>
                          </Div>
                          <Div>
                            
                            <P style={{overflow: 'hidden', textOverflow:'ellipsis', width:'200px', whiteSpace:'nowrap'}}>{item.voteSharePercentage}</P>
                          </Div>
                          <Div>
                            <P>{item.score} Dao To...</P>
                          </Div>
                        </ListItem>
                      </>
                    );
                  } )}
                </ListGroup>
              </CardBody>
            </Card>
            } */}
                    </div>
                    <div className="col-md-5 tabs--col">
                        <Card style={{ padding: 0, marginBottom: '1rem' }}>
                            <CardHead>
                                <CardHeading style={{ display: 'inline-block' }}>
                                    Lock {snapConst.REACT_APP_LOCK_SYMBOL}
                                </CardHeading>{' '}
                                <QuestionHelper
                                    text={`Lock ${snapConst.REACT_APP_LOCK_SYMBOL} and get ${snapConst.REACT_APP_STARTAGY_SYMBOL} to get started.`}
                                />
                            </CardHead>
                            <CardBody>
                                <StakeSection>
                                    <StakeButton
                                        onClick={() => {
                                            handleStakeSelect('Unstake')
                                        }}
                                        style={{ color: !isStakeSelected ? '#fea31c' : '', marginRight: '45px' }}
                                    >
                                        Unstake
                                    </StakeButton>
                                    <StakeButton
                                        onClick={() => {
                                            handleStakeSelect('Stake')
                                        }}
                                        style={{ color: isStakeSelected ? '#fea31c' : '' }}
                                    >
                                        Stake
                                    </StakeButton>
                                    <br></br>

                                    {isStakeSelected ? (
                                        <StakeDepositPanel tokenType={tokenType} tokenAddress={tokenAddress} />
                                    ) : (
                                        <BuryWithdrawlPanel tokenType={tokenType} tokenAddress={buryTokenAddress} />
                                    )}

                                    <div style={{ width: '100%', height: '20px' }}></div>
                                </StakeSection>
                            </CardBody>
                        </Card>
                        <Card style={{ padding: 0, marginBottom: '1rem' }}>
                            <CardHead>
                                <CardHeading style={{ display: 'inline-block' }}>Your Voting power </CardHeading>{' '}
                                <QuestionHelper
                                    text={`Lock ${snapConst.REACT_APP_LOCK_SYMBOL} on this page to get started.`}
                                />
                            </CardHead>
                            <CardBody>
                                <Div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    <P>
                                        {myScore == 0
                                            ? 'You have no BONE locks. Lock ' +
                                              snapConst.REACT_APP_LOCK_SYMBOL +
                                              ' on this page to get started.'
                                            : myScore + ' ' + snapConst.REACT_APP_STARTAGY_SYMBOL + ''}
                                    </P>
                                </Div>
                            </CardBody>
                        </Card>
                        <Card style={{ padding: 0, marginBottom: '1rem' }}>
                            <CardHead>
                                <CardHeading>Information</CardHeading>
                            </CardHead>
                            <CardBody>
                                {/* {console.log( "spaceData", location.state )} */}
                                <ListGroup>
                                    <Div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}
                                    >
                                        <P>Author</P>
                                        {trimAdd(author)}
                                    </Div>
                                    <Div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}
                                    >
                                        <P>Voting system</P>
                                        {choiceType + ' voting'}
                                    </Div>
                                    <Div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}
                                    >
                                        <P>Start Date</P>
                                        <DateFormat data={start * 1000} />
                                    </Div>
                                    <Div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem'
                                        }}
                                    >
                                        <P>End Date</P>
                                        <DateFormat data={end * 1000} />
                                    </Div>
                                </ListGroup>
                            </CardBody>
                        </Card>
                        {choiceType == 'single-choice' && (
                            <Card style={{ padding: 0 }}>
                                <CardHead>
                                    <CardHeading>Current results</CardHeading>
                                </CardHead>
                                <CardBody>
                                    <div
                                        style={{
                                            display: 'flex',
                                            margin: '2rem 0',
                                            justifyContent: 'space-between',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div>
                                            <Progress style={{ width: 100, height: 100 }}>
                                                <CircularProgressbar
                                                    value={DataForVote.percentage1}
                                                    text={`${parseFloat(DataForVote.percentage1).toFixed(0)}% `}
                                                    strokeWidth={8}
                                                    styles={{
                                                        path: {
                                                            background: 'red',
                                                            stroke: '#F4A817'
                                                        },
                                                        trail: {
                                                            stroke: 'rgba(255, 255, 255, 0.1)',
                                                            strokeLinecap: 'butt',
                                                            transform: 'rotate(0.25turn)',
                                                            transformOrigin: 'center center'
                                                        },
                                                        text: {
                                                            fill: '#fff',
                                                            fontSize: '18px'
                                                        },
                                                        background: {
                                                            fill: ''
                                                        }
                                                    }}
                                                />
                                            </Progress>
                                            <P
                                                style={{
                                                    opacity: 0.8,
                                                    marginTop: '0.5rem',
                                                    whiteSpace: 'pre',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {`${choices[0]} ${convertToInternationalCurrencySystem(
                                                    DataForVote.power1
                                                )} ${spaceData.name ? spaceData.name.substring(0, 5) : ''}... `}
                                            </P>
                                        </div>

                                        <div>
                                            <Progress style={{ width: 100, height: 100 }}>
                                                <CircularProgressbar
                                                    value={DataForVote.percentage2}
                                                    text={`${parseFloat(DataForVote.percentage2).toFixed(0)}% `}
                                                    strokeWidth={8}
                                                    styles={{
                                                        path: {
                                                            background: 'red',
                                                            stroke: '#F4A817'
                                                        },
                                                        trail: {
                                                            stroke: 'rgba(255, 255, 255, 0.1)',
                                                            strokeLinecap: 'butt',
                                                            transform: 'rotate(0.25turn)',
                                                            transformOrigin: 'center center'
                                                        },
                                                        text: {
                                                            fill: '#fff',
                                                            fontSize: '18px'
                                                        },
                                                        background: {
                                                            fill: ''
                                                        }
                                                    }}
                                                />
                                            </Progress>
                                            <P
                                                style={{
                                                    opacity: 0.8,
                                                    marginTop: '0.5rem',
                                                    whiteSpace: 'pre',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {`${choices[1]} ${convertToInternationalCurrencySystem(
                                                    DataForVote.power2
                                                )} ${spaceData.name ? spaceData.name.substring(0, 5) : ''}... `}
                                            </P>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                        {choiceType != 'single-choice' && (
                            <Card style={{ padding: 0 }}>
                                <CardHead>
                                    <CardHeading>Current results</CardHeading>
                                </CardHead>
                                <CardBody>
                                    {currentResultData
                                        .sort((data1, data2) => (data1.votePower > data2.votePower ? -1 : 1))
                                        .map((data, index) => {
                                            return (
                                                <div key={index}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex' }}>
                                                            <div
                                                                style={{
                                                                    color: '#fff',
                                                                    width: '150px',
                                                                    textOverflow: 'ellipsis',
                                                                    overflow: 'hidden',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {data.choiceText}
                                                            </div>
                                                            <span style={{ marginLeft: '5px' }}>
                                                                {convertToInternationalCurrencySystem(data.votePower)}{' '}
                                                                {snapConst.REACT_APP_STARTAGY_SYMBOL}{' '}
                                                            </span>
                                                        </div>
                                                        <div className="" style={{ color: '#fff' }}>
                                                            {data.votePercent}%
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200 progressBar">
                                                        <div
                                                            style={{
                                                                width: data.votePercent + '%',
                                                                background: '#d58b0e',
                                                                color: '#ffa409'
                                                            }}
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-orange-500"
                                                        ></div>
                                                        <div
                                                            style={{
                                                                width: 100 - data.votePercent + '%',
                                                                background: '#b2b3b5',
                                                                color: '#b2b3b5'
                                                            }}
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-red-500"
                                                        >
                                                            {' '}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </Section>
            <SnapModal isOpen={showModal} onDismiss={handleDismiss} />
        </>
    )
}
// props.setLoading(false)
export default IsLoadingHOC(SnapShot, 'Loading...')

// const Card =styled.div`
// border: 1px solid gray;
// border-radius: 8px;
// bacground: #292733a3;
// `
// const
