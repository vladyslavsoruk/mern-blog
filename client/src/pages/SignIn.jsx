import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

function SignIn() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const [userData, setUserData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      // setErrorMessage("All fields are required!");
      return dispatch(signInFailure("All fields are required!"));
    }

    try {
      dispatch(signInStart());

      // setLoading(true);
      // setErrorMessage(null);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (data.error) {
        dispatch(signInFailure(data.error));
        // setLoading(false);
        return dispatch(signInFailure(data.error));

        // return setErrorMessage(data.error);
      }

      if (res.ok) {
        dispatch(signInSuccess(data));

        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));

      // setErrorMessage(error.message);
      // setLoading(false);
    }
  };
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value.trim() });
  };

  return (
    <div className="min-h-[calc(100vh-62px)] w-full flex items-center justify-center">
      <div className="flex w-full p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* LEFT side */}
        <div className="flex-1">
          <Link
            to="/"
            className="whitespace-nowrap text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 text-4xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-lg text-white">
              Vlad's
            </span>
            &nbsp; Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project for a blog application
          </p>
        </div>
        {/* RIGHT side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Your email</Label>
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@gmail.com"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Your password</Label>
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="123456"
                required
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  &nbsp; <span>Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {errorMessage && (
            <Alert color="failure" className="mt-5">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
