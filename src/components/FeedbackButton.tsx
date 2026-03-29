"use client";

import { useState } from "react";

interface FeedbackButtonProps {
  address: string;
  score: number;
  label: string;
}

export default function FeedbackButton({ address, score, label }: FeedbackButtonProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  function handleFeedback(value: string) {
    setSelected(value);
    // Store feedback in localStorage for now (would be an API in production)
    const feedback = JSON.parse(localStorage.getItem("sunscore_feedback") || "[]");
    feedback.push({
      address,
      score,
      label,
      feedback: value,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("sunscore_feedback", JSON.stringify(feedback));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-800 text-sm font-medium">Thanks for the feedback!</p>
        <p className="text-green-600 text-xs mt-1">
          {selected === "accurate" ? "Good to hear this matches your experience." :
           selected === "too-high" ? "We'll investigate if this area gets less sun than our model predicts." :
           "We'll investigate if this area gets more sun than our model predicts."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-700 font-medium mb-3 text-center">Does this score match your experience?</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback("accurate")}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-green-200 bg-white text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-400 transition-colors"
        >
          Yes, feels right
        </button>
        <button
          onClick={() => handleFeedback("too-high")}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 bg-white text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-400 transition-colors"
        >
          Score too high
        </button>
        <button
          onClick={() => handleFeedback("too-low")}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-200 bg-white text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition-colors"
        >
          Score too low
        </button>
      </div>
    </div>
  );
}
