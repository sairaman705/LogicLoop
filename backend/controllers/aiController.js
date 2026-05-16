import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

export const summarizeArticle = async (req, res) => {
  try {
    const { articleText, title } = req.body;

    if (!articleText && !title) {
      return res.status(400).json({ error: "No article content provided" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
            You are a tech news assistant.
            Summarize this tech news article in exactly 3 bullet points.
            Each bullet should be one clear simple sentence.
            
            Title: ${title || "Tech News"}
            Article: ${articleText}
            
            Reply ONLY with 3 bullet points. Nothing else.
          `,
        },
      ],
      max_tokens: 300,
    });

    const summary = response.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: "AI summarization failed" });
  }
};

export const chatWithArticle = async (req, res) => {
  try {
    const { question, articleText, title, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Build messages array — includes past conversation for context
    const messages = [
      {
        role: "system",
        content: `You are a helpful tech news assistant. 
        The user is reading this article:
        Title: ${title || "Tech Article"}
        Content: ${articleText || "No article content provided"}
        
        Answer questions about this article in simple, clear language.
        Keep answers short — 2 to 4 sentences max.`,
      },
      // inject past conversation so AI remembers context
      ...conversationHistory,
      {
        role: "user",
        content: question,
      },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 400,
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("Groq chat error:", err.message);
    res.status(500).json({ error: "AI chat failed" });
  }
};
