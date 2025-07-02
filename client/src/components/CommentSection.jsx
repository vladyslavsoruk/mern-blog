import { Alert, Button, FooterDivider, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { set } from "mongoose";
import { FaCheckCircle } from "react-icons/fa";

function CommentSection({ postId }) {
  const { user: currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState(null);
  const [postTotalComments, setPostTotalComments] = useState(0);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [showDeleteCommentSuccess, setShowDeleteCommentSuccess] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/comment/get/${postId}`);
        const data = await response.json();
        if (response.ok) {
          if (data.totalPostComments <= 6) {
            setShowMoreBtn(false);
          }

          setPostComments(data.comments);
          setPostTotalComments(data.totalPostComments);
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

      if (response.ok) {
        setComment("");
        setCommentError(null);
        setPostComments((prevComments) => [data, ...prevComments]);
        setPostTotalComments((prevTotalComments) => prevTotalComments + 1);
      } else {
        setCommentError("Something went wrong while creating the comment");
      }
    } catch (error) {
      setCommentError("Something went wrong while creating the comment");
      console.error("Error creating comment:", error.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await fetch(`/api/comment/like/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Update the postComments state because like was added/removed
        setPostComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === commentId) {
              return data;
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error.message);
    }
  };

  const handleShowMoreBtn = async () => {
    const startIndex = postComments.length;

    try {
      const response = await fetch(
        `/api/comment/get/${postId}?startIndex=${startIndex}`
      );

      if (!response.ok) {
        console.error("Something went wrong while fetching comments");
        return;
      }

      const data = await response.json();
      if (data.comments.length < 6) {
        setShowMoreBtn(false);
      }

      setPostComments((prevComments) => {
        const updatedComments = [...prevComments, ...data.comments];

        if (updatedComments.length === data.totalPostComments) {
          setShowMoreBtn(false);
        }

        return updatedComments;
      });
    } catch (error) {
      console.error(
        "There was a problem with the fetch comments operation:",
        error.message
      );
    }
  };

  const handleDeleteComment = (commentId) => {
    setPostComments((prev) => prev.filter((c) => c._id !== commentId));
    setPostTotalComments((prev) => prev - 1);
    setShowDeleteCommentSuccess(true);
    setTimeout(() => {
      setShowDeleteCommentSuccess(false);
    }, 3000);
  };

  const handleEditComment = (commentId, newContent) => {
    setPostComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          return {
            ...c,
            content: newContent,
          };
        }
        return c;
      })
    );
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
        <h1 className="flex gap-2 text-xl font-semibold">
          <span>Comments</span>
          <span className="border border-gray-400 rounded-md px-2 py-1 text-sm ml-1">
            {postTotalComments}
          </span>
        </h1>
        <hr className="h-[1px] bg-gray-300 border-0 my-3" />

        {postComments && postComments.length > 0 ? (
          postComments.map((comment) => (
            <Comment
              key={comment._id}
              commentData={comment}
              onLike={handleLike}
              isCommentLikedByUser={comment?.likes?.includes(currentUser?._id)}
              handleDeleteComment={handleDeleteComment}
              handleEditComment={handleEditComment}
            />
          ))
        ) : (
          <p className="text-red-400 mt-2 text-sm">No comments yet...</p>
        )}

        {showMoreBtn && (
          <Button className="mt-3 mx-auto" onClick={handleShowMoreBtn}>
            Show more...
          </Button>
        )}

        {showDeleteCommentSuccess && (
          <div className="flex gap-2 px-4 py-3 items-center fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white  rounded shadow-lg transition-opacity duration-500 animate-fade-in-out z-50">
            <FaCheckCircle className="text-xl " />
            <span>Comment was successfully deleted!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
