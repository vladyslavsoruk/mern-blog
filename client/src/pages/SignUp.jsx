import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.username || !userData.email || !userData.password) {
      setErrorMessage("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (data.error) {
        setLoading(false);
        return setErrorMessage(data.error);
      }

      setLoading(false);

      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
                <Label htmlFor="username">Your username</Label>
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="Name Surname"
                required
                onChange={handleChange}
              />
            </div>
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
                "Sign up"
              )}
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign in
            </Link>
          </div>
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

export default SignUp;
