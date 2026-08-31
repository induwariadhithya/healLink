import { useState } from 'react'
import stressTestImage from '../assets/stress-test.png'
import './stressQuiz.css'

const questions = [
  {
    question:
      'How often do you feel overwhelmed by your daily responsibilities?',
    options: ['Never', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you have difficulty relaxing?',
    options: ['Never', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question:
      'How often do you feel tired even after getting enough rest?',
    options: ['Never', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you find it difficult to concentrate?',
    options: ['Never', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question:
      'How often do you feel worried about things you cannot control?',
    options: ['Never', 'Sometimes', 'Often', 'Almost always'],
  },
]

export function StressQuizComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestion] = answer
    setAnswers(updatedAnswers)
  }

  const calculateResult = () => {
  let score = 0

  answers.forEach((answer) => {
    if (answer === 'Sometimes') {
      score += 1
    } else if (answer === 'Often') {
      score += 2
    } else if (answer === 'Almost always') {
      score += 3
    }
  })

  if (score <= 4) {
    setResult({
      level: 'Low Stress',
      emoji: '😌',
      message:
        'Your responses suggest a relatively low level of stress. Continue maintaining healthy routines and taking time to relax.',
    })
  } else if (score <= 9) {
    setResult({
      level: 'Moderate Stress',
      emoji: '😕',
      message:
        'Your responses suggest some signs of stress. Consider taking regular breaks, getting enough rest, and talking to someone you trust.',
    })
  } else {
    setResult({
      level: 'High Stress',
      emoji: '😵',
      message:
        'Your responses suggest a higher level of stress. Consider reaching out to a trusted person or a qualified professional for support.',
    })
  }
}

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      alert('Please select an answer before continuing.')
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
  }

  if (result) {
    return (
      <div className="stress-quiz-page">
        <div className="stress-quiz-container">
          <h1>Stress Assessment Result</h1>

          <div className="result-card">
            <div className="result-emoji">{result.emoji}</div>
            <p className="result-label">Your Stress Level</p>
            <h2>{result.level}</h2>
            <p className="result-message">{result.message}</p>
            <button onClick={restartQuiz}>🔄 Take Quiz Again</button>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="stress-quiz-page">
      <div className="stress-quiz-container">
        <div className="quiz-header">
          <div className="quiz-visual">
            <img
              src={stressTestImage}
              alt="Illustration for the stress assessment quiz"
              className="stress-quiz-image"
            />
          </div>
          <h1>Stress Assessment</h1>
        </div>

        <p className="quiz-intro">
          Answer the following questions to get a simple indication of your current stress level.
        </p>

        <div className="progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <div className="question-card">
          <h2>{question.question}</h2>

          <div className="options">
            {question.options.map((option) => (
              <button
                key={option}
                className={answers[currentQuestion] === option ? 'option selected' : 'option'}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-buttons">
          <button onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </button>

          <button onClick={handleNext}>
            {currentQuestion === questions.length - 1 ? 'View Result' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StressQuizComponent
