import cron from "node-cron";
import axios from "axios";
import Article from "../models/Article.js";

const fetchNews = async() =>{
    try {
        console.log("⏰ Cron job running — fetching latest news...");
        const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category: "technology",
        language: "en",
        pageSize: 20,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = response.data.articles;
    const cleaned = articles.filter(a => a.title && a.title !== "[Removed]");

    const saved = await Promise.all(
      cleaned.map(a =>
        Article.findOneAndUpdate(
          { url: a.url },
          {
            title:       a.title,
            description: a.description,
            url:         a.url,
            urlToImage:  a.urlToImage,
            source:      a.source?.name,
            publishedAt: a.publishedAt,
          },
          { upsert: true, new: true }
        )
      )
    );

    console.log(`✅ Cron done — ${saved.length} articles updated`);
    } catch (error) {
        console.error("Cron job failed:", err.message);
    }
}

export const startCronJobs = () => {
  // runs every 6 hours: at 00:00, 06:00, 12:00, 18:00
  cron.schedule("0 */6 * * *", fetchNews);
  console.log("✅ Cron job scheduled — news fetches every 6 hours");

  // fetch immediately when server starts too
  fetchNews();
};