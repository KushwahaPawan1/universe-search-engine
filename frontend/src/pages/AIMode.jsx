import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AIMode() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Voice Recognition
  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";

    recognition.onresult = (event) => {
      setQuery(event.results[0][0].transcript);
    };

    recognition.start();
  };

  // Send AI Query to backend
  const handleAI = async () => {
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/ai?q=${encodeURIComponent(userMsg.text)}`
      );      const botMsg = {
        sender: "bot",
        text: res.data.ai || "No answer received.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Server Error: Unable to connect.",
        },
      ]);
    }

    setLoading(false);
  };

  // console.log(import.meta.env.VITE_API_URL)


  return (
    <div className="flex flex-col h-screen bg-[#e9edf2]">

      {/* HEADER — GLASS EFFECT */}
      <div className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/40 border-b shadow-sm px-4 py-4 z-20 flex items-center gap-4">
        
        {/* Back Button using navigate(-1) */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/30 hover:bg-white/50 shadow transition"
        >
          ←
        </button>

        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            AI Mode <span className="text-blue-600">U</span>
            <span className="text-red-500">n</span>
            <span className="text-yellow-500">i</span>
            <span className="text-blue-600">v</span>
            <span className="text-green-500">e</span>
            <span className="text-red-500">r</span>
            <span className="text-blue-600">s</span>
            <span className="text-green-500">e</span>
          </h1>
          <p className="text-sm text-gray-600">Ask anything…</p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 pb-40 pt-[95px]">

        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-24">
            <p className="text-lg opacity-80">Start the conversation…</p>
            <p className="text-sm opacity-40">Type or use voice 🎤</p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-3 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 text-sm rounded-2xl shadow-md backdrop-blur-xl 
                ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white/70 border border-gray-200 text-gray-800 rounded-bl-none"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing Bubble */}
        {loading && (
          <div className="my-3 flex justify-start">
            <div className="px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl shadow animate-pulse text-gray-500">
              AI is typing…
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* BOTTOM INPUT BAR — GLASS EFFECT */}
      <div className="fixed bottom-0 left-0 w-full backdrop-blur-xl bg-white/40 border-t shadow-xl px-4 py-4 flex items-center gap-3">

        {/* Voice Input */}
        <button
          onClick={startVoiceInput}
          className="w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 shadow flex items-center justify-center transition"
        >
          🎤
        </button>

        {/* Input */}
        <input
          type="text"
          placeholder="Ask anything…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAI()}
          className="flex-1 px-4 py-3 bg-white/30 border border-gray-300 rounded-full outline-none shadow focus:bg-white/50 transition"
        />

        {/* Send Button */}
        <button
          onClick={handleAI}
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
