import { errorHandler } from "../utils/error.js";
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
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 6;

    const { postId } = req.params;

    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return next(errorHandler(404, "Post not found"));
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPostComments = await Comment.countDocuments({ post: postId });

    res.status(200).json({ comments, totalPostComments });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const existingComment = await Comment.findById(req.params.commentId);
    if (!existingComment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userId = req.user.id;

    const userIndex = existingComment.likes.indexOf(userId);
    if (userIndex === -1) {
      // Если не лайкал — добавляем лайк
      existingComment.numberOfLikes += 1;
      existingComment.likes.push(userId);
    } else {
      // Если уже лайкал — убираем лайк
      existingComment.numberOfLikes -= 1;
      existingComment.likes.splice(userIndex, 1);
    }

    await existingComment.save();

    const commentWithLike = await Comment.findById(
      req.params.commentId
    ).populate("author", "username profilePicture");

    return res.status(200).json(commentWithLike);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const existingComment = await Comment.findById(req.params.commentId);

    if (!existingComment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (
      existingComment.author.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment!")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      }
    );

    const comment = await Comment.findById(req.params.commentId).populate(
      "author",
      "username profilePicture"
    );
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const existingComment = await Comment.findById(req.params.commentId);

    if (!existingComment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (
      existingComment.author.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment!")
      );
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("The comment was successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all comments!"));
  }

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  try {
    const comments = await Comment.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ updatedAt: sortDirection })
      .populate("author", "username")
      .populate("post", "title slug");

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    const totalComments = await Comment.countDocuments();
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
