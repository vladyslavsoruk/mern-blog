import { Alert, Button, FooterDivider, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

function CommentSection({ postId }) {
  const { user: currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/comment/get/${postId}`);
        const data = await response.json();
        if (response.ok) {
          setPostComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    }
    fetchData();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      setCommentError("Please write a comment");
      return;
    }
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

      console.log("DATA after handle submit", data);

      if (response.ok) {
        setComment("");
        setCommentError(null);
        setPostComments((prevComments) => [data, ...prevComments]);
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
              minLength={3}
              maxLength={200}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="resize-none"
            />
            <p className="text-gray-400 text-xs mt-2">
              {200 - comment.length} characters remaining
            </p>
          </div>
          <Button color={"teal"} type="submit" className="self-center">
            Submit
          </Button>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      <div className="mt-5 border border-teal-500 rounded-md p-3">
        <h1 className="text-xl font-semibold">
          Comments{" "}
          <span className="border border-gray-400 rounded-md px-2 py-1 text-sm ml-1">
            {postComments?.length}
          </span>
        </h1>
        <hr className="h-[1px] bg-gray-300 border-0 my-3" />

        {postComments && postComments.length > 0 ? (
          postComments.map((comment) => (
            <Comment key={comment._id} commentData={comment} />
          ))
        ) : (
          <p className="text-red-400 mt-2 text-sm">No comments yet...</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
