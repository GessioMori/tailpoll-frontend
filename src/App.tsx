import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Root } from "./components/Root";
import { Index } from "./pages/Index";
import { PollPage } from "./pages/PollPage";
import { UserPolls } from "./pages/UserPolls";
import { UserVotes } from "./pages/UserVotes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Index />} />
      <Route path="/polls" element={<UserPolls />} />
      <Route path="/votes" element={<UserVotes />} />
      <Route path="/poll/:pollId" element={<PollPage />} />
    </Route>
  )
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: { retry: false },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
