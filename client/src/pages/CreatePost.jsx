import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { RxCross2 } from "react-icons/rx";
import { lazy, Suspense, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
// ленивая загрузка редактора
const ReactQuill = lazy(() => import("react-quill"));

function CreatePost() {
  const [contentValue, setContentValue] = useState("");
  const [formData, setFormData] = useState({});
  const filePickerReference = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileLoading, setImageFileLoading] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadSuccess, setImageFileUploadSuccess] = useState(null);
  const [postCreationSuccess, setPostCreationSuccess] = useState(null);
  const [postCreationError, setPostCreationError] = useState(null);
  const [postSLug, setPostSlug] = useState(null);
  const [postDataLoading, setPostDataLoading] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadSuccess(null);
      setImageFileUploadError(null);
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    console.log(formData);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setImageFileUploadError("No image for post selected");
      return;
    }

    setImageFileLoading(true);
    setImageFileUploadError(null);
    setImageFileUploadSuccess(null);

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
      setImageFileUploadSuccess("Image uploaded successfully!");
      setImageFile(null); // Clear the file input after upload
      setFormData((prevData) => ({
        ...prevData,
        image: data.secure_url,
      }));
    } catch (error) {
      setImageFileUploadError("Something went wrong while uploading the image");
    } finally {
      setImageFileLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPostDataLoading(true);
    setPostCreationSuccess(null);
    setPostCreationError(null);

    const postData = {
      ...formData,
    };

    if (contentValue) {
      postData.content = contentValue;
    }

    if (
      !Object.keys(postData).includes("title") ||
      !Object.keys(postData).includes("content")
    ) {
      setPostCreationError("Not enough data to create a post");
      setPostDataLoading(false);
      return;
    }

    try {
      // dispatch(updateStart());
      const response = await fetch(`/api/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        // dispatch(updateFailure(data.error || "Failed to update profile"));
        setPostCreationError(data.error || "Failed to create a post");
        setPostDataLoading(false);
        return;
      }

      // dispatch(updateSuccess(data));
      setPostCreationSuccess("The post was successfully created!");
      setPostSlug(data.slug);
      setPostDataLoading(false);

      // setFormData({});
    } catch (error) {
      // dispatch(updateFailure(error.message));
      setPostDataLoading(false);
      setPostCreationError(
        error.message || "Something went wrong while creating the post"
      );
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-[calc(100vh-62px)]">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={handleFormChange}
          />
          <Select id="category" onChange={handleFormChange}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">javascript</option>
            <option value="react">React</option>
            <option value="angular">Angular</option>
            <option value="vue">Vue.js</option>
            <option value="next">Next.js</option>
            <option value="node">Node.js</option>
            <option value="express">Express</option>
            <option value="nest">Nest</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </Select>
        </div>
        <div className="border-4 border-teal-500 border-dotted p-3">
          <div className="flex gap-4 justify-between items-center">
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerReference}
            />
            {!imageFileUploadSuccess && (
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={imageFileLoading}
              >
                {imageFileLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  "Upload image"
                )}
              </Button>
            )}
          </div>

          {imageFileUrl && (
            <Alert
              color="info"
              className="mt-4 overflow-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500"
            >
              <div className="flex gap-4 justify-between items-center">
                <span className="font-medium">
                  {imageFileUploadSuccess
                    ? "Image uploaded:"
                    : "Image selected:"}
                </span>
                <img src={imageFileUrl} alt="postImage" className="h-48" />

                {!imageFileUploadSuccess && (
                  <Button
                    color={"red"}
                    className="text-sm"
                    onClick={() => {
                      setImageFile(null);
                      setImageFileUrl(null);
                      filePickerReference.current.value = null; // Clear the file input
                      setImageFileUploadSuccess(null);
                      setImageFileUploadError(null);
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-[150px]">
                      <RxCross2 className="text-2xl" />
                      <span>Remove selected image</span>
                    </div>
                  </Button>
                )}
              </div>
            </Alert>
          )}
          {imageFileUploadError && (
            <Alert color="failure" className="mt-4">
              {imageFileUploadError}
            </Alert>
          )}
          {imageFileUploadSuccess && (
            <Alert color="success" className="mt-4">
              {imageFileUploadSuccess}
            </Alert>
          )}
        </div>
        <Suspense
          fallback={
            <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <Spinner size="xl" />
            </div>
          }
        >
          <ReactQuill
            theme="snow"
            value={contentValue}
            onChange={setContentValue}
            className="h-72 mb-12"
            placeholder="Write your post content here..."
          />
        </Suspense>
        {/* <ReactQuill
          theme="snow"
          value={contentValue}
          onChange={setContentValue}
          className="h-72 mb-12"
          required
          placeholder="Write your post content here..."
        /> */}
        <Button
          type="submit"
          color={"green"}
          className="w-full font-semibold"
          disabled={postDataLoading}
        >
          {postDataLoading ? (
            <>
              <Spinner size="sm" />
              <span className="ml-2">Loading...</span>
            </>
          ) : (
            "Publish the post"
          )}
        </Button>
      </form>

      {postCreationError && (
        <Alert color="failure" className="mt-4">
          {postCreationError}
        </Alert>
      )}
      {postCreationSuccess && (
        <Alert color="success" className="mt-4">
          {postCreationSuccess}
          <Link
            to={`/post/${postSLug}`}
            className="ml-2 text-blue-500 hover:underline"
          >
            Go to the post page
          </Link>
        </Alert>
      )}
    </div>
  );
}

export default CreatePost;
