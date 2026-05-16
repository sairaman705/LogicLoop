import axios from "axios";
import Article from "../models/Article.js";

// auto assigns category based on keywords in title
const assignCategory = (title = "", description = "") => {
  const text = (title + " " + description).toLowerCase();

  if (
    text.match(
      /\b(ai|artificial intelligence|machine learning|ml|llm|gpt|gemini|claude|chatbot|neural|deepmind|openai|copilot|midjourney|stable diffusion|large language|generative|chatgpt|mistral|llama|groq)\b/,
    )
  )
    return "AI/ML";

  if (
    text.match(
      /\b(react|vue|angular|javascript|css|html|frontend|backend|node|api|developer|coding|github|typescript|python|programming|software engineer|web app|framework|nextjs|tailwind|developer)\b/,
    )
  )
    return "Web Dev";

  if (
    text.match(
      /\b(hack|cyber|security|breach|malware|ransomware|vulnerability|phishing|privacy|encryption|exploit|zero.day|attack|stolen|leaked|scam|fraud|password|antivirus)\b/,
    )
  )
    return "Cybersecurity";

  if (
    text.match(
      /\b(startup|funding|venture|series a|series b|ipo|acquisition|valuation|founder|yc|y combinator|seed round|unicorn|pitch|investor|raised)\b/,
    )
  )
    return "Startups";

  if (
    text.match(
      /\b(iphone|android|samsung|pixel|mobile|smartphone|ios|app store|google play|5g|tablet|ipad|oneplus|xiaomi|nothing phone)\b/,
    )
  )
    return "Mobile";

  if (
    text.match(
      /\b(apple|google|microsoft|meta|amazon|tesla|nvidia|intel|amd|aws|facebook|twitter|x\.com|tiktok|netflix|adobe|oracle|ibm|qualcomm)\b/,
    )
  )
    return "Big Tech";

  return "General";
};

// Fetch news articles from NewsAPI and save to MongoDB
export const fetchAndSaveNews = async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category: "technology",
        language: "en",
        pageSize: 20,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = response.data.articles;

    // Filter out articles with [Removed] titles (NewsAPI quirk)
    const cleaned = articles.filter((a) => a.title && a.title !== "[Removed]");

    const saved = await Promise.all(
      cleaned.map((a) =>
        Article.findOneAndUpdate(
          { url: a.url },
          {
            title: a.title,
            description: a.description,
            url: a.url,
            urlToImage: a.urlToImage,
            source: a.source?.name,
            publishedAt: a.publishedAt,
            category: assignCategory(a.title, a.description),
          },
          { upsert: true, returnDocument: "after" },
        ),
      ),
    );

    res.json({ message: `${saved.length} articles saved`, articles: saved });
  } catch (error) {
    console.error("Error fetching and saving news:", error);
    res.status(500).json({ message: "Error fetching and saving news" });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const { category } = req.query;
    console.log("Category requested:", category); // ← debug

    let filter = {};
    if (category && category !== "All") {
      filter = { category: category };
    }

    console.log("Filter applied:", filter); // ← debug

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .limit(50);

    console.log("Articles found:", articles.length); // ← debug
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to get news" });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching article with id:", id);

    if (!id) {
      return res.status(400).json({ error: "No ID provided" });
    }

    const article = await Article.findById(id);
    console.log("Found:", article ? "yes" : "no");

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error("Get article error:", err.message);
    res.status(500).json({ error: "Failed to get article" });
  }
};
