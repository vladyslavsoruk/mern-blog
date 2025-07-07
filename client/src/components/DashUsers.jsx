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
import { useDispatch, useSelector } from "react-redux";
import { RxCrossCircled } from "react-icons/rx";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function DashUsers() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [usersData, setUsersData] = useState([]);
  const [noUsers, setNoUsers] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDeleteData, setUserToDeleteData] = useState(null);
  const [usersError, setUsersError] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [deleteUserNotifications, setDeleteUserNotifications] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAdmin) {
      navigate("/dashboard?tab=profile");
      return;
    }

    const fetchPosts = async () => {
      try {
        setUsersLoading(true);
        const response = await fetch(`/api/user/get`);
        if (!response.ok) {
          setUsersLoading(false);
          setUsersError("Something went wrong while fetching users");
          return;
        }

        const data = await response.json();

        if (data.users.length === 0) {
          setNoUsers(true);
        }

        if (data.totalUsers <= 9) {
          setShowMoreBtn(false);
        }

        setUsersData(data.users);
        setUsersLoading(false);
      } catch (error) {
        setUsersLoading(false);
        setUsersError(
          `There was a problem with the fetch operation: ${error.message}`
        );
      }
    };
    if (currentUser.isAdmin) {
      // Fetch 9 first users
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMoreBtn = async () => {
    const startIndex = usersData.length;
    try {
      setUsersLoading(true);
      const response = await fetch(`/api/user/get?startIndex=${startIndex}`);

      if (!response.ok) {
        setUsersLoading(false);
        setUsersError("Something went wrong while fetching users");
        return;
      }

      const data = await response.json();
      if (data.users.length < 9) {
        setShowMoreBtn(false);
      }

      setUsersData((prevUsers) => {
        const updatedUsers = [...prevUsers, ...data.users];

        if (updatedUsers.length === data.totalUsers) {
          setShowMoreBtn(false);
        }

        return updatedUsers;
      });

      setUsersLoading(false);
    } catch (error) {
      setUsersLoading(false);
      setUsersError(
        `There was a problem with the fetch operation: ${error.message}`
      );
    }
  };

  const handleDeleteCurrentUser = async () => {
    setShowDeleteModal(false);
    try {
      dispatch(deleteStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteFailure(data.error || "Failed to delete profile"));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (currentUser._id === userToDeleteData.id) {
      handleDeleteCurrentUser();
      return;
    }

    try {
      const response = await fetch(`/api/user/delete/${userToDeleteData.id}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      if (response.ok) {
        setUsersData((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDeleteData.id)
        );

        setDeleteUserNotifications((prevNotifications) => [
          userToDeleteData,
          ...prevNotifications,
        ]);

        setTimeout(() => {
          setDeleteUserNotifications((prevUserToDelete) =>
            prevUserToDelete.filter((u) => u.id !== userToDeleteData.id)
          );
        }, 5000);
      }
    } catch (error) {
      console.error(
        "Something went wrong while deleting the user:",
        error.message
      );
    }
  };

  return (
    <div className="table-auto overflow-x-scroll mb-4 md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
      {currentUser.isAdmin && usersData.length > 0 && (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date created</TableHeadCell>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Delete</span>
              </TableHeadCell>
            </TableHead>

            <TableBody className="divide-y">
              {usersData.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center w-10 h-10">
                      <img
                        src={user.profilePicture}
                        alt="user-profile-picture"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <FaCheckCircle className="text-green-500 text-xl" />
                    ) : (
                      <RxCrossCircled className="text-red-500 text-xl" />
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setUserToDeleteData({
                          id: user._id,
                          username: user.username,
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
        </>
      )}

      {!usersLoading && showMoreBtn && (
        <Button className="mt-3 mx-auto" onClick={handleShowMoreBtn}>
          Show more...
        </Button>
      )}

      {usersLoading && (
        <div className="text-center my-4">
          <Spinner size="sm" />
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {usersError && (
        <p className="text-center font-semibold mt-3 text-red-500">
          {usersError}
        </p>
      )}

      {noUsers && (
        <p className="text-center font-semibold mt-3 text-red-500">
          No users yet...
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
              {userToDeleteData?.id === currentUser._id ? (
                <>
                  Are you sure you want to delete <br />
                  <span className="font-semibold">your own account</span> ?
                </>
              ) : (
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    «{userToDeleteData?.username}»
                  </span>{" "}
                  ?
                </>
              )}
            </h3>
            <div className="flex justify-between">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="light" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {deleteUserNotifications.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
          {deleteUserNotifications.map((u) => (
            <div
              key={u.id}
              className="flex gap-2 px-4 py-3 items-center bg-green-500 text-white rounded shadow-lg transition-opacity animate-fade-in-out z-50"
            >
              <FaCheckCircle className="text-xl" />
              <p>
                User <span className="font-semibold">«{u.username}»</span> was
                successfully deleted!
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashUsers;
