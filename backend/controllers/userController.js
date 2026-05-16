import User from "../models/User.js";
import Article from "../models/Article.js";

// PATCH /api/users/bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { articleId } = req.body;
    const userId = req.user.id;

    if (!articleId) {
      return res.status(400).json({ error: "No articleId provided" });
    }

    // Get raw user document
    const user = await User.findById(userId).lean(); // ← .lean() returns plain JS object
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("Raw user from DB:", JSON.stringify(user));

    // Build current bookmarks array
    let bookmarks = Array.isArray(user.bookmarks)
      ? user.bookmarks.map((id) => id.toString())
      : [];
    console.log("Current bookmarks:", bookmarks);

    const isBookmarked = bookmarks.includes(articleId);

    if (isBookmarked) {
      bookmarks = bookmarks.filter((id) => id !== articleId);
    } else {
      bookmarks.push(articleId);
    }

    console.log("New bookmarks array:", bookmarks);

    // Force update using $set directly
    await User.collection.updateOne(
      { _id: user._id },
      { $set: { bookmarks: bookmarks } },
    );

    // Verify
    const verify = await User.findById(userId).lean();
    console.log("Verified bookmarks:", verify.bookmarks);

    res.json({ bookmarked: !isBookmarked });
  } catch (err) {
    console.error("Bookmark error:", err.message);
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
};

// GET /api/users/bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const bookmarkIds = Array.isArray(user.bookmarks) ? user.bookmarks : [];
    console.log("Bookmark IDs:", bookmarkIds);

    if (bookmarkIds.length === 0) return res.json([]);

    const articles = await Article.find({ _id: { $in: bookmarkIds } }).lean();
    console.log("Articles found:", articles.length);

    res.json(articles.reverse());
  } catch (err) {
    console.error("Get bookmarks error:", err.message);
    res.status(500).json({ error: "Failed to get bookmarks" });
  }
};

// POST /api/users/history
export const addToHistory = async (req, res) => {
  try {
    const { articleId } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { readHistory: articleId },
    });

    await User.findByIdAndUpdate(userId, {
      $push: { readHistory: { $each: [articleId], $position: 0 } },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("History error:", err.message);
    res.status(500).json({ error: "Failed to record history" });
  }
};
