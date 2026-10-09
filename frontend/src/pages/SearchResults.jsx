
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ResultCard from "../components/ResultCard";
import Loader from "../components/Loader";
import "./Response.css";  

export default function SearchResults() {
  const [params] = useSearchParams();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = params.get("q") || "";
  const type = params.get("type") || "all";

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(query)}&type=${type}`
        );

        const data = response.data?.items || response.data || [];

        if (!Array.isArray(data) || data.length === 0) {
          setResults([]);
          setError("No results found.");
        } else {
          setResults(data);
        }
      } catch (err) {
        console.log("Fetch Error:", err.message);
        setError("Unable to load results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, type]);

  if (loading) return <Loader />;

  return (
    <div className="search_top pt-32 px-4 max-w-5xl mx-auto">
      <p className="text-sm text-gray-500 mb-4">
        Showing results for <span className="text-blue-600">"{query}"</span>
      </p>

      {/* Error UI */}
      {error && (
        <p className="text-gray-600 text-center mt-20 text-lg">{error}</p>
      )}

      {/* Results */}
      {!error && results.length > 0 && (
        <div className="flex flex-col gap-4">
          {results.map((item, index) => (
            <ResultCard key={index} {...item} type={type} />
          ))}
        </div>
      )}
    </div>
  );
}
