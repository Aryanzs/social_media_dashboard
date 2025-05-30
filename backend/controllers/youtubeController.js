import { google } from "googleapis";
import User from "../models/User.js";

/** -----------------------------------------------------------
 *  1. Helper: build OAuth2 client
 * ---------------------------------------------------------- */
const buildOAuthClient = ({ access_token, refresh_token, expiry_date } = {}) => {
  const client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );
  if (access_token) {
    client.setCredentials({ access_token, refresh_token, expiry_date });
  }
  return client;
};

/** -----------------------------------------------------------
 *  2. GET /auth-url  – send Google OAuth URL to frontend
 * ---------------------------------------------------------- */
export const getYouTubeAuthUrl = (_req, res) => {
  try {
    const oauth2Client = buildOAuthClient();
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/youtube.readonly"],
    });
    res.json({ url });
  } catch (error) {
    console.error("❌ Auth-URL error:", error);
    res.status(500).json({ msg: "Failed to create auth URL", error: error.message });
  }
};

/** -----------------------------------------------------------
 *  3. POST /callback  – exchange code & store tokens
 * ---------------------------------------------------------- */
export const handleYouTubeCallback = async (req, res) => {
  const { code } = req.body;
  const userId   = req.user?.id;

  if (!code)   return res.status(400).json({ msg: "Missing authorization code" });
  if (!userId) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const oauth2Client = buildOAuthClient();
    const { tokens }   = await oauth2Client.getToken({ code, redirect_uri: process.env.YOUTUBE_REDIRECT_URI });

    // Save tokens to DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.socialTokens.youtube = {
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date:   tokens.expiry_date,
    };
    await user.save();

    res.json({ msg: "✅ YouTube connected" });
  } catch (err) {
    console.error("❌ Callback error:", err);
    res.status(500).json({ msg: "YouTube connection failed", error: err.message });
  }
};

/** -----------------------------------------------------------
 *  4. GET /analytics  – return channel stats
 * ---------------------------------------------------------- */
export const fetchYouTubeAnalytics = async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);
    const ytTok = user?.socialTokens?.youtube;

    if (!ytTok?.access_token)
      return res.status(400).json({ msg: "YouTube not connected" });

    // Build client with stored creds
    const oauth2Client = buildOAuthClient(ytTok);

    /* ----- auto-refresh if needed ----- */
    if (ytTok.expiry_date && ytTok.expiry_date < Date.now()) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      Object.assign(user.socialTokens.youtube, {
        access_token:  credentials.access_token,
        expiry_date:   credentials.expiry_date,
        refresh_token: credentials.refresh_token || ytTok.refresh_token,
      });
      await user.save();
    }

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const { data } = await youtube.channels.list({
      part: "snippet,statistics",
      mine: true,
    });

    if (!data.items?.length)
      return res.status(404).json({ msg: "No channel data found" });

    const ch     = data.items[0];
    const stats  = ch.statistics;
    const info   = ch.snippet;

    res.json({
      channelTitle: info.title,
      channelId:    ch.id,
      subscribers:  stats.subscriberCount,
      views:        stats.viewCount,
      videoCount:   stats.videoCount,
    });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ msg: "Failed to fetch analytics", error: err.message });
  }
};

// GET /analytics/timeline?range=30
export const fetchYouTubeTimeline = async (req, res) => {
    const range = Number(req.query.range || 30);
    const user  = await User.findById(req.user.id);
    const ytTok = user?.socialTokens?.youtube;
  
    if (!ytTok?.access_token)
      return res.status(400).json({ msg: "YouTube not connected" });
  
    /** For demo we generate mock numbers.
     *  In production call YouTube Analytics API */
    const today = new Date();
    const data  = Array.from({ length: range }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (range - 1 - i));
      return { date: d.toISOString().slice(0, 10), views: 500 + i * 12 };
    });
    res.json(data);
  };
  