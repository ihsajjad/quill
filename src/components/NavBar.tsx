import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="sticky top-0 h-14 w-full inset-x-0 z-30 border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex font-semibold z-40">
            <span>quill.</span>
          </Link>

          {/* todo: add mobile navbar */}

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Sign in
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get Started <ArrowRight className="ml-1.5 h-5 w-5 " />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default NavBar;
