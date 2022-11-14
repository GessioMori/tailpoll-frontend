import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Root } from "./components/Root";
import { Index } from "./pages/Index";
import { PoolPage } from "./pages/PoolPage";
import { UserPools } from "./pages/UserPools";
import { UserVotes } from "./pages/UserVotes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Index />} />
      <Route path="/pools" element={<UserPools />} />
      <Route path="/votes" element={<UserVotes />} />
      <Route path="/pool/:id" element={<PoolPage />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
