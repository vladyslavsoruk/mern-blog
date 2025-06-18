import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const userRouter = express.Router();
userRouter.put("/update/:id", verifyToken, updateUser);

export default userRouter;
