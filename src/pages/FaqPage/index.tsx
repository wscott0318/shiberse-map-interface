import React, { useState } from 'react'
import data from './data'
import Faq_questions from './faq_heading'
import GeneralQuestions from './general_questions'

import { BackButton } from '../../components/Button'

const Faq = () => {
  const [questions, setQuestions] = useState(data)
  
  return (
    <div className="container pb-5 Faq_card relative fetch-container">
    <div>
        <BackButton defaultRoute="/pool" className="back_button"/>
        <h1>frequently asked questions</h1>
    </div>
    {questions.map((question) => (
        <Faq_questions key={question.id} {...question} />
    ))}
    <GeneralQuestions></GeneralQuestions>
    </div>
  )
}

export default Faq