import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, authorId } = req.body;
    if (authorId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to create comment!"));
    }
    const newComment = new Comment({
      content,
      author: authorId,
      post: postId,
    });
    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "username profilePicture"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return next(errorHandler(404, "Post not found"));
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
