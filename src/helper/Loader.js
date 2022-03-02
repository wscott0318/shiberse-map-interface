import React from 'react'
import styled from 'styled-components'

const LoaderElement = styled.div`
    height: 40px;
    width: 40px;
    margin: auto;
    > div {
        height: inherit;
        width: inherit;
        position: absolute;
        animation-name: rotate;
        animation-duration: 1.5s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
    }
    > div > div {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background: #f5a918;
        position: absolute;
        top: 0%;
        right: 50%;
        transform: translate(50%, 0%);
    }
    > div:nth-child(2) {
        animation-delay: 0.2s;
    }
    > div:nth-child(3) {
        animation-delay: 0.4s;
    }
    > div:nth-child(4) {
        animation-delay: 0.6s;
    }
    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        50% {
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

const Loader = () => {
    return (
        <LoaderElement className="loader">
            <div>
                <div></div>
            </div>
            <div>
                <div></div>
            </div>
            <div>
                <div></div>
            </div>
            <div>
                <div></div>
            </div>
        </LoaderElement>
    )
}

export default Loader
