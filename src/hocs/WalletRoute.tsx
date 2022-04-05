import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'

// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
export const WalletRoute = ({ component: Component, children, ...rest }: any) => {
    const { account } = useActiveWeb3React()
    return (
        <>
            <Route
                {...rest}
                render={({ location, props, match }: any) => {
                    return account ? (
                        Component ? (
                            <Component {...props} {...rest} match={match} />
                        ) : (
                            children
                        )
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: location }
                            }}
                        />
                    )
                }}
            />
        </>
    )
}

export default WalletRoute
