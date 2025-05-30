// controllers/youtubeController.js
import { google } from "googleapis";
import User from "../models/User.js";

/* ───────── helper ───────── */
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

/* ────────────────────────────────────────────────
 * 1) GET /api/youtube/auth-url
 *    Return Google OAuth URL
 * ────────────────────────────────────────────────*/
export const getYouTubeAuthUrl = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const alreadyHasRT = !!user?.socialTokens?.youtube?.refresh_token;

    const oauth2Client = buildOAuthClient();
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: alreadyHasRT ? "select_account" : "consent",
      scope: ["https://www.googleapis.com/auth/youtube.readonly"],
    });
    return res.json({ url });
  } catch (err) {
    console.error("❌ getYouTubeAuthUrl error:", err);
    return res
      .status(500)
      .json({ msg: "Failed to generate auth URL", error: err.message });
  }
};

/* ────────────────────────────────────────────────
 * 2) POST /api/youtube/callback
 *    Exchange code → tokens and save
 * ────────────────────────────────────────────────*/
export const handleYouTubeCallback = async (req, res) => {
  const { code } = req.body;
  const userId   = req.user?.id;

  if (!code)   return res.status(400).json({ msg: "Missing authorization code" });
  if (!userId) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const oauth2Client = buildOAuthClient();
    const { tokens }   = await oauth2Client.getToken(code); // redirect_uri already in client

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.socialTokens.youtube = {
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token || user.socialTokens.youtube?.refresh_token,
      expiry_date:   tokens.expiry_date,
    };
    await user.save();

    return res.json({ msg: "✅ YouTube connected successfully" });
  } catch (err) {
    console.error("❌ handleYouTubeCallback error:", err);
    return res
      .status(500)
      .json({ msg: "YouTube connection failed", error: err.message });
  }
};

/* ────────────────────────────────────────────────
 * Shared helper: ensure valid tokens or 401
 * ────────────────────────────────────────────────*/
const getFreshYouTubeClient = async (user) => {
  const ytTok = user.socialTokens.youtube || {};
  if (!ytTok.access_token) throw new Error("NOT_CONNECTED");

  const oauth2 = buildOAuthClient(ytTok);

  if (ytTok.expiry_date && ytTok.expiry_date < Date.now()) {
    if (!ytTok.refresh_token) throw new Error("NO_REFRESH_TOKEN");
    try {
      const { credentials } = await oauth2.refreshAccessToken();
      Object.assign(user.socialTokens.youtube, {
        access_token:  credentials.access_token,
        expiry_date:   credentials.expiry_date,
        refresh_token: credentials.refresh_token || ytTok.refresh_token,
      });
      await user.save();
    } catch (err) {
      console.error("❌ Token refresh failed:", err);
      throw new Error("REFRESH_FAILED");
    }
  }
  return oauth2;
};

/* ────────────────────────────────────────────────
 * 3) GET /api/youtube/analytics
 * ────────────────────────────────────────────────*/
export const fetchYouTubeAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const oauth2Client = await getFreshYouTubeClient(user);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const { data } = await youtube.channels.list({
      part: "snippet,statistics",
      mine: true,
    });

    if (!data.items?.length)
      return res.status(404).json({ msg: "No YouTube channel data found" });

    const ch    = data.items[0];
    const stats = ch.statistics;
    const info  = ch.snippet;

    return res.json({
      channelTitle: info.title,
      channelId:    ch.id,
      subscribers:  stats.subscriberCount,
      views:        stats.viewCount,
      videoCount:   stats.videoCount,
    });
  } catch (err) {
    if (["NOT_CONNECTED", "NO_REFRESH_TOKEN", "REFRESH_FAILED"].includes(err.message)) {
      const user = await User.findById(req.user.id);
      user.socialTokens.youtube = {};
      await user.save();
      return res.status(401).json({ msg: "Session expired. Please reconnect YouTube." });
    }
    console.error("❌ fetchYouTubeAnalytics error:", err);
    return res.status(500).json({ msg: "Failed to fetch analytics", error: err.message });
  }
};

/* ────────────────────────────────────────────────
 * 4) GET /api/youtube/analytics/timeline?range=30
 *     (stubbed demo data)
 * ────────────────────────────────────────────────*/
export const fetchYouTubeTimeline = async (req, res) => {
  const range = Number(req.query.range || 30);
  try {
    const user = await User.findById(req.user.id);
    await getFreshYouTubeClient(user);            // validates / refreshes

    // TODO: Replace stub with YouTube Analytics API call
    const today = new Date();
    const data  = Array.from({ length: range }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (range - 1 - i));
      return { date: d.toISOString().slice(0, 10), views: 500 + i * 12 };
    });
    return res.json(data);
  } catch (err) {
    if (["NOT_CONNECTED", "NO_REFRESH_TOKEN", "REFRESH_FAILED"].includes(err.message)) {
      const user = await User.findById(req.user.id);
      user.socialTokens.youtube = {};
      await user.save();
      return res.status(401).json({ msg: "Session expired. Please reconnect YouTube." });
    }
    console.error("❌ fetchYouTubeTimeline error:", err);
    return res.status(500).json({ msg: "Failed to fetch timeline", error: err.message });
  }
};
