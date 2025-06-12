import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Play, BarChart3, MessageCircle, TrendingUp, Clock, User, Tag, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

const COLORS = {
  positive: "#22c55e", // green
  neutral: "#f59e0b",  // yellow
  negative: "#ef4444", // red
};

const CommentAnalyzer = () => {
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [canFetch, setCanFetch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);


    // Detect viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 748);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        setCanFetch(false);
        setTimeout(() => setCanFetch(true), 15000);
      }
    }, 500);
  };

  const getSentimentStats = () => {
    const stats = { positive: 0, neutral: 0, negative: 0 };
    analysis.forEach((item) => {
      if (stats[item.sentiment] !== undefined) stats[item.sentiment]++;
    });
    return [
      { name: "Positive", value: stats.positive, color: COLORS.positive },
      { name: "Neutral", value: stats.neutral, color: COLORS.neutral },
      { name: "Negative", value: stats.negative, color: COLORS.negative },
    ];
  };

  const stats = getSentimentStats();
  const totalComments = stats.reduce((sum, stat) => sum + stat.value, 0);

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-yellow-500 bg-yellow-50';
    }
  };
    const nextComment = () => {
    setCurrentCommentIndex((prev) => (prev + 1) % analysis.length);
  };

  const prevComment = () => {
    setCurrentCommentIndex((prev) => (prev - 1 + analysis.length) % analysis.length);
  };


  
    // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-red-600 to-teal-600 bg-clip-text text-transparent">
                  YouTube Analyzer
                </h1>
                <p className="text-xs text-gray-600">Comment sentiment analysis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Mobile Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">Get Started</h2>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                placeholder="YouTube Video ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 focus:bg-white"
              />
              
              <button
                onClick={handleOpenForm}
                disabled={!videoId.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Analysis
                </div>
              </button>
              
              {formSubmitted && (
                <button
                  onClick={fetchAnalysis}
                  disabled={!canFetch}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg ${
                    canFetch
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {canFetch ? <TrendingUp className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {canFetch ? "Fetch Results" : "Processing..."}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Loading */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-3"></div>
              <p className="text-teal-600 font-medium">Analyzing...</p>
            </div>
          )}

          {/* Mobile Stats & Chart */}
          {!loading && analysis.length > 0 && (
            <>
              {/* Total + Pie Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="text-center mb-4">
                  <p className="text-gray-600 font-medium">Total Comments Analyzed</p>
                  <p className="text-3xl font-bold text-gray-900">{totalComments}</p>
                </div>
                
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Mobile Stats Cards */}
                <div className="grid grid-cols-3 gap-2">
                  {stats.map((item, index) => (
                    <div key={item.name} className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xl">{getSentimentIcon(item.name.toLowerCase())}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{item.name}</p>
                      <p className="text-lg font-bold text-gray-900">{item.value}</p>
                      <p className="text-xs text-gray-500">
                        {totalComments > 0 ? Math.round((item.value / totalComments) * 100) : 0}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Comments Carousel */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {currentCommentIndex + 1} of {analysis.length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={prevComment}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={nextComment}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Comment Card */}
                {analysis[currentCommentIndex] && (
                  <div className={`border-l-4 rounded-xl p-4 ${getSentimentColor(analysis[currentCommentIndex].sentiment)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900 text-sm">
                          {analysis[currentCommentIndex].author}
                        </span>
                        <span className="text-lg">{getSentimentIcon(analysis[currentCommentIndex].sentiment)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis[currentCommentIndex].sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        analysis[currentCommentIndex].sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {analysis[currentCommentIndex].sentiment}
                      </span>
                    </div>
                    
                    <blockquote className="text-gray-800 italic text-sm mb-3 leading-relaxed">
                      "{analysis[currentCommentIndex].comment}"
                    </blockquote>
                    
                    <div className="bg-white rounded-lg p-3 space-y-2">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">Summary</h4>
                        <p className="text-gray-700 text-sm">{analysis[currentCommentIndex].summary}</p>
                      </div>
                      
                      {analysis[currentCommentIndex].keywords?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <Tag className="w-3 h-3 text-gray-500" />
                            <h4 className="font-medium text-gray-900 text-sm">Keywords</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {analysis[currentCommentIndex].keywords.map((keyword, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {analysis[currentCommentIndex].improvement !== "N/A" && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-orange-900 text-sm mb-1">Improvement</h4>
                              <p className="text-orange-800 text-sm">{analysis[currentCommentIndex].improvement}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Dots */}
                <div className="flex justify-center gap-1 mt-4">
                  {analysis.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCommentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentCommentIndex ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Mobile No Results */}
          {!loading && formSubmitted && analysis.length === 0 && canFetch && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Found</h3>
              <p className="text-gray-600 text-sm">
                No results found. Please check your video ID.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-teal-600 bg-clip-text text-transparent">
                YouTube Comment Analyzer
              </h1>
              <p className="text-gray-600 text-sm mt-1">Analyze sentiment and insights from YouTube comments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">Get Started</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                placeholder="Enter YouTube Video ID (e.g. CIYv59aJIv8)"
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenForm}
                disabled={!videoId.trim()}
                className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Analysis
                </div>
              </button>
              
              {formSubmitted && (
                <button
                  onClick={fetchAnalysis}
                  disabled={!canFetch}
                  className={`flex-1 sm:flex-none px-8 py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg transform ${
                    canFetch
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 hover:shadow-xl hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {canFetch ? <TrendingUp className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    {canFetch ? "Fetch Results" : "Processing..."}
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="text-teal-600 font-medium text-lg">Analyzing comments...</p>
            </div>
          </div>
        )}

        {/* Stats and Chart */}
        {!loading && analysis.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((item, index) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <p className="text-gray-600 font-medium">{item.name}</p>
                      </div>
                      <span className="text-2xl">{getSentimentIcon(item.name.toLowerCase())}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                        <p className="text-sm text-gray-500">
                          {totalComments > 0 ? Math.round((item.value / totalComments) * 100) : 0}% of total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Comments Card */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 font-medium">Total Comments Analyzed</p>
                    <p className="text-4xl font-bold">{totalComments}</p>
                  </div>
                  <MessageCircle className="w-12 h-12 text-teal-200" />
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Comment Results */}
        {!loading && analysis.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-teal-600" />
              <h3 className="text-xl font-semibold text-gray-900">Detailed Analysis</h3>
              <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                {analysis.length} comments
              </span>
            </div>
            
            <div className="space-y-6">
              {analysis.map((item, index) => (
                <div
                  key={item.commentId || index}
                  className={`border-l-4 rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md ${getSentimentColor(item.sentiment)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold text-gray-900">{item.author}</span>
                      <span className="text-2xl">{getSentimentIcon(item.sentiment)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        item.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <blockquote className="text-gray-800 italic border-l-2 border-gray-300 pl-4 text-lg leading-relaxed">
                      "{item.comment}"
                    </blockquote>
                    
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                        <p className="text-gray-700">{item.summary}</p>
                      </div>
                      
                      {item.keywords?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <h4 className="font-medium text-gray-900">Keywords</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.keywords.map((keyword, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.improvement !== "N/A" && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-orange-900 mb-1">Improvement Suggestion</h4>
                              <p className="text-orange-800">{item.improvement}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No results message */}
        {!loading && formSubmitted && analysis.length === 0 && canFetch && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Found</h3>
            <p className="text-gray-600">
              No analysis results found yet. Please check your video ID or try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentAnalyzer;