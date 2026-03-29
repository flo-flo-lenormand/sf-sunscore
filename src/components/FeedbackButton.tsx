"use client";

interface FeedbackButtonProps {
  address: string;
  score: number;
  label: string;
}

function openIssue(address: string, score: number, label: string, feedback: string) {
  const title = `Feedback: ${address} (score ${score} - ${feedback})`;
  const body = `**Address:** ${address}
**Score:** ${score} (${label})
**Feedback:** ${feedback}

**Your experience:**
<!-- Tell us what you observe at this location - is it sunnier or foggier than the score suggests? -->

`;
  const url = `https://github.com/flo-flo-lenormand/sf-sunscore/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=${encodeURIComponent("feedback")}`;
  window.open(url, "_blank");
}

export default function FeedbackButton({ address, score, label }: FeedbackButtonProps) {
  return (
    <div>
      <p className="text-sm text-gray-700 font-medium mb-3 text-center">Does this score match your experience?</p>
      <div className="flex gap-2">
        <button
          onClick={() => openIssue(address, score, label, "Feels right")}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-green-200 bg-white text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-400 transition-colors"
        >
          Yes, feels right
        </button>
        <button
          onClick={() => openIssue(address, score, label, "Score too high")}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 bg-white text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-400 transition-colors"
        >
          Score too high
        </button>
        <button
          onClick={() => openIssue(address, score, label, "Score too low")}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-200 bg-white text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition-colors"
        >
          Score too low
        </button>
      </div>
    </div>
  );
}
