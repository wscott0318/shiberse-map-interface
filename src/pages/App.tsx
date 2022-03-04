import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { useActiveWeb3React } from '../hooks/index'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
    RedirectDuplicateTokenIds,
    RedirectOldAddLiquidityPathStructure,
    RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import MigrateV2 from './MigrateV2'
import Pool from './Pool'
import Faq from './FaqPage'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
// import Saave from './Saave'
import BuryDogYard from './Bury/BuryDogYard'
import Bonefolio from './Bonefolio'
import Swap from './Swap'
import Map from './Map'

import Proposal from '../container/Proposal/Proposal'
import SnapShot from '../container/SnapShot/SnapShot'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import {
    RedirectHashRoutes,
    OpenClaimAddressModalAndRedirectToSwap,
    RedirectPathToSwapOnly,
    RedirectToSwap
} from './Swap/redirects'
// Additional Tools
import Yield from './Yield'
import ReactGA from 'react-ga'
import Home from './Home'
import Bury from './Bury'
import ArchievedRewards from './ArchievedRewards'
import Footer from 'components/Footer'

function App(): JSX.Element {
    const { chainId } = useActiveWeb3React()
    const bodyRef = useRef<any>(null)

    const { pathname, search } = useLocation()
    const [snapshotkey, setSnapshotkey] = useState(true)

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo(0, 0)
        }
    }, [pathname])

    useEffect(() => {
        ReactGA.pageview(`${pathname}${search}`)
    }, [pathname, search])


    const client = new ApolloClient({
        uri: 'https://hub.snapshot.org/graphql',
        cache: new InMemoryCache()
    })

    return (
        <ApolloProvider client={client}>
            <Suspense fallback={null}>
                <Route component={DarkModeQueryParamReader} />
                <div className="flex flex-col items-start overflow-x-hidden h-screen">
                    <div className="flex flex-row flex-nowrap justify-between w-screen">
                        <Header />
                    </div>
                    <div
                        ref={bodyRef}
                        className="flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0 main-container-section"
                    >
                        <Popups />
                        {/* <Polling /> */}
                        <Web3ReactManager>
                            <Switch>
                                <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                                <Route exact strict path="/yield" component={Yield} />
                                <Route exact strict path="/archive" component={ArchievedRewards} />
                                <Route exact strict path="/fetch" component={MigrateV2} />
                                <Route exact strict path="/" component={Home} />
                                <Route exact strict path="/bury" component={Bury} />
                                <Route exact path="/bury/:tokenName" component={BuryDogYard} />
                                <Route exact strict path="/bonefolio" component={Bonefolio} />
                                <Route exact strict path="/swap" component={Swap} />
                                <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                                <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                                <Route exact strict path="/find" component={PoolFinder} />
                                <Route exact strict path="/pool" component={Pool} />
                                <Route exact strict path="/faq" component={Faq} />
                                <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                                <Route exact path="/add" component={AddLiquidity} />
                                <Route exact strict path="/map" component={Map} />
                                <Route
                                    exact
                                    path="/add/:currencyIdA"
                                    component={RedirectOldAddLiquidityPathStructure}
                                />
                                <Route
                                    exact
                                    path="/add/:currencyIdA/:currencyIdB"
                                    component={RedirectDuplicateTokenIds}
                                />
                                <Route exact path="/create" component={AddLiquidity} />
                                <Route
                                    exact
                                    path="/create/:currencyIdA"
                                    component={RedirectOldAddLiquidityPathStructure}
                                />
                                <Route exact strict path="/proposal" component={Proposal} />
                                <Route exact strict path="/proposal/:id">
                                    <SnapShot key={snapshotkey} setSnapshotkey={setSnapshotkey} />
                                </Route>
                                <Route
                                    exact
                                    path="/create/:currencyIdA/:currencyIdB"
                                    component={RedirectDuplicateTokenIds}
                                />
                                <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                                <Route
                                    exact
                                    strict
                                    path="/remove/:tokens"
                                    component={RedirectOldRemoveLiquidityPathStructure}
                                />
                                <Route
                                    exact
                                    strict
                                    path="/remove/:currencyIdA/:currencyIdB"
                                    component={RemoveLiquidity}
                                />

                                {/* Redirects for app routes */}
                                <Route
                                    exact
                                    strict
                                    path="/token/:address"
                                    render={({
                                        match: {
                                            params: { address }
                                        }
                                    }) => <Redirect to={`/swap/${address}`} />}
                                />
                                <Route
                                    exact
                                    strict
                                    path="/pair/:address"
                                    render={({
                                        match: {
                                            params: { address }
                                        }
                                    }) => <Redirect to={`/pool`} />}
                                />

                                {/* Redirects for Legacy Hash Router paths
                            <Route exact strict path="/" component={RedirectHashRoutes} />
                           Catch all */}
                                <Route component={RedirectPathToSwapOnly} />
                            </Switch>
                        </Web3ReactManager>
                        <Footer />
                    </div>
                </div>
            </Suspense>
        </ApolloProvider>
    )
}

export default App
