import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm, Validate } from "react-hook-form";
import { FormInput } from "./ui/form";
import { Input } from "./common/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";

interface SignUpFormSchema {
  email: string;
  password: string;
  confirm_password: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (variables: Partial<SignUpFormSchema>) => {
      const res = await axiosInstance.post("/auth/register", variables);
      return res;
    },

    onSuccess: () => {
      toast.success("Registration successful");
      navigate("/auth/login");
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error("Something went wrong, user registration failed");
      return;
    },
  });

  const methods = useForm<SignUpFormSchema>({
    defaultValues: { email: "", password: "", confirm_password: "" },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const validateConfirmPassword: Validate<string, SignUpFormSchema> = (val: string, formVal: SignUpFormSchema) => {
    if (val !== formVal.password) {
      return "Password does not match";
    }

    return true;
  };

  const onSubmit: SubmitHandler<SignUpFormSchema> = ({ email, password }) => {
    mutate({ email, password });
  };

  const onError: SubmitErrorHandler<SignUpFormSchema> = (errror) => {
    toast.error(`Something went wrong, ${JSON.stringify(errror)}`);
  };

  return (
    <main className="flex flex-col gap-4">
      <span>
        <h1 className="text-2xl">Welcome</h1>
        <p className="text-xs text-muted-foreground">Let&#39;s create your account</p>
      </span>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <FormInput
            label="Email"
            name="email"
            rules={{
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                message: "Invalid email address",
              },
            }}
            withAsterisk
          >
            <Input placeholder="Enter your email" />
          </FormInput>

          <FormInput
            label="Password"
            name="password"
            withAsterisk
            description="Must be atleast 8 characters"
            rules={{
              required: { value: true, message: "Password is required" },
              minLength: { value: 8, message: "Must be atleast 8 characters" },
            }}
          >
            <Input placeholder="Enter your password" type="password" withShowPassword />
          </FormInput>

          <FormInput label="Confirm Password" name="confirm_password" rules={{ validate: validateConfirmPassword }}>
            <Input placeholder="Re-enter password" type="password" withShowPassword />
          </FormInput>

          <Button type="submit" className="w-full" disabled={!isValid} loading={isPending}>
            Get Started
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-xs">
        Already have an account?
        <a href="/auth/login" className="ml-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800">
          Sign in
        </a>
      </p>
    </main>
  );
}
