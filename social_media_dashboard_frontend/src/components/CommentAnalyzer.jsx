import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CommentAnalyzer = () => {
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [canFetch, setCanFetch] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    if (!videoId) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/analysis?videoId=${videoId}`);
      setAnalysis(response.data.data);
    } catch (err) {
      console.error("Error fetching analysis:", err.message);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  const handleOpenForm = () => {
    if (!videoId.trim()) {
      alert("Please enter a valid video ID before starting.");
      return;
    }

    const formWindow = window.open(
      "https://seemaz.app.n8n.cloud/form/91df2cf9-4557-41f9-8430-3040a32374aa",
      "n8nCommentForm",
      "width=600,height=700,left=200,top=100"
    );

    const pollTimer = setInterval(() => {
      if (formWindow.closed) {
        clearInterval(pollTimer);
        setFormSubmitted(true);
        setCanFetch(false); // Start 15 sec wait
        setTimeout(() => setCanFetch(true), 15000); // Enable button after 15 sec
      }
    }, 500);
  };

  return (
    <div className="p-4 rounded-lg bg-white shadow-md border border-teal-300 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-teal-700 mb-2">
        🎯 YouTube Comment Analyzer
      </h2>

      {/* Input and open form */}
      <div className="flex gap-4 items-center justify-center">
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube Video ID (e.g. CIYv59aJIv8)"
          className="border border-gray-300 rounded px-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleOpenForm}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          🚀 Open Form
        </button>
      </div>

      {/* Fetch Button */}
      {formSubmitted && (
        <div className="text-center">
          <button
            onClick={fetchAnalysis}
            disabled={!canFetch}
            className={`mt-4 px-4 py-2 rounded transition shadow-md ${
              canFetch
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {canFetch ? "📥 Fetch Analysis Result" : "⏳ Waiting for Analysis..."}
          </button>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <p className="text-teal-600 font-medium mt-4">⏳ Fetching results...</p>
      )}

      {/* Display Results */}
      {!loading && analysis.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-xl font-semibold text-gray-800">📝 Analysis Results</h3>
          {analysis.map((item) => (
            <div
              key={item.commentId}
              className="border border-gray-200 p-3 rounded-md shadow-sm bg-gray-50"
            >
              <p className="text-sm text-gray-700">
                <strong>Author:</strong> {item.author}
              </p>
              <p className="text-gray-800 mb-1">{item.comment}</p>
              <p className="text-sm text-teal-600 font-semibold">
                Sentiment: {item.sentiment}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Summary:</strong> {item.summary}
              </p>
              {item.keywords?.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Keywords:</strong> {item.keywords.join(", ")}
                </p>
              )}
              {item.improvement !== "N/A" && (
                <p className="text-sm text-red-500 mt-1">
                  <strong>Improvement Tip:</strong> {item.improvement}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* If no result */}
      {!loading && formSubmitted && analysis.length === 0 && canFetch && (
        <p className="text-sm text-gray-500 italic mt-4">
          No analysis results found yet. Please check your video ID or try again after a few seconds.
        </p>
      )}
    </div>
  );
};

export default CommentAnalyzer;
