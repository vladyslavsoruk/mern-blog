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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      errorHandler(409, "User with this email already exists. Please sign in")
    );
  }

  try {
    const user = await User.create({
      username,
      email,
      password: bcryptjs.hashSync(password, 10),
    });
    await user.save();

    const { password: pass, ...userWithoutPassword } = user._doc;

    res.status(201).json(userWithoutPassword);
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
        isAdmin: user.isAdmin,
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

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  if (!name || !email || !googlePhotoUrl) {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // If user does not exist, we create a new user with a generated password
      user = await User.create({
        username:
          name.toString().toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await user.save();
    }

    const { password: pass, ...userWithoutPassword } = user._doc;

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
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
