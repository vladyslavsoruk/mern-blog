import mongoose from "mongoose";
import Comment from "./comment.model.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Delete user`s comments before delete user
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getQuery());
  if (user) {
    await Comment.deleteMany({ author: user._id });
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
