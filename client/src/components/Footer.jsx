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
              </span>
              &nbsp; Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="About" />
              <FooterLinkGroup col>
                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  About Us
                </FooterLink>
                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Contact Us
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow us" />
              <FooterLinkGroup col>
                <FooterLink
                  href="https://github.com/vladyslavsoruk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </FooterLink>
                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Telegram
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col>
                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </FooterLink>
                <FooterLink href="#" target="_blank" rel="noopener noreferrer">
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
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsGithub} />
            <FooterIcon href="#" icon={BsLinkedin} />
            <FooterIcon href="#" icon={BsTwitter} />
            <FooterIcon href="#" icon={BsInstagram} />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterComponent;
