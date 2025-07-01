import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const commentRouter = express.Router();
commentRouter.post("/create", verifyToken, createComment);
commentRouter.get("/get/:postId", getPostComments);

export default commentRouter;
