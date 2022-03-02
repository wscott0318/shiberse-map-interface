import React, { useContext, useEffect, useState, useCallback,useRef } from 'react'
import UpImage from '../../assets/images/home/next.png'
import DownImage from '../../assets/images/home/down-arrow.png'

const Faq_questions = ({  title, info, extra_details, info_p1, info_p2, info_p3, info_p4,info_p5 }: any) => {
const [expand, setExpand] = useState<boolean>(false)

  return (
        <div className="row">
            <div className="col">
                <div className="tabs">
                    <div className="tab">
                        <div className="tab-label" onClick={() => setExpand(!expand)}>{title}
                            <div>
                            {expand ? <img height={20} width={20} src={DownImage} /> 
                            : <img height={20} width={20} src={UpImage} />}
                            </div>
                        </div>
                        <div>
                            {expand && (
                                <div className="tab-content">
                                    <p>{info}</p>
                                    {extra_details && 
                                    <>
                                    <p>{extra_details.info_p1}</p>
                                    <p>{extra_details.info_p2}</p>
                                    <p>{extra_details.info_p3}</p>
                                    <p>{extra_details.info_p4}</p>
                                    <p>{extra_details.info_p5}</p>
                                    </>
                                    }
                                </div>
                            )}
                        </div>
                    </div>  
                </div>
            </div>
        </div>
  )
}

export default Faq_questions
