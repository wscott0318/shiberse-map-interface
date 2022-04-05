import React, { Suspense, useEffect, useRef } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { RedirectIfLockedToken } from './Map/redirects'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

// Additional Tools
import ReactGA from 'react-ga'
import Home from './Home'
import { RedirectPathToHomeOnly } from './Home/redirects'
import Profile from './Profile'
import WalletRoute from 'hocs/WalletRoute'

function App(): JSX.Element {
    const bodyRef = useRef<any>(null)

    const { pathname, search } = useLocation()

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
                <div className="overflow-x-hidden">
                    <Header />

                    <div ref={bodyRef}>
                        <Popups />

                        <Web3ReactManager>
                            <Switch>
                                
                                <Route exact strict path="/" component={Home} />
                                <WalletRoute exact strict path="/map" component={RedirectIfLockedToken} />
                                <WalletRoute exact strict path="/profile" component={Profile} />

                                <Route component={RedirectPathToHomeOnly} />
                            </Switch>
                        </Web3ReactManager>
                    </div>
                </div>
            </Suspense>
        </ApolloProvider>
    )
}

export default App
