import React from 'react'
import { Helmet } from 'react-helmet'
import StakingView from 'components/StakingView'
import GuideView from 'pages/GuideView'
import FaqView from 'components/FaqView'
import Footer from 'components/Footer'

export default function Home() {
    return (
        <div>
            <Helmet>
                <title>HOME | SHIBERSE</title>
                <meta name="description" content="" />
            </Helmet>

            <StakingView />

            <GuideView />

            <FaqView />

            <Footer />
        </div>
    )
}
