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

function DashPosts() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [noPosts, setNoPosts] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDeleteData, setPostToDeleteData] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [userPostsError, setUserPostsError] = useState(false);
  const [userPostsLoading, setUserPostsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setUserPostsLoading(true);
        const response = await fetch(
          `/api/post/get?authorId=${currentUser._id}`
        );

        if (!response.ok) {
          setUserPostsError("Something went wrong while fetching posts");
          setUserPostsLoading(false);
          return;
        }

        const data = await response.json();

        if (response.ok) {
          if (data.posts.length === 0) {
            setNoPosts(true);
          }
          if (data.adminTotalPosts <= 9) {
            setShowMoreBtn(false);
          }

          setUserPosts(data.posts);
          setUserPostsLoading(false);
        }
      } catch (error) {
        setUserPostsLoading(false);
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      }
    };
    if (currentUser.isAdmin) {
      // Fetch 9 first posts if the user is an admin
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMoreBtn = async () => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(
        `/api/post/get?authorId=${currentUser._id}&startIndex=${startIndex}`
      );
      if (!response.ok) {
        console.error("Something went wrong while fetching posts");
        return;
      }
      const data = await response.json();
      if (data.posts.length < 9) {
        setShowMoreBtn(false);
      }

      setUserPosts((prevPosts) => {
        const updatedPosts = [...prevPosts, ...data.posts];

        if (updatedPosts.length === data.adminTotalPosts) {
          setShowMoreBtn(false);
        }

        return updatedPosts;
      });
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(
        `/api/post/delete/${postToDeleteData.id}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      setShowDeleteModal(false);
      if (response.ok) {
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postToDeleteData.id)
        );

        setShowDeleteSuccess(true);

        setTimeout(() => {
          setShowDeleteSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error(
        "Something went wrong while deleting the post:",
        error.message
      );
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
      {currentUser.isAdmin && userPosts.length > 0 && (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date updated</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Delete</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-12 object-contain bg-gray-500 hover:opacity-80 rounded"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <span className="hover:underline font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <Link to={`/update-post/${post._id}`}>
                      <button className="text-blue-500 hover:underline">
                        Edit
                      </button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setPostToDeleteData({
                          id: post._id,
                          title: post.title,
                        });
                      }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {showMoreBtn && (
            <Button className="mt-3 mx-auto" onClick={handleShowMoreBtn}>
              Show more...
            </Button>
          )}
        </>
      )}

      {userPostsLoading && (
        <div className="text-center">
          <Spinner size="sm" />
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {noPosts && (
        <p className="text-center font-semibold mt-3">
          You have no posts yet...
        </p>
      )}

      {userPostsError && (
        <p className="text-center font-semibold mt-3 text-red-500">
          {userPostsError}
        </p>
      )}

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size={"md"}
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <FaExclamationCircle className="text-6xl mb-4 mx-auto text-red-500" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete the post{" "}
              <span className="font-semibold">«{postToDeleteData?.title}»</span>{" "}
              ?
            </h3>
            <div className="flex justify-between">
              <Button color="failure" onClick={handleDeletePost}>
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
          <span>Post was successfully deleted!</span>
        </div>
      )}
    </div>
  );
}

export default DashPosts;
