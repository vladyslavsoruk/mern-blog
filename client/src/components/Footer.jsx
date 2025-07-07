import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsGithub,
  BsLinkedin,
  BsTwitter,
  BsInstagram,
  BsTelegram,
} from "react-icons/bs";

function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full mx-auto max-w-7xl">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-4">
            <Link
              to="/"
              className="whitespace-nowrap text-lg font-bold dark:text-white "
            >
              <span className="px-2 py-1 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-lg text-white">
                Vlad's
              </span>{" "}
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="About" className="text-gray-800" />
              <FooterLinkGroup col>
                <FooterLink as={"div"} className="dark:text-gray-400">
                  <Link to="/about">About Us</Link>
                </FooterLink>
                <FooterLink
                  href="https://t.me/vladsoruk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-gray-400"
                >
                  Contact Us
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow us" className="text-gray-800" />
              <FooterLinkGroup col>
                <FooterLink
                  href="https://github.com/vladyslavsoruk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-gray-400"
                >
                  Github
                </FooterLink>
                <FooterLink
                  href="https://t.me/vladsoruk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-gray-400"
                >
                  Telegram
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" className="text-gray-800" />
              <FooterLinkGroup col>
                <FooterLink
                  href="https://t.me/vladsoruk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-gray-400"
                >
                  Privacy Policy
                </FooterLink>
                <FooterLink
                  href="https://t.me/vladsoruk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-gray-400"
                >
                  Terms & Conditions
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>

        <FooterDivider />

        <div className="flex flex-col gap-4 items-center justify-between md:flex-row">
          <FooterCopyright
            href="#"
            by="Vladyslav Soruk"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-4">
            <FooterIcon
              href="https://t.me/vladsoruk"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsFacebook}
              className="hover:text-cyan-600 transition-all duration-300"
            />
            <FooterIcon
              href="https://github.com/vladyslavsoruk"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsGithub}
              className="hover:text-cyan-600 transition-all duration-300"
            />
            <FooterIcon
              href="#"
              icon={BsLinkedin}
              className="hover:text-cyan-600 transition-all duration-300"
            />
            <FooterIcon
              href="https://t.me/vladsoruk"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsTwitter}
              className="hover:text-cyan-600 transition-all duration-300"
            />
            <FooterIcon
              href="https://t.me/vladsoruk"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsInstagram}
              className="hover:text-cyan-600 transition-all duration-300"
            />
            <FooterIcon
              href="https://t.me/vladsoruk"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsTelegram}
              className="hover:text-cyan-600 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterComponent;
