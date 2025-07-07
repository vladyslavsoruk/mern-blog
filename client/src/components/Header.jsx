import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useRef, useState } from "react";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const smallScreenSearchInputRef = useRef(null);
  const [smallScreenSearch, setSmallScreenSearch] = useState(false);

  const path = useLocation().pathname;

  const location = useLocation();

  const { user: currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Failed to logout");
        return;
      }
      dispatch(signOutSuccess()); // Clear user state on logout
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // когда smallScreenSearch становится true, даём фокус на TextInput
  useEffect(() => {
    if (smallScreenSearch && smallScreenSearchInputRef.current) {
      smallScreenSearchInputRef.current.focus();
    }
  }, [smallScreenSearch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSearchPosts = (e) => {
    e.preventDefault();
    setSmallScreenSearch(false);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    // if (searchTerm) {
    navigate(`/search?${searchQuery}`);
    // }
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-lg text-white">
          Vlad's
        </span>{" "}
        Blog
      </Link>

      {!smallScreenSearch && (
        <form onSubmit={handleSearchPosts} className="hidden lg:block">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      {smallScreenSearch && (
        <form
          onSubmit={handleSearchPosts}
          className="w-40 lg:hidden max-w-[400px]-order-2"
        >
          <TextInput
            type="text"
            ref={smallScreenSearchInputRef}
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // if focus on TextInput is lost, set smallScreenSearch to false
            onBlur={() => setSmallScreenSearch(false)}
          />
        </form>
      )}

      {!smallScreenSearch && (
        <Button
          className="px-3 py-1 lg:hidden cursor-pointer"
          color="light"
          pill
          onClick={() => setSmallScreenSearch(true)}
        >
          <AiOutlineSearch className="text-lg" />
        </Button>
      )}

      <div
        className={`${
          smallScreenSearch && "order-1 max-[400px]:hidden"
        } flex gap-6 md:order-2 items-center`}
      >
        <Button
          className="p-1 hidden sm:inline cursor-pointer"
          pill
          color="light"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <MdLightMode className="text-lg" /> : <FaMoon />}
        </Button>

        {currentUser && (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={currentUser.profilePicture}
                rounded={true}
                className={`cursor-pointer transition duration-200 hover:brightness-75`}
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm font-medium text-center">
                @{currentUser.username}
              </span>
              <span className="block truncate text-sm font-medium text-center">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to="/dashboard?tab=profile">
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </Dropdown>
        )}

        {!currentUser && (
          <Link to="/sign-in">
            <Button
              className={`bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer`}
            >
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle className={`cursor-pointer`} />
      </div>

      <NavbarCollapse>
        <NavbarLink active={path === "/"} as="div">
          <Link to="/">Home</Link>
        </NavbarLink>
        <NavbarLink active={path === "/about"} as="div">
          <Link to="/about">About</Link>
        </NavbarLink>
        <NavbarLink active={path === "/projects"} as="div">
          <Link to="/projects">Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Header;
