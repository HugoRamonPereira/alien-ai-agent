import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { NavigationContext } from "@/lib/NavigationProvider";
import { use } from "react";

const Header = () => {
  const { isMobileNavOpen, setIsMobileNavOpen, closeMobileNav } =
    use(NavigationContext);

  return (
    <div className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
          >
            <HamburgerMenuIcon className="w-5 h-5" />
          </Button>
          <div className="font-semibold">Chat with Alien AI Agent</div>
        </div>
        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-8 h-8 ring-2 ring-gray-200/50 ring-offset-2 rounded-full transition-shadow hover:ring-gray-300/50",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
