import React from 'react'
import Brightness from '../../assets/images/brightness.svg'
import { Link, NavLink } from 'react-router-dom'

export default function Footer(props: any) {
    return (
        <div className="footer-section absolute bottom-0 w-full">
            <div className="flex flex-row flex-nowrap justify-between w-screen my-auto p-1">
                <div className="space-x-2 mx-auto">
                    {/* <div className="inline-block  absolute left-5">
                <img src={Brightness} className="px-2 metric-semibold text-xsf font-medium	"/>
                
            </div> */}
                    <div className="inline-block">
                        <a
                            href="https://www.shibatoken.com/"
                            target="blank"
                            className="px-2 metric-semibold text-xsf font-medium	"
                            style={{ color: '#d5d5d5' }}
                        >
                            Website
                        </a>
                    </div>
                    <div className="inline-block">
                        <a
                            href="https://t.me/ShibaInu_Dogecoinkiller"
                            target="blank"
                            className="px-2 metric-semibold text-xsf font-medium	"
                            style={{ color: '#d5d5d5' }}
                        >
                            Telegram
                        </a>
                    </div>
                    <div className="inline-block">
                        <a
                            href="https://discord.com/invite/shibatoken"
                            target="blank"
                            className="px-2 metric-semibold text-xsf font-medium	"
                            style={{ color: '#d5d5d5' }}
                        >
                            Discord
                        </a>
                    </div>
                    <div className="inline-block">
                        <a
                            href="https://analytics.shibaswap.com"
                            target="blank"
                            className="px-2 metric-semibold text-xsf font-medium	"
                            style={{ color: '#d5d5d5' }}
                        >
                            Bonefolio
                        </a>
                    </div>
                    <div className="inline-block">
                        <a
                            href="https://twitter.com/ShibaSwapDEX"
                            target="blank"
                            className="px-2 metric-semibold text-xsf font-medium	"
                            style={{ color: '#d5d5d5' }}
                        >
                            Twitter
                        </a>
                    </div>
                    <div className="inline-block">
                        <a
                            href="https://blog.shibaswap.com"
                            target="blank"
                            className="px-2 metric-semibold text-xsf font-medium	"
                            style={{ color: '#d5d5d5' }}
                        >
                            Medium
                        </a>
                    </div>
                    {/* <div className="inline-block">
                    <a href="https://etherscan.io/token/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE#balances" target="blank" className="px-2 metric-semibold text-xsf font-medium	" style={{ color: '#d5d5d5' }}>
                        Etherscan
                </a>
                </div> */}
                    <div className="inline-block">
                        <a
                            href="mailto:shibaswap@shibatoken.com"
                            target="blank"
                            className="px-2 metric-semibold text-xsf font-medium	"
                            style={{ color: '#d5d5d5' }}
                        >
                            Contact Us
                        </a>
                    </div>
                    <div className="inline-block absolute right-5">
                        <NavLink
                            className="px-2 text-xsf font-medium font-semibold"
                            style={{ lineHeight: '0rem', color: '#fea31c' }}
                            to=""
                        >
                            FAQ
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
