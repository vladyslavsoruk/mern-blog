import { errorHandler } from "../../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create posts"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Title and content are required"));
  }

  const existingPost = await Post.findOne({ title: req.body.title });
  if (existingPost) {
    return next(errorHandler(409, "Post with this title already exists"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "") // удалить всё лишнее
    .replace(/-+/g, "-") // подряд идущие дефисы → один
    .replace(/^-+|-+$/g, ""); // убрать дефисы в начале/конце

  try {
    const newPost = await Post.create({
      ...req.body,
      slug,
      author: req.user.id,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    // 1) Собираем общий фильтр из query-параметров
    const filter = {
      ...(req.query.authorId && { author: req.query.authorId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    // 2) Параллельно делаем:
    //    - запрос на посты с пагинацией
    //    - подсчёт к-ства постов которые подходят под фильтр
    //    - подсчёт постов написанных определенным админом (если есть authorId)
    //    - подсчёт постов за последний месяц
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const [posts, totalPostsAfterFilters, adminTotalPosts, lastMonthPosts] =
      await Promise.all([
        Post.find(filter)
          .sort({ updatedAt: sortDirection })
          .skip(startIndex)
          .limit(limit)
          .populate("author", "username email"),

        Post.countDocuments(filter),

        // adminTotalPosts считается только если передан authorId
        req.query.authorId
          ? Post.countDocuments({ author: req.query.authorId })
          : Promise.resolve(0),

        Post.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
      ]);

    // 3) Общий подсчёт всех существующих постов
    const totalPosts = await Post.countDocuments();

    return res.status(200).json({
      posts,
      totalPosts,
      totalPostsAfterFilters,
      adminTotalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

// export const getPosts = async (req, res, next) => {
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 9;
//     const sortDirection = req.query.sort === "asc" ? 1 : -1;

//     const posts = await Post.find({
//       ...(req.query.authorId && { author: req.query.authorId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         $or: [
//           { title: { $regex: req.query.searchTerm, $options: "i" } },
//           { content: { $regex: req.query.searchTerm, $options: "i" } },
//         ],
//       }),
//     })
//       .sort({ updatedAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit)
//       .populate("author", "username email");

//     const totalPosts = await Post.countDocuments();

//     const totalPostsAfterFilters = await Post.countDocuments({
//       ...(req.query.authorId && { author: req.query.authorId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         $or: [
//           { title: { $regex: req.query.searchTerm, $options: "i" } },
//           { content: { $regex: req.query.searchTerm, $options: "i" } },
//         ],
//       }),
//     });

//     const adminTotalPosts = await Post.countDocuments({
//       author: req.query.authorId,
//     });

//     const now = new Date();

//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );

//     const lastMonthPosts = await Post.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     res
//       .status(200)
//       .json({ posts, adminTotalPosts, totalPosts, lastMonthPosts });
//   } catch (error) {
//     next(error);
//   }
// };

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete the post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update the post"));
  }
  try {
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") // удалить всё лишнее
      .replace(/-+/g, "-") // подряд идущие дефисы → один
      .replace(/^-+|-+$/g, ""); // убрать дефисы в начале/конце

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image
            ? req.body.image
            : "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg",
          category: req.body.category,
          slug,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedPost) {
      return next(errorHandler(404, "Post not found"));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
