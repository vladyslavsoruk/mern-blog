import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Many-to-One relationship with User
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "uncategorized",
      enum: [
        "uncategorized",
        "javascript",
        "react",
        "angular",
        "vue",
        "next",
        "node",
        "express",
        "nest",
        "java",
        "python",
      ],
    },
    image: {
      type: String,
      default:
        "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
