import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("❌ Ошибка подключения:", err));

// Создаем простую модель
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("user", userSchema);

app.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const user = await new User({
      name: req.body.name,
      email: req.body.email,
    });
    // const user = new User(req.body);
    res.status(201).send("User was successfully created !");
    await user.save();
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.save();
    res
      .status(200)
      .send(`User with id ${req.params.id} was successfully updated !`);
  } catch (error) {
    res.status(404).send(`User with id ${req.params.id} was not found !`);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      // Проверяем, существует ли пользователь
      return res
        .status(404)
        .send(`User with id ${req.params.id} was not found!`);
    }

    await User.deleteOne({ _id: user.id });
    res
      .status(200)
      .send(`User with id ${req.params.id} was successfully deleted !`);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});
