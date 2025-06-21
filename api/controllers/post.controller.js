import { errorHandler } from "../../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create posts"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Title and content are required"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "") // удалить всё лишнее
    .replace(/-+/g, "-") // подряд идущие дефисы → один
    .replace(/^-+|-+$/g, ""); // убрать дефисы в начале/конце

  try {
    const newPost = await Post.create({
      ...req.body,
      slug,
      author: req.user.id,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};
