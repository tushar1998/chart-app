import { axiosInstance } from "@/lib/axios";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./use-auth";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useAxiosInstance = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const instance = useMemo(() => axiosInstance, []);

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (response) => response, // Handle successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          Cookies.remove("filter");
          setAccessToken("");

          toast.error("Session expired, please login again");

          navigate("/auth/login");
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return instance;
};
