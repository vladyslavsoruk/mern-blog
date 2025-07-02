import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const commentRouter = express.Router();
commentRouter.post("/create", verifyToken, createComment);
commentRouter.get("/get/:postId", getPostComments);
commentRouter.put("/like/:commentId", verifyToken, likeComment);
commentRouter.put("/edit/:commentId", verifyToken, editComment);
commentRouter.delete("/:commentId", verifyToken, deleteComment);

export default commentRouter;
