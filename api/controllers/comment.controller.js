import Comment from "../models/comment.model.js";

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
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};
