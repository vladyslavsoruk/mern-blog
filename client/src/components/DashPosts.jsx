import {
  Alert,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPosts() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [noPosts, setNoPosts] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/post/get?authorId=${currentUser._id}`
        );
        if (!response.ok) {
          throw new Error("Something went wrong while fetching posts");
        }
        const data = await response.json();

        if (data.posts.length === 0) {
          setNoPosts(true);
        }
        if (data.posts.length < 9) {
          setShowMoreBtn(false);
        }

        setUserPosts(data.posts);
      } catch (error) {
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
        throw new Error("Something went wrong while fetching posts");
      }
      const data = await response.json();
      if (data.posts.length < 9) {
        setShowMoreBtn(false);
      }
      setUserPosts((prevPosts) => [...prevPosts, ...data.posts]);
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date updated</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>Edit</TableHeadCell>
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
                    <button className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </TableCell>
                  <TableCell>
                    <Link to={`/update-post/${post._id}`}>
                      <button className="text-blue-500 hover:underline">
                        Edit
                      </button>
                    </Link>
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
      ) : (
        <>
          <Spinner size="sm" />
          <span className="ml-2">Loading...</span>
        </>
      )}
      {noPosts && (
        <p className="text-center font-semibold mt-3">
          You have no posts yet...
        </p>
      )}
    </div>
  );
}

export default DashPosts;
