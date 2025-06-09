import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
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
    res.status(500).json({ message: error.message });
  }
};
