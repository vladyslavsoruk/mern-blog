import { errorHandler } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const user = await User.create({
      username,
      email,
      password: bcryptjs.hashSync(password, 10),
    });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
};
