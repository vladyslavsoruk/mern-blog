import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashComments() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [userComments, setUserComments] = useState([]);
  const [noComments, setNoComments] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [userCommentsError, setUserCommentsError] = useState(false);
  const [userCommentsLoading, setUserCommentsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser.isAdmin) {
      navigate("/dashboard?tab=profile");
      return;
    }

    const fetchComments = async () => {
      try {
        setUserCommentsLoading(true);
        const response = await fetch(`/api/comment/get`);

        if (!response.ok) {
          setUserCommentsError("Something went wrong while fetching comments");
          setUserCommentsLoading(false);
          return;
        }

        const data = await response.json();

        if (response.ok) {
          if (data.comments.length === 0) {
            setNoComments(true);
          }
          if (data.totalComments <= 9) {
            setShowMoreBtn(false);
          }

          setUserComments(data.comments);
          setUserCommentsLoading(false);
        }
      } catch (error) {
        setUserCommentsLoading(false);
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      }
    };
    // Fetch 9 first posts if the user is an admin
    fetchComments();
  }, [currentUser._id]);

  const handleShowMoreBtn = async () => {
    const startIndex = userComments.length;
    try {
      setUserCommentsLoading(true);
      const response = await fetch(`/api/comment/get?startIndex=${startIndex}`);

      if (!response.ok) {
        setUserCommentsLoading(false);
        setUserCommentsError("Something went wrong while fetching comments");
        return;
      }

      const data = await response.json();
      if (data.comments.length < 9) {
        setShowMoreBtn(false);
      }

      setUserComments((prevComments) => {
        const updatedComments = [...prevComments, ...data.comments];

        if (updatedComments.length === data.totalComments) {
          setShowMoreBtn(false);
        }

        return updatedComments;
      });

      setUserCommentsLoading(false);
    } catch (error) {
      setUserCommentsLoading(false);
      setUserCommentsError(
        `There was a problem with the fetch operation: ${error.message}`
      );
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(`/api/comment/${commentToDeleteId}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      if (response.ok) {
        setUserComments((prevComments) =>
          prevComments.filter((c) => c._id !== commentToDeleteId)
        );

        setShowDeleteSuccess(true);

        setTimeout(() => {
          setShowDeleteSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error(
        "Something went wrong while deleting the comment:",
        error.message
      );
    }
  };

  return (
    <div className="table-auto overflow-x-scroll mb-4 md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
      {currentUser.isAdmin && userComments.length > 0 && (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date updated</TableHeadCell>
              <TableHeadCell>Comment content</TableHeadCell>
              <TableHeadCell>Number of likes</TableHeadCell>
              <TableHeadCell>Post</TableHeadCell>
              <TableHeadCell>Author</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Delete</span>
              </TableHeadCell>
            </TableHead>

            <TableBody className="divide-y">
              {userComments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.content}
                    </span>
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell>
                    <Link to={`/post/${comment.post.slug}`}>
                      <span className="hover:underline font-medium text-gray-900 dark:text-white">
                        {comment.post.title}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>{comment.author.username}</TableCell>
                  <TableCell>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setCommentToDeleteId(comment._id);
                      }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {userCommentsLoading && (
        <div className="text-center my-4">
          <Spinner size="sm" />
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {!userCommentsLoading && showMoreBtn && (
        <Button className="mt-3 mx-auto" onClick={handleShowMoreBtn}>
          Show more...
        </Button>
      )}

      {noComments && (
        <p className="text-center font-semibold mt-3 text-red-500">
          There are no comments yet...
        </p>
      )}

      {userCommentsError && (
        <p className="text-center font-semibold mt-3 text-red-500">
          {userCommentsError}
        </p>
      )}

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
      {showDeleteSuccess && (
        <div className="flex gap-2 px-4 py-3 items-center fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white  rounded shadow-lg transition-opacity duration-500 animate-fade-in-out z-50">
          <FaCheckCircle className="text-xl " />
          <span>Comment was successfully deleted!</span>
        </div>
      )}
    </div>
  );
}

export default DashComments;
