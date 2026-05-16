import { useEffect, useState } from "react";
import { getAllNews, getBookmarksApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import NewsCard from "../components/NewsCard";

const CATEGORIES = [
  "All",
  "AI/ML",
  "Web Dev",
  "Cybersecurity",
  "Startups",
  "Mobile",
  "Big Tech",
  "General",
];

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    if (user) {
      getBookmarksApi()
        .then((res) => setBookmarkedIds(new Set(res.data.map((a) => a._id))))
        .catch(() => {});
    }
  }, [user]);

  const loadNews = (category) => {
    setLoading(true);
    setError(null);
    getAllNews(category)
      .then((res) => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load news. Make sure backend is running.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadNews("All");
  }, []);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearchParams({}); // clear search
    loadNews(cat);
  };

  // Filter by search query on frontend
  const filtered = searchQuery
    ? articles.filter(
        (a) =>
          a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.source?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : articles;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Latest Tech News</h1>
        <p className="text-slate-400 text-sm">
          Powered by AI — stay ahead of the curve
        </p>
      </div>

      {/* Search result banner */}
      {searchQuery && (
        <div className="flex items-center gap-3 mb-6 bg-slate-800 px-4 py-3 rounded-xl border border-slate-700">
          <span className="text-slate-300 text-sm">
            Search results for{" "}
            <span className="text-sky-400 font-medium">"{searchQuery}"</span> —{" "}
            {filtered.length} found
          </span>
          <button
            onClick={() => setSearchParams({})}
            className="text-slate-500 hover:text-white text-xs ml-auto"
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Category Tabs — hide when searching */}
      {!searchQuery && (
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-sky-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
            >
              <div className="h-48 bg-slate-700 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-700 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-slate-700 rounded animate-pulse" />
                <div className="h-4 bg-slate-700 rounded animate-pulse w-4/5" />
                <div className="h-3 bg-slate-700 rounded animate-pulse w-2/3" />
                <div className="h-8 bg-slate-700 rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center mt-20">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => loadNews(activeCategory)}
            className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-xl font-bold text-white mb-2">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "No articles yet"}
          </p>
          <p className="text-slate-400 text-sm">
            {searchQuery
              ? "Try a different search term"
              : "Try another category"}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-slate-500 text-sm mb-4">
            {filtered.length} articles
            {activeCategory !== "All" && !searchQuery
              ? ` in ${activeCategory}`
              : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((article) => (
              <NewsCard
                key={article._id}
                article={article}
                isBookmarked={bookmarkedIds.has(article._id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
