import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import "./Response.css";

export default function ImageResults() {
  const [params] = useSearchParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = params.get("q");

  const placeholderImage =
    "https://via.placeholder.com/400x300.png?text=No+Image";

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(
          query
        )}&type=images`
      )
      .then((res) => {
        console.log("Image API Response:", res.data);

        const items = res.data?.items || [];

        const imgs = items
          .map((item) => ({
            title: item.title || "No title",
            url:
              item.link ||
              item.image?.thumbnailLink ||
              item.thumbnail ||
              placeholderImage,
            thumbnail:
              item.image?.thumbnailLink ||
              item.thumbnail ||
              item.link ||
              placeholderImage,
          }))
          .filter((item) => item.url);

        setImages(imgs);
      })
      .catch((err) => {
        console.error("Image Fetch Error:", err);
        setImages([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="search_top pt-32 px-4 max-w-7xl mx-auto">
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {images.map((img, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl shadow-md 
              hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
            >
              {/* IMAGE */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
              </div>

              {/* TITLE */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed">
                  {img.title}
                </p>
              </div>

              {/* Hover Border Glow */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/60 rounded-xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg text-center mt-10">
          No images found for "<b>{query}</b>"
        </p>
      )}
    </div>
  );
}
