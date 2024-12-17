import Login from "@/components/log-in";
import SignUp from "@/components/sign-up";
import { Route, Routes } from "react-router-dom";
import "../index.css";
import App from "@/components/app";
import AuthLayout from "@/components/auth-layout";
import Home from "@/components/home";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main App Routes */}
      <Route path="/" element={<App />}>
        <Route path="dashboard" element={<Home />} />
      </Route>

      {/* Authentication Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}
