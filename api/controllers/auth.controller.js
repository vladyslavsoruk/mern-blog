import { errorHandler } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Invalid credentials!"));
    }
    const isValidPassword = bcryptjs.compareSync(password, user.password);
    if (!isValidPassword) {
      return next(errorHandler(401, "Invalid credentials!"));
    }

    const { password: pass, ...userWithoutPassword } = user._doc;

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d", algorithm: "HS256" }
    );

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
