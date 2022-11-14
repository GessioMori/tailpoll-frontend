import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Root: FunctionComponent = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
