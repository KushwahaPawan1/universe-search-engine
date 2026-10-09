// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import SearchResults from "./pages/SearchResults";
// import PreviewPage from "./pages/PreviewPage";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ImageResults from "./pages/Image";
// import News from "./pages/News";
// import Videos from "./pages/Videos";
// import Maps from "./pages/Maps";

// export default function App() {
//   return (
//     <div>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/search" element={<SearchResults />} />
//         <Route path="/preview" element={<PreviewPage />} />
//          <Route path="/images" element={<ImageResults />}/>
//          <Route path="/videos" element={<Videos />}/>
//          <Route path="/news" element={<News />}/>
//          <Route path="/maps" element={<Maps />} />
//       </Routes>
//       <Footer />
//     </div>
//   );
// }















import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import PreviewPage from "./pages/PreviewPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Correct Imports
import ImageResults from "./pages/Image";
import NewsResults from "./pages/News";
import VideoResults from "./pages/Videos";
import MapsResults from "./pages/Maps";
import AIMode from "./pages/AIMode";

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/preview" element={<PreviewPage />} />

        {/* Corrected Routes */}
        <Route path="/images" element={<ImageResults />} />
        <Route path="/videos" element={<VideoResults />} />
        <Route path="/news" element={<NewsResults />} />
        <Route path="/maps" element={<MapsResults />} />
        <Route path="/ai" element={<AIMode />} />
      </Routes>
      <Footer />
    </div>
  );
}
