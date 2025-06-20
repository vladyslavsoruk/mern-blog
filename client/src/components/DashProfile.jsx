import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function DashProfile() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const filePickerReference = useRef(null);
  const [formData, setFormData] = useState({});

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

    console.log(formData);
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
        <Button type="submit">Update</Button>
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

      <div className="flex justify-between mt-4 text-red-500">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Logout</span>
      </div>
    </div>
  );
}

export default DashProfile;
