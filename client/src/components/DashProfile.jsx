import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  TextInput,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { set } from "mongoose";
import { Link } from "react-router-dom";

function DashProfile() {
  const {
    user: currentUser,
    error,
    loading,
  } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const filePickerReference = useRef(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      handleUpload();
    }
  }, [imageFile]);

  const handleUpload = async () => {
    if (!imageFile) return;
    const cloudUrl = `${import.meta.env.VITE_CLOUDINARY_URL}`;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`
    );

    try {
      const res = await fetch(cloudUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setImageFileUploadError(
          "Something went wrong while uploading the image"
        );
      }
      setImageFileUrl(data.secure_url);
      setImageFileUploadError(null);
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: data.secure_url,
      }));
    } catch (error) {
      setImageFileUploadError("Something went wrong while uploading the image");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserUpdateSuccess(null);
    setUserUpdateError(null);

    if (Object.keys(formData).length === 0) {
      setUserUpdateError("No changes made to update");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(updateFailure(data.error || "Failed to update profile"));
        setUserUpdateError(data.error || "Failed to update profile");
        return;
      }

      dispatch(updateSuccess(data));
      setUserUpdateSuccess("Profile was successfully updated!");
      setFormData({});
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUserUpdateError(
        error.message || "Something went wrong while updating the profile"
      );
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
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

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });
      if (!response.ok) {
        setUserUpdateError("Failed to logout");
        return new Error("Failed to logout");
      }
      dispatch(signOutSuccess()); // Clear user state on logout
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerReference}
          hidden
        />
        <div
          className="cursor-pointer w-32 h-32 mb-4 self-center shadow-lg rounded-full overflow-hidden"
          onClick={() => filePickerReference.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user-image"
            className=" rounded-full w-full h-full object-cover border-4 border-[lightgrey]"
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="ml-2">Loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button type="button" color="green" className="w-full">
              Create a post
            </Button>
          </Link>
        )}
      </form>

      {userUpdateError && (
        <Alert color="failure" className="mt-4">
          {userUpdateError}
        </Alert>
      )}
      {userUpdateSuccess && (
        <Alert color="success" className="mt-4">
          {userUpdateSuccess}
        </Alert>
      )}
      {/* {error && (
        <Alert color="failure" className="mt-4">
          {error}
        </Alert>
      )} */}

      <div className="flex justify-between mt-4 text-red-500">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleLogout}>
          Logout
        </span>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <FaExclamationCircle className="text-6xl mb-4 mx-auto text-red-500" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-between">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="light" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default DashProfile;
