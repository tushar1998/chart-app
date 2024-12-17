import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./hooks/use-auth";
import Cookies from "js-cookie";

export default function SiteHeader() {
  const navigate = useNavigate();

  const { setAccessToken } = useAuth();

  const handleLogout = () => {
    setAccessToken("");
    Cookies.remove("filter");

    toast.success("Logout successful");
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <div className="mx-auto flex h-12 w-full items-center justify-normal border-b px-2 sm:h-14 sm:justify-between md:px-8">
        <div className="flex items-center w-full">
          <div className="items-center space-x-2 flex">
            <Icons.hexagon className="size-6" />
            <span className="">Chart App</span>
          </div>
        </div>

        <div className="flex w-full items-center justify-end sm:w-auto">
          <a
            href="https://github.com/Tushar1998"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                size: "icon",
                variant: "ghost",
              })
            )}
          >
            <Icons.github size={18} />
            <span className="sr-only">GitHub</span>
          </a>
          <Button size="icon" variant="ghost" onClick={handleLogout}>
            <Icons.logout size={18} />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
