import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
// import { toggleBookmark } from "../services/api";
import { toggleBookmarkApi } from "../services/api";

function NewsCard({ article, isBookmarked: initialBookmarked = false }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login to bookmark articles");
      return;
    }

    setLoading(true);
    try {
      const res = await toggleBookmarkApi(article._id);
      setBookmarked(res.data.bookmarked);
    } catch (err) {
      console.error("Bookmark error:", err.response?.data || err.message); // ← shows real error
      alert("Failed to bookmark. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-sky-500 transition-all duration-200 flex flex-col h-full">
      {/* Image */}
      <Link to={`/article/${article._id}`}>
        <div className="relative">
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-full h-48 bg-slate-700 flex items-center justify-center">
              <span className="text-4xl">📰</span>
            </div>
          )}
          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              bookmarked
                ? "bg-sky-500 text-white"
                : "bg-slate-900/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {bookmarked ? "★" : "☆"}
          </button>
        </div>
      </Link>

      {/* Content — flex-1 so it stretches */}
      <div className="p-4 flex flex-col flex-1">
        {/* Source + Time */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-sky-400 font-medium uppercase tracking-wide">
            {article.source || "Unknown"}
          </span>
          <span className="text-xs text-slate-500">
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Category Badge */}
        <span className="inline-block text-xs bg-sky-900 text-sky-300 px-2 py-0.5 rounded-full mb-2 w-fit">
          {article.category || "General"}
        </span>

        {/* Title — fixed 2 line clamp */}
        <Link to={`/article/${article._id}`}>
          <h2 className="text-white font-semibold text-sm leading-snug mb-3 hover:text-sky-400 transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {/* Description — fixed 2 line clamp */}
        {article.description && (
          <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
            {article.description}
          </p>
        )}

        {/* Buttons — always at bottom using mt-auto */}
        <div className="flex flex-col gap-2 mt-auto">
          <Link
            to={`/article/${article._id}`}
            className="w-full text-center text-xs bg-sky-600 hover:bg-sky-500 text-white py-2.5 px-3 rounded-lg transition-colors font-medium"
          >
            ✨ AI Summary
          </Link>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-xs bg-slate-700 hover:bg-slate-600 text-white py-2.5 px-3 rounded-lg transition-colors"
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
