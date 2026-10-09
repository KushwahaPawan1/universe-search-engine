import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

export default function VideoResults() {
  const [params] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = params.get("q");

  useEffect(() => {
    if (!query) return;

    const fetchVideos = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(query)}&type=videos`
        );

        // ✅ FIXED: Automatic detect items array
        const data = res.data?.items || res.data || [];

        if (!Array.isArray(data) || data.length === 0) {
          setVideos([]);
          setError("No videos found.");
        } else {
          setVideos(data);
        }
      } catch (err) {
        console.error("Video fetch error:", err.message);
        setError("Unable to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="pt-32 px-4 max-w-6xl mx-auto">
      <h2 className="text-base text-gray-600 mb-4">
        Showing video results for <span className="text-blue-600">"{query}"</span>
      </h2>

      {error ? (
        <p className="text-gray-600 text-center text-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((vid, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition"
            >
              <a href={vid.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={vid.thumbnail || "/placeholder_video.png"}
                  alt={vid.title || "Video"}
                  className="w-full h-48 object-cover"
                />
              </a>

              {/* Video Text */}
              <div className="p-3">
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-800 line-clamp-2 hover:text-blue-600"
                >
                  {vid.title || "Untitled video"}
                </a>

                {/* Optional channel + duration */}
                <p className="text-sm text-gray-500 mt-1">
                  {vid.channel || "Unknown Channel"}
                </p>

                {vid.duration && (
                  <p className="text-xs text-gray-400 mt-1">{vid.duration}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
