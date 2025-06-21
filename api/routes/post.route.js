import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import { createPost } from "../controllers/post.controller.js";

const postRouter = express.Router();
postRouter.post("/create", verifyToken, createPost);
// postRouter.post("/signin", signin);
// postRouter.post("/google", google);

export default postRouter;
