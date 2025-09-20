"use client";
import React, { useState } from "react";
import { data } from "../assets/data";
import "./Quiz.css";

const Quiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [answers, setAnswers] = useState([]); // store user answers

  const handleOptionClick = (index) => {
    setSelected(index);
  };

  const handleNext = () => {
    const correct = selected === data[currentQ].ans;
    if (correct) setScore(score + 1);

    // store attempt
    setAnswers((prev) => [
      ...prev,
      { 
        question: data[currentQ].question,
        options: [
          data[currentQ].option1,
          data[currentQ].option2,
          data[currentQ].option3,
          data[currentQ].option4,
        ],
        correctAns: data[currentQ].ans,
        userAns: selected
      }
    ]);

    setSelected(null);
    if (currentQ + 1 < data.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentQ(0);
    setShowResult(false);
    setReviewMode(false);
    setSelected(null);
    setAnswers([]);
  };

  const handleShare = () => {
    const shareText = `🎉 I scored ${score}/${data.length} in the Quiz! 🏆`;
    if (navigator.share) {
      navigator.share({
        title: "My Quiz Result",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <div className="quiz-container">
      {/* Quiz Screen */}
      {!showResult && !reviewMode ? (
        <div>
          <h2 className="quiz-question">
            Question {currentQ + 1} of {data.length}
          </h2>
          <p className="quiz-question">{data[currentQ].question}</p>

          <div className="quiz-options">
            {[data[currentQ].option1, data[currentQ].option2, data[currentQ].option3, data[currentQ].option4].map(
              (option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index + 1)}
                  className={selected === index + 1 ? "selected" : ""}
                >
                  {option}
                </button>
              )
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null}
            className="quiz-btn"
          >
            {currentQ === data.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      ) : null}

      {/* Result Screen */}
      {showResult && !reviewMode ? (
        <div>
          <h2 className="quiz-result">🎉 Quiz Completed!</h2>
          <p>
            You scored <b>{score}</b> out of {data.length}
          </p>
          <div className="quiz-actions">
            <button onClick={handleRestart} className="restart">
              Restart
            </button>
            <button onClick={handleShare} className="share">
              Share Result
            </button>
            <button onClick={() => setReviewMode(true)} className="review">
              View Answers
            </button>
          </div>
        </div>
      ) : null}

      {/* Review Screen */}
      {reviewMode && (
        <div>
          <h2 className="quiz-result">📑 Review Your Answers</h2>
          <div>
            {answers.map((item, idx) => (
              <div key={idx} className="review-card">
                <p>
                  <b>Q{idx + 1}:</b> {item.question}
                </p>
                <ul>
                  {item.options.map((opt, i) => {
                    const optionNum = i + 1;
                    const isCorrect = optionNum === item.correctAns;
                    const isUser = optionNum === item.userAns;

                    return (
                      <li
                        key={i}
                        className={`review-option 
                          ${isCorrect ? "correct" : ""}
                          ${isUser && !isCorrect ? "wrong" : ""}`}
                      >
                        {opt}
                        {isCorrect && " ✅"}
                        {isUser && !isCorrect && " ❌"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={handleRestart} className="restart">
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
