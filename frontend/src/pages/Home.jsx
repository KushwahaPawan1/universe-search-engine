// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search } from "lucide-react";

// export default function Home() {
//   const [query, setQuery] = useState("");
//   const [videoError, setVideoError] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState(0);
//   const navigate = useNavigate();

//   // 🔥 Add Your 3 Background Videos Here
//   const videos = [
//     "https://cdn.pixabay.com/video/2020/11/09/55990-478348906_tiny.mp4",
//     // "https://cdn.pixabay.com/video/2024/02/13/200427-912684284_large.mp4",
//     // "https://cdn.pixabay.com/video/2023/04/13/158765-817481621_tiny.mp4",
//     // "https://cdn.pixabay.com/video/2023/11/13/188921-884171181_tiny.mp4",
//   ];

//   // 🔄 Change Video Every 5 Sec
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentVideo((prev) => (prev + 1) % videos.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

//       {/* Background Video */}
//       <video
//         key={currentVideo}
//         src={videos[currentVideo]}
//         autoPlay
//         muted
//         loop
//         playsInline
//         preload="auto"
//         onError={() => setVideoError(true)}
//         className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-700"
//       />

//       {/* Fallback if video fails */}
//       {videoError && (
//         <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800" />
//       )}

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/30"></div>

//       {/* CONTENT */}
//       <div className="relative z-10 flex flex-col items-center w-full px-4">
//         <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white text-center drop-shadow-lg">
//           <span className="text-blue-500">U</span>
//           <span className="text-red-500">n</span>
//           <span className="text-yellow-400">i</span>
//           <span className="text-blue-500">v</span>
//           <span className="text-green-500">e</span>
//           <span className="text-red-500">r</span>
//           <span className="text-blue-500">s</span>
//           <span className="text-green-500">e</span>
//         </h1>

//         {/* SEARCH BAR */}
//         <form
//           onSubmit={handleSearch}
//           className="flex items-center w-full max-w-xl bg-white/80 backdrop-blur-md shadow-xl rounded-full px-6 py-3"
//         >
//           <Search className="text-gray-600 mr-3" />
//           <input
//             type="text"
//             placeholder="Search the Universe..."
//             className="flex-grow outline-none text-lg bg-transparent text-gray-900"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//         </form>

//         <p className="mt-6 text-gray-200 text-sm text-center">
//           Discover the world with{" "}
//           <span
//             onClick={() => navigate("/ai")}
//             className="text-blue-400 font-semibold cursor-pointer hover:underline"
//           >
//             Universe AI
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }




















import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [videoError, setVideoError] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();

  // Background Videos
  const videos = [
    "https://cdn.pixabay.com/video/2020/11/09/55990-478348906_tiny.mp4",
  ];

  // Change video every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // 🎤 Voice Search Functionality
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Search");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // You can use "hi-IN" for Hindi
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setQuery(voiceText);

      // Auto navigate just like Google
      navigate(`/search?q=${encodeURIComponent(voiceText.trim())}`);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Video */}
      <video
        key={currentVideo}
        src={videos[currentVideo]}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setVideoError(true)}
        className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-700"
      />

      {/* Fallback If Video Error */}
      {videoError && (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white text-center drop-shadow-lg">
          <span className="text-blue-500">U</span>
          <span className="text-red-500">n</span>
          <span className="text-yellow-400">i</span>
          <span className="text-blue-500">v</span>
          <span className="text-green-500">e</span>
          <span className="text-red-500">r</span>
          <span className="text-blue-500">s</span>
          <span className="text-green-500">e</span>
        </h1>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-xl bg-white/80 backdrop-blur-md shadow-xl rounded-full px-6 py-3"
        >
          <Search className="text-gray-600 mr-3" />

          {/* Input Box */}
          <input
            type="text"
            placeholder="Search the Universe..."
            className="flex-grow outline-none text-lg bg-transparent text-gray-900"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* 🎤 Voice Search Button */}
          <button
            type="button"
            onClick={startVoiceSearch}
            className="ml-3 text-red-500 hover:text-red-600 mr-5"
          >
            <Mic
              className={`w-6 h-6 ${
                listening ? "animate-pulse text-green-500" : "text-gray-700"
              }`}
            />
          </button>
        </form>

        <p className="mt-6 text-gray-200 text-sm text-center">
          Discover the world with{" "}
          <span
            onClick={() => navigate("/ai")}
            className="text-blue-400 font-semibold cursor-pointer hover:underline"
          >
            Universe AI
          </span>
        </p>
      </div>
    </div>
  );
}
