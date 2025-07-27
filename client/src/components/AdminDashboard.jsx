import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaUsers, FaComments } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { HiPlus } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [usersData, setUsersData] = useState([]);
  const [usersDataLoading, setUsersDataLoading] = useState(false);
  const [noUsers, setNoUsers] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [commentsDataLoading, setCommentsDataLoading] = useState(false);
  const [noComments, setNoComments] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const [postsDataLoading, setPostsDataLoading] = useState(false);
  const [noPosts, setNoPosts] = useState(false);

  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: "users",
      title: "Total Users",
      value: usersData.totalUsers,
      change: usersData.lastMonthUsers,
      icon: FaUsers,
    },
    {
      id: "comments",
      title: "Total Comments",
      value: commentsData.totalComments,
      change: commentsData.lastMonthComments,
      icon: FaComments,
    },
    {
      id: "posts",
      title: "Total Posts",
      value: postsData.totalPosts,
      change: postsData.lastMonthPosts,
      icon: HiDocumentText,
    },
  ];

  useEffect(() => {
    if (!currentUser.isAdmin) {
      navigate("/dashboard?tab=profile");
      return;
    }
    const fetchData = async () => {
      try {
        setUsersDataLoading(true);
        setCommentsDataLoading(true);
        setPostsDataLoading(true);

        const usersResponse = await fetch("/api/user/get?limit=5");
        const uData = await usersResponse.json();

        if (usersResponse.ok) {
          setUsersData(uData);
          setUsersDataLoading(false);
          if (uData.users.length === 0) {
            setNoUsers(true);
          }
        } else {
          setUsersDataLoading(false);
          console.error("Something went wrong while fetching users data");
        }

        const commentsResponse = await fetch("/api/comment/get?limit=5");
        const cData = await commentsResponse.json();

        if (commentsResponse.ok) {
          setCommentsData(cData);
          setCommentsDataLoading(false);
          if (cData.comments.length === 0) {
            setNoComments(true);
          }
        } else {
          setCommentsDataLoading(false);
          console.error("Something went wrong while fetching comments data");
        }

        const postsResponse = await fetch("/api/post/get?limit=5");
        const pData = await postsResponse.json();

        if (postsResponse.ok) {
          setPostsData(pData);
          setPostsDataLoading(false);
          if (pData.posts.length === 0) {
            setNoPosts(true);
          }
        } else {
          setPostsDataLoading(false);
          console.error("Something went wrong while fetching posts data");
        }
      } catch (error) {
        setUsersDataLoading(false);
        setCommentsDataLoading(false);
        setPostsDataLoading(false);
        console.error(error.message);
      }
    };

    fetchData();
  }, [currentUser._id]);

  const renderUsersTable = () => {
    return (
      <div className="table-auto p-3 shadow-md dark:bg-slate-800 rounded-md w-full md:w-auto min-w-[300px]">
        <div
          className={`flex ${
            usersData?.totalUsers > 0 ? "justify-between" : "justify-center"
          } items-center mb-2`}
        >
          <h2 className="font-semibold">Recent users</h2>
          {currentUser.isAdmin && usersData?.totalUsers > 0 && (
            <Link to="/dashboard?tab=users">
              <Button color={"green"}>See all</Button>
            </Link>
          )}
        </div>
        {currentUser.isAdmin && usersData?.totalUsers > 0 && (
          <>
            <Table hoverable className="shadow-md">
              <TableHead>
                <TableHeadCell>User image</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {usersData.users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex justify-center items-center w-8 h-8">
                        <img
                          src={user.profilePicture}
                          alt="user-profile-picture"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
        {usersDataLoading && (
          <div className="flex justify-center items-center mt-3">
            <Spinner size="md" />
            <span className="ml-2">Loading...</span>
          </div>
        )}
        {noUsers && (
          <p className="text-center text-red-400 mt-3">No users yet...</p>
        )}
      </div>
    );
  };

  const renderCommentsTable = () => {
    return (
      <div className="table-auto p-3 shadow-md dark:bg-slate-800 rounded-md w-full md:w-auto md:max-w-xl min-w-[300px]">
        <div
          className={`flex ${
            commentsData?.totalComments > 0
              ? "justify-between"
              : "justify-center"
          } items-center mb-2`}
        >
          <h2 className="font-semibold">Recent comments</h2>
          {currentUser.isAdmin && commentsData?.totalComments > 0 && (
            <Link to="/dashboard?tab=comments">
              <Button color={"green"}>See all</Button>
            </Link>
          )}
        </div>
        {currentUser.isAdmin && commentsData?.totalComments > 0 && (
          <>
            <Table hoverable className="shadow-md">
              <TableHead>
                <TableHeadCell>Comment content</TableHeadCell>
                <TableHeadCell>Likes</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {commentsData.comments.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="max-w-96">
                      <p className="line-clamp-2">{c.content}</p>
                    </TableCell>
                    <TableCell>{c.numberOfLikes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
        {commentsDataLoading && (
          <div className="flex justify-center items-center mt-3">
            <Spinner size="md" />
            <span className="ml-2">Loading...</span>
          </div>
        )}
        {noComments && (
          <p className="text-center mt-3 text-red-400">No comments yet...</p>
        )}
      </div>
    );
  };

  const renderPostsTable = () => {
    return (
      <div className="table-auto p-3 shadow-md dark:bg-slate-800 rounded-md w-full md:w-auto min-w-[300px]">
        <div
          className={`flex ${
            postsData?.totalPosts > 0 ? "justify-between" : "justify-center"
          } items-center mb-2`}
        >
          <h2 className="font-semibold">Recent posts</h2>
          {currentUser.isAdmin && postsData?.totalPosts > 0 && (
            <Link to="/dashboard?tab=posts">
              <Button color={"green"}>See all</Button>
            </Link>
          )}
        </div>
        {currentUser.isAdmin && postsData?.totalPosts > 0 && (
          <>
            <Table hoverable className="shadow-md">
              <TableHead>
                <TableHeadCell>Post image</TableHeadCell>
                <TableHeadCell className="max-w-96">Post title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {postsData.posts.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      <Link to={`/post/${p.slug}`}>
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-20 h-12 object-contain bg-gray-500 hover:opacity-80 rounded"
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/post/${p.slug}`}>
                        <span className="hover:underline">{p.title}</span>
                      </Link>
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
        {postsDataLoading && (
          <div className="flex justify-center items-center mt-3">
            <Spinner size="md" />
            <span className="ml-2">Loading...</span>
          </div>
        )}
        {noPosts && (
          <p className="text-center text-red-400 mt-3">No posts yet...</p>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto p-3 max-w-[1200px]">
      {/* SMALL CARDS with info FOR ADMIN */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            className="flex w-full shadow-md p-3 rounded-md justify-between min-w-[300px] min-h-[126px] sm:max-w-[300px] dark:bg-slate-800"
          >
            <div className="flex flex-col gap-2 text-xl">
              <span className="text-gray-500 dark:text-gray-400">
                {card.title}
              </span>

              {card.id === "users" && usersDataLoading && <Spinner size="sm" />}

              {card.id === "comments" && commentsDataLoading && (
                <Spinner size="sm" />
              )}

              {card.id === "posts" && postsDataLoading && <Spinner size="sm" />}

              <span className="font-semibold text-lg mb-3">{card.value}</span>

              <p className="flex items-center gap-1 text-green-500 text-sm">
                {card.id === "users" && usersData.lastMonthUsers > 0 && (
                  <HiPlus className="text-lg" />
                )}
                {card.id === "comments" &&
                  commentsData.lastMonthComments > 0 && (
                    <HiPlus className="text-lg" />
                  )}
                {card.id === "posts" && postsData.lastMonthPosts > 0 && (
                  <HiPlus className="text-lg" />
                )}
                {card.id === "users" && usersDataLoading && (
                  <Spinner size="xs" />
                )}
                {card.id === "comments" && commentsDataLoading && (
                  <Spinner size="xs" />
                )}
                {card.id === "posts" && postsDataLoading && (
                  <Spinner size="xs" />
                )}
                <span className="mr-1">{card.change}</span>
                <span className="text-gray-500">in the last month</span>
              </p>
            </div>
            <div
              className={`${
                card.id === "users"
                  ? "bg-teal-500"
                  : card.id === "comments"
                  ? "bg-green-500"
                  : "bg-blue-500"
              } w-12 h-12 flex items-center justify-center rounded-full`}
            >
              {card.icon({ className: "text-2xl text-white" })}
              {/* <FaUsers className="text-xl text-white dark:text-black" /> */}
            </div>
          </div>
        ))}
      </div>

      {/* Tables with data for admin */}
      <div className="flex flex-wrap gap-6 justify-center my-6">
        {renderUsersTable()}
        {renderCommentsTable()}
        {renderPostsTable()}
      </div>
    </div>
  );
}

export default AdminDashboard;
