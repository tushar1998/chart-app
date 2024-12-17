import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TailwindIndicator from "@/components/utils/tailwind-indicator.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index.tsx";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/react";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<span>Something went wrong</span>}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <BrowserRouter basename="/">
            <AppRoutes />
            <Toaster richColors theme="light" closeButton />
          </BrowserRouter>
        </NuqsAdapter>
        <TailwindIndicator />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
