import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import App from "./App.tsx";
import "./index.css";

const enableDevtools = import.meta.env.VITE_ENABLE_DEVTOOLS === "true";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure index.html has a <div id='root'></div>"
  );
}

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
    {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);
