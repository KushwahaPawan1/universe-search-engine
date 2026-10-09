// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Search } from "lucide-react";

// export default function Header() {
//   const [query, setQuery] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Hide on Home page
//   if (location.pathname === "/" || location.pathname === "/ai") return null;

//   const params = new URLSearchParams(location.search);
//   const activeType = params.get("type");

//   // ------------------- TABS -------------------
//   const tabs = ["AI Mode", "all", "images", "videos", "news", "maps"];

//   const handleTabChange = (type) => {
//     const q = params.get("q") || query;
//     if (!q) return;

//     if (type === "AI Mode") {
//       navigate(`/ai?q=${encodeURIComponent(q)}`);
//       return;
//     }

//     if (type === "images") {
//       navigate(`/images?q=${encodeURIComponent(q)}`);
//     } else if (type === "videos") {
//       navigate(`/videos?q=${encodeURIComponent(q)}`);
//     } else if (type === "news") {
//       navigate(`/news?q=${encodeURIComponent(q)}`);
//     } else if (type === "maps") {
//       navigate(`/maps?q=${encodeURIComponent(q)}`);
//     } else {
//       navigate(`/search?q=${encodeURIComponent(q)}&type=${type}`);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       navigate(`/search?q=${encodeURIComponent(query.trim())}&type=${activeType}`);
//     }
//   };

//   return (
//     <header className="fixed top-0 w-full shadow-sm z-50 border-b bg-white">
//       <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between p-3">
//         {/* Logo */}
//         <h1
//           onClick={() => navigate("/")}
//           className="text-3xl font-extrabold cursor-pointer select-none"
//         >
//           <span className="text-blue-600">U</span>
//           <span className="text-red-500">n</span>
//           <span className="text-yellow-500">i</span>
//           <span className="text-blue-600">v</span>
//           <span className="text-green-500">e</span>
//           <span className="text-red-500">r</span>
//           <span className="text-blue-600">s</span>
//           <span className="text-green-500">e</span>
//         </h1>

//         {/* Search Bar */}
//         <form
//           onSubmit={handleSearch}
//           className="flex items-center w-full sm:w-1/2 bg-gray-100 rounded-full px-4 py-2 mt-3 sm:mt-0"
//         >
//           <Search className="text-gray-500 mr-2" size={18} />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search the Universe..."
//             className="flex-grow bg-transparent outline-none text-gray-800"
//           />
//         </form>
//       </div>

//       {/* Tabs */}
//       <nav className="border-t border-gray-200 bg-gray-50">
//         <div className="max-w-6xl mx-auto flex gap-6 px-4 py-2 text-sm text-gray-600">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => handleTabChange(tab)}
//               className={`capitalize pb-2 border-b-2 transition ${
//                 // activeType match nahi hoga AI mode me
//                 (activeType === tab || (tab === "ai" && location.pathname === "/ai"))
//                   ? "border-blue-600 text-blue-600 font-semibold"
//                   : "border-transparent hover:text-blue-600"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </nav>
//     </header>
//   );
// }











import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Mic } from "lucide-react";

export default function Header() {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Hide on Home page
  if (location.pathname === "/" || location.pathname === "/ai") return null;

  const params = new URLSearchParams(location.search);
  const activeType = params.get("type");

  // ------------------- TABS -------------------
  const tabs = ["AI Mode", "all", "images", "videos", "news", "maps"];

  const handleTabChange = (type) => {
    const q = params.get("q") || query;
    if (!q) return;

    if (type === "AI Mode") {
      navigate(`/ai?q=${encodeURIComponent(q)}`);
      return;
    }

    if (type === "images") {
      navigate(`/images?q=${encodeURIComponent(q)}`);
    } else if (type === "videos") {
      navigate(`/videos?q=${encodeURIComponent(q)}`);
    } else if (type === "news") {
      navigate(`/news?q=${encodeURIComponent(q)}`);
    } else if (type === "maps") {
      navigate(`/maps?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}&type=${type}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}&type=${activeType}`);
    }
  };

  // ------------------- 🎤 VOICE SEARCH -------------------
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support Voice Search");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Hindi ke liye "hi-IN"
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setQuery(text);

      // Auto navigate
      navigate(`/search?q=${encodeURIComponent(text)}&type=${activeType}`);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <header className="fixed top-0 w-full shadow-sm z-50 border-b bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between p-3">
        
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-extrabold cursor-pointer select-none"
        >
          <span className="text-blue-600">U</span>
          <span className="text-red-500">n</span>
          <span className="text-yellow-500">i</span>
          <span className="text-blue-600">v</span>
          <span className="text-green-500">e</span>
          <span className="text-red-500">r</span>
          <span className="text-blue-600">s</span>
          <span className="text-green-500">e</span>
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full sm:w-1/2 bg-gray-100 rounded-full px-4 py-2 mt-3 sm:mt-0"
        >
          <Search className="text-gray-500 mr-2" size={18} />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the Universe..."
            className="flex-grow bg-transparent outline-none text-gray-800"
          />

          {/* 🎤 Voice Search Button */}
          <button
            type="button"
            onClick={startVoiceSearch}
            className="ml-3 text-red-500 hover:text-red-600 mr-5"
          >
            <Mic
              size={20}
              className={`${listening ? "text-green-600 animate-pulse" : "text-gray-700"}`}
            />
          </button>
        </form>
      </div>

      {/* Tabs */}
      <nav className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto flex gap-6 px-4 py-2 text-sm text-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`capitalize pb-2 border-b-2 transition ${
                (activeType === tab ||
                  (tab === "AI Mode" && location.pathname === "/ai"))
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
