import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("❌ Ошибка подключения:", err));

const __dirname = path.resolve();

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

// собранные бандлы (HTML, JS, CSS, картинки и т.д.)
// будут доступными, и приложение фронтенда сможет
// подгрузить все свои ресурсы
app.use(express.static(path.join(__dirname, "/client/dist")));

// Любой запрос (за исключением тех, что попали под express.static
// или другие серверные app.get("/api/…")) будет пойман этим
// app.get("*", …) и всегда отдаст один и тот же index.html.
// То есть приложение на стороне клиента сможет обрабатывать URL
// самостоятельно с помощью react-router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const error = err.message || "Internal Server Error";
  res.status(statusCode).json({ error });
});
