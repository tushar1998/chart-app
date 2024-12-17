import { Outlet, useNavigate } from "react-router-dom";
import SiteHeader from "./site-header";
import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";
import { searchParams } from "@/lib/utils";

export default function App() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  console.log({ isAuthenticated });

  const params = searchParams() as unknown as { filter: string };

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("not authenticated, redirecting", params?.filter);
      navigate("/auth/login", { state: params?.filter });

      return;
    }

    if (isAuthenticated) {
      navigate("/dashboard", { state: params?.filter });
    }
  }, [isAuthenticated]);

  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}
