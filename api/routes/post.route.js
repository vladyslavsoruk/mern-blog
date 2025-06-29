import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";

const postRouter = express.Router();
postRouter.post("/create", verifyToken, createPost);
postRouter.get("/get", getPosts);
postRouter.delete("/delete/:postId/:userId", verifyToken, deletePost);
postRouter.put("/update/:postId/:userId", verifyToken, updatePost);

export default postRouter;
