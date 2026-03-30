// src/context/InterviewContext.jsx
import React, { createContext, useState, useRef } from "react";
import { questions as QUESTIONS } from "../utils/questions";
import fetchFunction from "../utils/fetchFunction";
import { QUESTIONS_BY_COMPANY } from "../utils/constants";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  // Loading and interview state
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Autoplay state
  const [shouldAutoPlay, setShouldAutoPlay] = useState(true);

  // Manual replay trigger
  const triggerReplay = () => setShouldAutoPlay(true);

  // Answers
  const [answers, setAnswers] = useState(
    Array(QUESTIONS.length).fill({ question: "", answer: "" })//
  );

  // Recording + DB questions
  const [recordingState, setRecordingState] = useState("idle");
  const [dbQuestions, setDbQuestions] = useState(null);
  const [dbQuestionsError, setDbQuestionsError] = useState("");
  const recognitionRef = useRef(null);

  // Dashboard selection
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Actual questions
  const questionSet =
    (dbQuestions && dbQuestions?.questionsSet?.questions) || QUESTIONS;

  // Reset interview state
  const resetInterview = () => {
    setStarted(false);
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers(Array(questionSet.length).fill({ question: "", answer: "" }));//
    setRecordingState("idle");
    setShouldAutoPlay(true); // autoplay first question
  };

  // Start interview
  const startInterview = () => {
    resetInterview();
    setStarted(true);
  };

  // Select company + role → fetch questions
  const selectCompanyRole = async (slug, company, role) => {
    setSelectedCompany(company);
    setSelectedRole(role);

    const result = await fetchFunction({
      apiUrl: QUESTIONS_BY_COMPANY + slug,
      crudMethod: "GET",
      setError: setDbQuestionsError,
    });

    if (result.status === "success") {
      setDbQuestions(result);
    } else {
      console.log("ERROR FETCHING QUESTIONS:", dbQuestionsError);
    }
  };

  // Speak question
  const playQuestion = (index = currentQuestionIndex) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const text = questionSet[index]?.question || questionSet[index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  };

  // Save answer
  const addAnswer = (text, index = currentQuestionIndex) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = {
        question: questionSet[index]?.question,////
        answer: text || "No Answer Recorded",
      };
      return copy;
    });
  };

  // Next question
  const nextQuestion = () => {
    setRecordingState("idle");

    // Move to next if available
    if (currentQuestionIndex < questionSet.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);

      // Enable autoplay for both manual next and recording-finish next
      setShouldAutoPlay(true);
    } else {
      // Last question - interview complete
      setCompleted(true);

      // DO NOT autoplay anything here
      setShouldAutoPlay(false);
    }
  };

  // Previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);

      // No autoplay when going back
      setShouldAutoPlay(false);
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        dbQuestions,
        questionSet,
        started,
        startInterview,
        resetInterview,
        completed,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        addAnswer,
        recordingState,
        setRecordingState,
        recognitionRef,
        playQuestion,
        nextQuestion,
        prevQuestion,
        selectedCompany,
        selectedRole,
        selectCompanyRole,
        setStarted,
        loading,
        setLoading,

        // autoplay exports
        shouldAutoPlay,
        setShouldAutoPlay,
        triggerReplay,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}