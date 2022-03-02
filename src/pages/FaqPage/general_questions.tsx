import React, { useContext, useEffect, useState, useCallback,useRef } from 'react'
import UpImage from '../../assets/images/home/next.png'
import DownImage from '../../assets/images/home/down-arrow.png'

const GeneralQuestions = () => {
    const [expand, setExpand] = useState<boolean>(false)
  
  return (
    <div className="row">
            <div className="col">
                <div className="tabs">
                    <div className="tab">
                        <div className="tab-label" onClick={() => setExpand(!expand)}>
                            What are the eligible pairs to receive Woof Returns through ShibaSwap?
                            <div>
                            {expand ? <img height={20} width={20} src={DownImage} /> 
                            : <img height={20} width={20} src={UpImage} />}
                            </div>
                        </div>
                        <div>
                            {expand && (
                                <div className="tab-content">
                                    <>
                                    <p>The pairs that are allocated to receive our Woof Returns are the following ones:</p>
                                    <p><b>• BONE-ETH (3000 AP) -</b>Receives BONE + 0.1% WBTC and 0.1% USDC of all the swap transaction fees.</p>
                                    <p><b>• LEASH-ETH (700 AP) - </b>Receives BONE + 0.1% DAI and 0.1% USDT of all the swap transaction fees.</p>
                                    <p>The following pairs receive BONE. The percentage of BONE allocated to those pairs depends on the Allocation Points assigned for each pair.</p>
                                    <p><b>• SHIB-ETH</b>(500 AP)</p>
                                    <p><b>• SUSHI-ETH</b>(300 AP)</p>
                                    <p><b>• UNI-ETH</b>(300 AP)</p>
                                    <p><b>• WBTC-ETH</b>(300 AP)</p>
                                    <p><b>• USDC-ETH</b>(300 AP)</p>
                                    <p><b>• LINK-ETH</b>(100 AP)</p>
                                    <p><b>• DAI-ETH</b>(100 AP)</p>
                                    <p><b>• XFUND-ETH</b>(50AP)</p>
                                    <p><b>• SNX-ETH</b>(50AP)</p>
                                    <p><b>• MEME-ETH</b>(50AP)</p>
                                    <p><b>• GRT-ETH</b>(50AP)</p>
                                    <p><b>• DUCK-ETH</b>(50AP)</p>
                                    <p><b>• VXV-ETH</b>(50AP)</p>
                                    <p><b>• ELON-ETH</b>(50AP)</p>
                                    </>
                                </div>
                            )}
                        </div>
                    </div>  
                </div>
            </div>
        </div>
  )
}

export default GeneralQuestions