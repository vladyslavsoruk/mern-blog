import express from "express";
import {
  updateUser,
  getAllUsers,
  logout,
  deleteUser,
  getOneUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.put("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);
userRouter.post("/logout", logout);
userRouter.get("/get", verifyToken, getAllUsers);
userRouter.get("/:userId", getOneUser);

export default userRouter;
