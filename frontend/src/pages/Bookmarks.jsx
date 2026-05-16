import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookmarksApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import NewsCard from "../components/NewsCard";

function Bookmarks() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getBookmarksApi()
      .then((res) => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Not logged in
  if (!user)
    return (
      <div className="text-center mt-20">
        <p className="text-2xl font-bold text-white mb-3">Your Bookmarks</p>
        <p className="text-slate-400 mb-6">
          Login to save and view your bookmarks
        </p>
        <Link
          to="/login"
          className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl transition-colors"
        >
          Login
        </Link>
      </div>
    );

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl h-64 animate-pulse" />
        ))}
      </div>
    );

  if (articles.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-2xl font-bold text-white mb-3">No bookmarks yet</p>
        <p className="text-slate-400 mb-6">
          Click the ☆ on any article to save it here
        </p>
        <Link
          to="/"
          className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl transition-colors"
        >
          Browse News
        </Link>
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Your Bookmarks</h1>
        <p className="text-slate-400 text-sm">
          {articles.length} saved articles
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard key={article._id} article={article} isBookmarked={true} />
        ))}
      </div>
    </div>
  );
}

export default Bookmarks;
