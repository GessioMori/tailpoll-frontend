import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeSwitch } from "./ThemeSwitch";

export const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <nav className="flex justify-between items-center h-20">
      <button
        onClick={() => setIsNavOpen((current) => !current)}
        className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <div
        className={
          isNavOpen
            ? "absolute top-20 overflow-auto w-full justify-center"
            : "p-4 hidden w-full md:block md:w-auto"
        }
      >
        <ul
          className={
            isNavOpen
              ? "flex flex-col p-24 h-[calc(100vh-theme(space.20))] justify-around bg-zinc-100 dark:bg-zinc-900 text-2xl"
              : "flex space-x-8 items-center"
          }
        >
          <li
            className="flex justify-center"
            onClick={() => setIsNavOpen(false)}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-4" : undefined
              }
            >
              HOME
            </NavLink>
          </li>
          <li
            className="flex justify-center"
            onClick={() => setIsNavOpen(false)}
          >
            <NavLink
              to="/pools"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-4" : undefined
              }
            >
              MY POOLS
            </NavLink>
          </li>
          <li
            className="flex justify-center"
            onClick={() => setIsNavOpen(false)}
          >
            <NavLink
              to="/votes"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-4" : undefined
              }
            >
              MY VOTES
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="p-4 flex justify-end">
        <ThemeSwitch />
      </div>
    </nav>
  );
};
