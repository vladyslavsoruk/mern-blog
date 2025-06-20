import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const auth = getAuth(app);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <Button
      type="button"
      className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:bg-gradient-to-br hover:cursor-pointer focus:ring-green-300 dark:focus:ring-green-800"
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="text-2xl" />
      <span>&nbsp; Continue with Google</span>
    </Button>
  );
}

export default OAuth;
