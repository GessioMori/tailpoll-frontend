import { ThemeSwitch } from "./ThemeSwitch";

export const Navbar = () => {
  return (
    <nav>
      <div className={"p-4 flex justify-end"}>
        <ThemeSwitch />
      </div>
    </nav>
  );
};
