import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleById, summarize } from "../services/api";
import AISummary from "../components/AISummary";
import ChatBox from "../components/ChatBox";

function Article() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    getArticleById(id)
      .then((res) => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Article not found.");
        setLoading(false);
      });
  }, [id]);

  const handleSummarize = async () => {
    setAiLoading(true);
    setAiError(null);
    setSummary("");
    try {
      const res = await summarize({
        title: article.title,
        articleText: article.description || article.title,
      });
      setSummary(res.data.summary);
    } catch {
      setAiError("AI summary failed. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto">
        <div className="h-64 bg-slate-800 rounded-xl animate-pulse mb-6" />
        <div className="h-8 bg-slate-800 rounded animate-pulse mb-4" />
        <div className="h-4 bg-slate-800 rounded animate-pulse mb-2 w-2/3" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-400 mt-20">
        <p>{error}</p>
        <Link to="/" className="text-sky-400 hover:underline mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-0">
      {/* Back button */}
      <Link
        to="/"
        className="text-slate-400 hover:text-sky-400 text-sm mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← Back to News
      </Link>

      {/* Article Image */}
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 sm:h-72 object-cover rounded-xl mb-6"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      {/* Source + Category + Time */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-sky-400 text-sm font-medium uppercase tracking-wide">
          {article.source}
        </span>
        <span className="text-xs bg-sky-900 text-sky-300 px-2 py-0.5 rounded-full">
          {article.category}
        </span>
        <span className="text-slate-500 text-xs">
          {new Date(article.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white leading-snug mb-4">
        {article.title}
      </h1>

      {/* Description */}
      {article.description && (
        <p className="text-slate-300 leading-relaxed mb-6">
          {article.description}
        </p>
      )}

      {/* AI Summary Button */}
      {!summary && (
        <button
          onClick={handleSummarize}
          disabled={aiLoading}
          className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors mb-6 flex items-center justify-center gap-2"
        >
          {aiLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              AI is summarizing...
            </>
          ) : (
            <>✨ Get AI Summary</>
          )}
        </button>
      )}

      {/* AI Error */}
      {aiError && <p className="text-red-400 text-sm mb-4">{aiError}</p>}

      {/* AI Summary Result */}
      {summary && (
        <AISummary summary={summary} onReset={() => setSummary("")} />
      )}

      {/* Read Full Article */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-xl transition-colors mt-4"
      >
        Read Full Article on {article.source} →
      </a>

      <ChatBox article={article} />
    </div>
  );
}

export default Article;
