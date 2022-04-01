import React from 'react'
import styled from 'styled-components'
import ShiberseSection from './shiberse'
import FaqComponent from './faq';

const Wrapper = styled.div`
    padding: 5% 0;
`

const data = {
    rows: [
        {
            title: "How many Lands are available for bid/purchase?",
            content: `<p>There’s a total of 100,595 lands that will be unlocked over time. During the first introductory phase 36,431 lands will be revealed and just 32,124 will be available for purchase.</p>`,
        },
        {
            title: "What is the goal of the Locker Feature?",
            content: `<p>Lockers were constructed to promote early access to the entire map, while also serving as the anti-dump safety mechanic to reward our holders with confidence during the first phase and event process. Read more by <a href="https://blog.shibaswap.com/shib-the-metaverse/" target='#blank'>clicking here</a>.</p>`,
        },
        {
            title: "How to mint Shib Lands?",
            content: `<p>By clicking on the top menu, you will open a window that will showcase your reserved and acquired lands right on the “<b>LANDS OWNED</b>” box, from here you will be able to mint your land or all your lands at once and avoid multiple transactions, saving you from multiple gas fees.</p>`,
        },
        {
            title: "What crypto wallet do I use to bid / purchase Shib Lands?",
            content: `<p>You will need to set up and use a MetaMask Wallet in order to participate in the land bid/purchase process. MetaMask Wallet is the only functioning confirmed wallet that operates in the portal. For more information on MetaMask wallet please visit: <a href="https://metamask.io" target='#blank'>https://metamask.io</a></p>`,
        },
        {
            title: "What do I need to bid / purchase lands?",
            content: `<p>During the first two stages of the introductory phase, you will be required to lock LEASH or Shiboshis through the ‘LOCKER’ features placed at the top of this page. All land bids / purchases must be made with ETH (Ethereum) in order to acquire them.<br/><br/>You can get $LEASH or $ETH at ShibaSwap by <a href="https://shibaswap.com/#/swap" target='#blank'>clicking here.</a></p>`,
        },
        {
            title: "Have more questions?",
            content: `<p>Please visit our <a href="https://blog.shibaswap.com/shib-the-metaverse/" target='#blank'>Lands Blog</a> or join our official <a href="https://discord.gg/shibatoken" target='#blank'>Discord</a>.</p>`,
        },
    ],
};

const styles = {
    bgColor: 'transparent',
    rowTitleColor: "white",
    rowContentColor: 'white',
};

const config = {
    animate: true,
    arrowIcon: " ",
    tabFocus: true
};

export const FaqView = () => {
    return (
        <Wrapper className='container'>
            <ShiberseSection
                title={ 'SHIB : THE METAVERSE' }
                content={ `<p>Shib : The Metaverse is the culmination of our history as a community, virtually displayed, in a layer of beautiful visuals that showcase our innovation and unity with a place to truly call home. The Shiba Ecosystem will thrive inside the SHIB Metaverse project, meaning all tokens SHIB, LEASH, BONE, and SHIBOSHIS will play an important role as phases roll out. The development of this project will also gravitate great partnershibs, and foundational resources for the community.<br/><br/>We are building immersive experiences that will allow users to explore, benefit, and interact with a Shiba Inu Universe like no other. Our mission is to introduce a unique, fun, and exciting way to have users earn passive income, gather in game-resources, generage rewards, and even allowing them to have a personal space in which they will be able to build and manage their own projects.</p>` }
            />

            <FaqComponent
                data={data}
                styles={styles}
                config={config}
            />
        </Wrapper>
    )
}

export default FaqView