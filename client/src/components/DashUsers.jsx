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
import { RxCrossCircled } from "react-icons/rx";

function DashUsers() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [usersData, setUsersData] = useState([]);
  const [noUsers, setNoUsers] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDeleteData, setUserToDeleteData] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/user/get`);
        if (!response.ok) {
          throw new Error("Something went wrong while fetching users");
        }
        const data = await response.json();

        if (data.users.length === 0) {
          setNoUsers(true);
        }

        if (data.totalUsers <= 9) {
          setShowMoreBtn(false);
        }

        setUsersData(data.users);
      } catch (error) {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
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
      const response = await fetch(`/api/user/get?startIndex=${startIndex}`);
      if (!response.ok) {
        throw new Error("Something went wrong while fetching users");
      }
      const data = await response.json();
      if (data.users.length < 9) {
        setShowMoreBtn(false);
      }

      setUsersData((prevUsers) => [...prevUsers, ...data.users]);

      if (data.totalUsers === usersData.length) {
        setShowMoreBtn(false);
      }
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `/api/user/delete/${userToDeleteData.id}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      setShowDeleteModal(false);
      if (response.ok) {
        setUsersData((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDeleteData.id)
        );

        setShowDeleteSuccess(true);

        setTimeout(() => {
          setShowDeleteSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error(
        "Something went wrong while deleting the user:",
        error.message
      );
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
      {currentUser.isAdmin && usersData.length > 0 ? (
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
                    <div className="flex justify-center items-center w-15 h-15">
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
      {noUsers && (
        <p className="text-center font-semibold mt-3">No users yet...</p>
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
              Are you sure you want to delete the user{" "}
              <span className="font-semibold">
                «{userToDeleteData?.username}»
              </span>{" "}
              ?
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
      {showDeleteSuccess && (
        <div className="flex gap-2 px-4 py-3 items-center fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white  rounded shadow-lg transition-opacity duration-500 animate-fade-in-out z-50">
          <FaCheckCircle className="text-xl " />
          <span>User was successfully deleted!</span>
        </div>
      )}
    </div>
  );
}

export default DashUsers;
