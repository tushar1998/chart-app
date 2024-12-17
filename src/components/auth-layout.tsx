import { Icons } from "@/lib/icons";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <section className="flex min-h-screen flex-1 flex-col justify-between p-6">
      <div className="flex justify-between">
        <div className="flex flex-row items-center">
          <Icons.hexagon />
          <h1 className="ml-2">Chart App</h1>
        </div>
      </div>
      <div className="mx-auto w-full min-w-fit sm:w-3/5 md:w-[50%] lg:w-2/6 xl:w-1/3">
        <Outlet />
      </div>

      <footer>
        <p className="text-xs">&copy; Chart App {new Date().getFullYear()}. All rights reserved.</p>
      </footer>
    </section>
  );
}
