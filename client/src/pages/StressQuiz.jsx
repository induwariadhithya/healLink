import { useState } from 'react'
import stressTestImage from '../assets/stress-test.png'
import './stressQuiz.css'
import stressBackground from '../assets/stress-background.jpg'
import stressWatermark from '../assets/stress-watermark.png'
import lowStressImage from '../assets/low-stress.png'
import moderateStressImage from '../assets/moderate-stress.png'
import highStressImage from '../assets/high-stress.png'

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

    if (score <= 5) {
      setResult({
        level: 'Low Stress',
        type: 'low',
        message:
          'Your responses suggest a relatively low level of stress. Continue maintaining healthy routines and taking time to relax.',
        tip:
          'You are doing well. Keep making time for rest, relaxation, and activities you enjoy.',
      })
    } else if (score <= 10) {
      setResult({
        level: 'Moderate Stress',
        type: 'moderate',
        message:
          'Your responses suggest a moderate level of stress. Consider taking regular breaks, getting enough rest, and making time for activities that help you recharge.',
        tip:
          'Small changes such as breathing exercises, regular breaks, and good sleep can support your well-being.',
      })
    } else {
      setResult({
        level: 'High Stress',
        type: 'high',
        message:
          'Your responses suggest a higher level of stress. Consider prioritising rest, support, and healthy coping strategies.',
        tip:
          'If stress feels difficult to manage, consider talking with someone you trust or a qualified professional.',
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

  // RESULT SCREEN
  if (result) {
    return (
      <div
        className="stress-quiz-page"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(247, 246, 252, 0.15),
              rgba(247, 246, 252, 0.25)
            ),
            url(${stressBackground})
          `,
        }}
      >
        <div className="stress-quiz-container result-container">

          <div className="result-header">

            <div className="result-visual">
              <img
                src={stressTestImage}
                alt="Calm wellness illustration"
                className="result-image"
              />
            </div>

            <p className="quiz-eyebrow">
              YOUR WELLNESS CHECK-IN
            </p>

            <h1>
              Stress Assessment Result
            </h1>

            <p className="result-intro">
              Based on the answers you provided, here is a simple indication
              of your current stress level.
            </p>

          </div>

          <div className={`result-card ${result.type}`}>
<div className="result-symbol">
  {result.type === 'low' && (
    <img
      src={lowStressImage}
      alt="Low Stress"
      className="result-status-image"
    />
  )}

  {result.type === 'moderate' && (
    <img
      src={moderateStressImage}
      alt="Moderate Stress"
      className="result-status-image"
    />
  )}

  {result.type === 'high' && (
    <img
      src={highStressImage}
      alt="High Stress"
      className="result-status-image"
    />
  )}
</div>

            <p className="result-label">
              YOUR STRESS LEVEL
            </p>

            <h2>
              {result.level}
            </h2>

            <p className="result-message">
              {result.message}
            </p>

            <div className="result-tip">
              <span className="tip-title">
                A gentle reminder
              </span>

              <p>
                {result.tip}
              </p>
            </div>

            <div className="wellness-tips">

              <div className="wellness-tip">
                <span>🧘</span>
                <p>Keep up your self-care</p>
              </div>

              <div className="wellness-tip">
                <span>😴</span>
                <p>Get enough rest</p>
              </div>

              <div className="wellness-tip">
                <span>😊</span>
                <p>Stay positive</p>
              </div>

              <div className="wellness-tip">
                <span>⚖️</span>
                <p>Balance your daily life</p>
              </div>

            </div>

            <button
              className="restart-button"
              onClick={restartQuiz}
            >
              Take Quiz Again
              <span>↻</span>
            </button>

          </div>

        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  const progress =
    ((currentQuestion + 1) / questions.length) * 100

  return (
    <div
      className="stress-quiz-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(247, 246, 252, 0.15),
            rgba(247, 246, 252, 0.25)
          ),
          url(${stressBackground})
        `,
      }}
    >
      <div className="stress-quiz-container">

        <div className="quiz-header">

          <div className="quiz-visual">
            <img
              src={stressTestImage}
              alt="Calm mental wellness illustration"
              className="stress-quiz-image"
            />
          </div>

          <div className="quiz-heading">

            <p className="quiz-eyebrow">
              WELLNESS CHECK-IN
            </p>

            <h1>
              Stress Assessment
            </h1>

            <p className="quiz-intro">
              Answer these questions to get a simple indication
              of your current stress level.
            </p>

          </div>

        </div>

        <div className="quiz-progress-section">

          <div className="progress-info">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span>
              {Math.round(progress)}%
            </span>
          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>

          </div>

        </div>

        <div
  className="question-card"
  style={{
  '--watermark-image': `url(${stressWatermark})`,
  }}
>

          <div className="question-number">
            {String(currentQuestion + 1).padStart(2, '0')}
          </div>

          <h2>
            {question.question}
          </h2>

          <p className="question-helper">
            Choose the answer that best describes you.
          </p>

          <div className="options">

            {question.options.map((option) => {

              const isSelected =
                answers[currentQuestion] === option

              return (
                <button
                  key={option}
                  className={
                    isSelected
                      ? 'option selected'
                      : 'option'
                  }
                  onClick={() => handleAnswer(option)}
                >

                  <span className="option-circle">
                    {isSelected && '✓'}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>

                </button>
              )
            })}

          </div>

        </div>

        <div className="quiz-buttons">

          <button
            className="previous-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <span>←</span>
            Back
          </button>

          <button
            className="next-button"
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1
              ? 'View Result'
              : 'Next'}

            <span>→</span>
          </button>

        </div>

      </div>
    </div>
  )
}

export default StressQuizComponent
