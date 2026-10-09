import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import "./Response.css";

export default function NewsResults() {
  const [params] = useSearchParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = params.get("q");

  const placeholderImage =
    "https://img.freepik.com/premium-vector/breaking-news-banner_275806-252.jpg";

  // Extract domain from URL
  const getSource = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Unknown";
    }
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(
          query
        )}&type=news`
      )
      .then((res) => {
        console.log("News Response:", res.data);
        setNews(res.data?.items || []);
      })
      .catch((err) => {
        console.error("News API Error:", err);
        setNews([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="search_top pt-32 px-4 max-w-7xl mx-auto">
      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((item, i) => (
            <a
              key={i}
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300"
            >
              {/* News Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={placeholderImage}
                  alt="News Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-4 flex flex-col h-full">
                {/* Title */}
                <h2 className="text-md sm:text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2">
                  {item.title || "Untitled News"}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {item.content || "No description available..."}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span className="font-medium">
                    {getSource(item.url)}
                  </span>

                  {item.pubDate && (
                    <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-lg mt-10">
          No news found for "<b>{query}</b>"
        </p>
      )}
    </div>
  );
}
