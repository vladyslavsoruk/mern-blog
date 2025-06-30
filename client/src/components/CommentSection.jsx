import { Alert, Button, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CommentSection({ postId }) {
  const { user: currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    try {
      const response = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          authorId: currentUser._id,
          postId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComment("");
        setCommentError(null);
      } else {
        setCommentError("Something went wrong while creating the comment");
      }
    } catch (error) {
      setCommentError("Something went wrong while creating the comment");
      console.error("Error creating comment:", error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <Link
            to={`/dashboard?tab=profile`}
            className="flex items-center gap-1 group"
          >
            <img
              src={currentUser.profilePicture}
              alt="user-profile-picture"
              className="w-6 h-6 rounded-full object-contain transition duration-200 group-hover:brightness-75"
            />
            <span className="text-xs text-cyan-600 group-hover:underline">
              @{currentUser.username}
            </span>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm">
            Please{" "}
            <Link to="/sign-in" className="text-cyan-600 hover:underline">
              Sign In
            </Link>{" "}
            to comment on this post
          </p>
        </>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 border border-teal-500 rounded-md p-3 "
        >
          <div>
            <Textarea
              placeholder="Add a comment..."
              rows={3}
              maxLength={200}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <p className="text-gray-400 text-xs mt-2">
              {200 - comment.length} characters remaining
            </p>
          </div>
          <Button outline color={"teal"} type="submit" className="self-center">
            Submit
          </Button>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}

export default CommentSection;
