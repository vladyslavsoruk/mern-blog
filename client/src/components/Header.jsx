import {
  Button,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

function Header() {
  const path = useLocation().pathname;

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-lg text-white">
          Vlad's
        </span>
        Blog
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:block"
        />
      </form>

      <Button className="px-3 py-1 lg:hidden cursor-pointer" color="light" pill>
        <AiOutlineSearch className="text-2xl text-gray-500" />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button
          className="px-4 py-1 hidden sm:inline cursor-pointer"
          color="light"
        >
          <FaMoon />
        </Button>

        <Link to="/sign-in">
          <Button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer">
            Sign In
          </Button>
        </Link>

        <NavbarToggle className="cursor-pointer" />
      </div>

      <NavbarCollapse>
        <NavbarLink active={path === "/home"} as="div">
          <Link to="/home">Home</Link>
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
