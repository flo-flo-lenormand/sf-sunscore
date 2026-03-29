"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  large?: boolean;
  defaultValue?: string;
}

export default function SearchBar({ large = false, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/score?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className={`flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-shadow focus-within:shadow-xl focus-within:border-amber-300 ${large ? "p-2" : "p-1"}`}>
        <div className={`flex-shrink-0 ${large ? "pl-4" : "pl-3"}`}>
          <svg className={`text-gray-400 ${large ? "w-6 h-6" : "w-5 h-5"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter an address or neighborhood in SF..."
          className={`flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 ${large ? "px-4 py-3 text-lg" : "px-3 py-2 text-base"}`}
        />
        <button
          type="submit"
          className={`flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors ${large ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"}`}
        >
          Look up
        </button>
      </div>
    </form>
  );
}
