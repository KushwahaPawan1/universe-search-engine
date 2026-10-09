import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PreviewPage() {
  const [params] = useSearchParams();
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  const url = params.get("url");

  useEffect(() => {
    if (!url) return;

    const fetchContent = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/fetch?url=${encodeURIComponent(url)}`
        );

        setHtml(res.data?.html || "<p>No preview available.</p>");
      } catch (err) {
        console.error("Preview Error:", err);
        setHtml(`
          <p class='text-red-500 font-semibold'>
            ⚠️ Unable to load page content.
          </p>
        `);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [url]);

  return (
    <div className="pt-28 px-4 max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-blue-600 break-all">
        {url}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading preview...</p>
      ) : (
        <div
          className="prose max-w-none border p-5 bg-white rounded-xl shadow-sm overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
