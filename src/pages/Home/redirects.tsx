import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

// Redirects Legacy Hash Routes to Browser Routes
export function RedirectHashRoutes({ location }: RouteComponentProps) {
    if (!location.hash) {
        return <Redirect to={{ ...location, pathname: '/' }} />
    }
    return <Redirect to={location.hash.replace('#', '')} />
}

// Redirects to home but only replace the pathname
export function RedirectPathToHomeOnly({ location }: RouteComponentProps) {
    return <Redirect to={{ ...location, pathname: '/' }} />
}