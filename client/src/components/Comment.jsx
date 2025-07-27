import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Textarea,
} from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
import { useSelector } from "react-redux";

function Comment({
  commentData,
  onLike,
  isCommentLikedByUser,
  handleDeleteComment: deleteComment,
  handleEditComment: editComment,
}) {
  const { user: currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(commentData?.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmitEditing = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/comment/edit/${commentData?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEditing(false);
        // Edit comment from frontend using state of parent component
        editComment(commentData._id, editedContent);
      }
    } catch (error) {
      setIsEditing(false);
      console.error(
        "Something went wrong while editing the comment:",
        error.message
      );
    }
  };

  const handleDeleteComment = async () => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const response = await fetch(`/api/comment/${commentData?._id}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);

      if (response.ok) {
        // Delete comment from frontend using state of parent component
        deleteComment(commentData._id);
      }
    } catch (error) {
      console.error(
        "Something went wrong while deleting the comment:",
        error.message
      );
    }
  };

  return (
    <div className="flex gap-3 py-5 border-b border-b-gray-300 text-gray-500 text-sm">
      <div className="flex-shrink-0">
        <img
          src={commentData?.author.profilePicture}
          alt="user-profile-picture"
          className="w-10 h-10 rounded-full bg-gray-200 object-cover transition duration-200 hover:brightness-75"
        />
      </div>
      <div className="flex-1">
        <div className="flex text-xs gap-2 items-center mb-1">
          <span className="font-bold truncate text-cyan-600 hover:underline">
            @{commentData?.author.username}
          </span>
          <span className="text-gray-500">
            {moment(commentData?.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <form
            className="flex flex-col gap-3 mt-2"
            onSubmit={handleSubmitEditing}
          >
            <div>
              <Textarea
                rows={3}
                minLength={3}
                maxLength={200}
                onChange={(e) => setEditedContent(e.target.value)}
                value={editedContent}
                className="resize-none"
              />
              <p className="text-gray-400 text-xs mt-2">
                {200 - editedContent.length} characters remaining
              </p>
            </div>
            <div className="flex justify-between">
              <Button type="submit" color="green">
                Save
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-gray-500 mb-3">{commentData?.content}</p>
            <div
              className={`${
                currentUser?._id === commentData?.author._id ||
                currentUser?.isAdmin
                  ? "border-t dark:border-t-gray-700"
                  : ""
              } max-w-fit pt-2`}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onLike(commentData?._id)}
                    className={`transition-colors duration-300 ease-in-out ${
                      isCommentLikedByUser
                        ? "text-blue-500"
                        : "text-gray-400 hover:text-blue-500"
                    }`}
                  >
                    <IoMdThumbsUp className="text-xl" />
                  </button>
                  <span>
                    {commentData?.numberOfLikes > 0
                      ? commentData?.numberOfLikes
                      : ""}
                  </span>
                </div>
                {currentUser &&
                  (currentUser._id === commentData?.author._id ||
                    currentUser.isAdmin) && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-blue-400 transition-colors duration-300 ease-in-out hover:text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="text-red-400 transition-colors duration-300 ease-in-out hover:text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size={"lg"}
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <FaExclamationCircle className="text-6xl mb-4 mx-auto text-red-500" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this comment ?
            </h3>
            <div className="flex justify-between">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="light" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Comment;
