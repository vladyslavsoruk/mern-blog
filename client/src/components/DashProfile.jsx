import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

function DashProfile() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerReference = useRef(null);

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
    } catch (error) {
      setImageFileUploadError("Something went wrong while uploading the image");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="Password" />
        <Button type="submit">Update</Button>
      </form>
      <div className="flex justify-between mt-4 text-red-500">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Logout</span>
      </div>
    </div>
  );
}

export default DashProfile;
