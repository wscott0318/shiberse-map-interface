import React from 'react'
import styled from 'styled-components'
import ShiberseSection from './shiberse'
import shiberseImg from '../../assets/images/home/guide/2.png';
import FaqComponent from './faq';
import { GuideSection } from 'pages/GuideView';

const Wrapper = styled.div`
    padding: 5% 0;
`

const data = {
    rows: [
        {
            title: "This is a dummy question",
            content: `Dummy answer when clicked on question- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        },
        {
            title: "This is a dummy question",
            content: `Dummy answer when clicked on question- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        },
        {
            title: "This is a dummy question",
            content: `Dummy answer when clicked on question- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        },
        {
            title: "This is a dummy question",
            content: `Dummy answer when clicked on question- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
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
                image={ shiberseImg }
                title={ 'SHIBERSE' }
                content={ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>` }
            />

            <GuideSection 
                image={ shiberseImg }
                title={ 'REWARDS' }
                blurPosition={ 'left' }
                textSize={ 'big' }
                content={ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>` }
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