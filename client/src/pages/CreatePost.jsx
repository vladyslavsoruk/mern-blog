import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  const [value, setValue] = useState("");

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-[calc(100vh-62px)]">
      <h1 className="text-center text-3xl my-7 font-semibold">CreatePost</h1>
      <form className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
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
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" />
          <Button type="button">Upload image</Button>
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="h-72 mb-12"
          required
          placeholder="Write your post content here..."
        />
        <Button type="submit" color={"green"} className="w-full">
          Publish Post
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
