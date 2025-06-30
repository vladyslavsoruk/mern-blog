import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import { createComment } from "../controllers/comment.controller.js";

const commentRouter = express.Router();
commentRouter.post("/create", verifyToken, createComment);

export default commentRouter;
