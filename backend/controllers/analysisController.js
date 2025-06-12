import AnalysedComment from "../models/AnalysedComment.js";

export const getAnalysedComments = async (req, res) => {
  const { videoId } = req.query;

  try {
    const filter = {};
    if (videoId) filter.videoId = videoId;

    const comments = await AnalysedComment.find(filter).sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("❌ Error fetching analysed comments:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analysed comments",
    });
  }
};
