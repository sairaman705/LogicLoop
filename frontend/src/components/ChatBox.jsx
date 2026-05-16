import { useState, useEffect, useRef } from "react";
import { chatWithAI } from "../services/api";

function chatBox({ article }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I've read this article about "${article?.title?.slice(0, 60)}...". Ask me anything about it!`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history for AI context (exclude first greeting)
      const history = updated.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await chatWithAI({
        question: input,
        title: article.title,
        articleText: article.description || article.title,
        conversationHistory: history,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden mt-6">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-900">
        <span className="text-lg">💬</span>
        <h3 className="text-white font-semibold text-sm">
          Chat with AI about this article
        </h3>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI Avatar */}
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                AI
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-sky-600 text-white rounded-br-sm"
                  : "bg-slate-700 text-slate-200 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs ml-2 flex-shrink-0 mt-1">
                You
              </div>
            )}
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-xs mr-2 flex-shrink-0">
              AI
            </div>
            <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about this article..."
          disabled={loading}
          className="flex-1 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500 placeholder-slate-500 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-medium flex-shrink-0"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* Suggested questions */}
      <div className="px-3 pb-3 flex gap-2 flex-wrap">
        {[
          "Explain this simply",
          "Why does this matter?",
          "What are the key points?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => {
              setInput(q);
            }}
            className="text-xs text-slate-400 hover:text-sky-400 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export default chatBox;
