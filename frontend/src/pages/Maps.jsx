import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import "./Response.css";

export default function MapsResults() {
  const [params] = useSearchParams();
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = params.get("q");

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(query)}&type=maps`
      )
      .then((res) => {
        console.log("Maps Response:", res.data);

        // backend se aane wale items ko safely use karo
        setMaps(res.data?.items || []);
      })
      .catch((err) => {
        console.error("Maps API Error:", err);
        setMaps([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="search_top pt-32 px-4 max-w-6xl mx-auto">
      {maps.length > 0 ? (
        maps.map((item, i) => (
          <div key={i} className="mb-6 border-b pb-3">
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(
                item.title || query
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline text-lg"
            >
              {item.title || "Unknown Place"}
            </a>

            <p className="text-gray-700 text-sm mt-1">
              {item.content?.slice(0, 180) || "No description available..."}...
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-lg mt-10 text-center">
          No map results found for "<b>{query}</b>"
        </p>
      )}
    </div>
  );
}
