import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

function DashProfile() {
  const { user: currentUser } = useSelector((state) => state.user);
  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="cursor-pointer w-32 h-32 mb-4 self-center shadow-lg rounded-full overflow-hidden">
          <img
            src={currentUser.profilePicture}
            alt="user-image"
            className=" rounded-full w-full h-full object-cover border-8 border-[lightgrey]"
          />
        </div>
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
      {/* Add more profile related content here */}
    </div>
  );
}

export default DashProfile;
