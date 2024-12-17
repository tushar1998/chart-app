import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "./ui/form";
import { Input } from "./common/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AuthStore, useAuth } from "./hooks/use-auth";
import { AxiosError } from "axios";
import { useEffect } from "react";

interface SignInFormSchema {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setAccessToken, isAuthenticated } = useAuth();

  const methods = useForm<SignInFormSchema>({
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation<
    Pick<AuthStore, "access_token">,
    Error | AxiosError<Error>,
    SignInFormSchema
  >({
    mutationKey: ["login"],
    mutationFn: async (variables) => {
      const res = await axiosInstance.post("/auth/login", variables);
      return res.data;
    },

    onSuccess: (data) => {
      setAccessToken(data.access_token);
      toast.success("Login successful");
      navigate("/dashboard");

      return;
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);

        return;
      }

      toast.error(error.message);
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit: SubmitHandler<SignInFormSchema> = async ({ email, password }) => {
    try {
      mutate({ email, password });
    } catch (error) {
      toast.error(`Something went wrong, user login failed ${JSON.stringify(error)}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { state: location.state });
    }
  }, [isAuthenticated]);

  return (
    <main className="flex flex-col gap-4">
      <span>
        <h1 className="text-2xl">Welcome back,</h1>
        <p className="text-xs text-muted-foreground">Please sign in to continue.</p>
      </span>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="email"
            label="Email"
            rules={{
              required: { value: true, message: "Please enter your email" },
            }}
          >
            <Input placeholder="Enter your email" />
          </FormInput>
          <FormInput
            name="password"
            label="Password"
            rules={{
              required: { value: true, message: "Please enter your password" },
            }}
          >
            <Input placeholder="Enter your password" type="password" withShowPassword />
          </FormInput>
          <div className="w-full text-right">
            <a href="/auth/forgot-password" className="text-sm text-current hover:underline">
              Forgot Password?
            </a>
          </div>
          <Button type="submit" className="w-full" disabled={!isValid} loading={isPending}>
            Log In
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-xs">
        Don&#39;t have an account?
        <a href="/auth/signup" className="ml-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800">
          Create an account
        </a>
      </p>
    </main>
  );
}
