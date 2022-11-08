import { Navbar } from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <div
        className={
          "text-6xl font-extrabold text-center text-zinc-900 dark:text-zinc-200 mb-4"
        }
      >
        Hello, TailPool!
      </div>
      <div className={"text-4xl  text-center text-zinc-900 dark:text-zinc-200"}>
        A pool app implementing TailwindCSS and RadixUI
      </div>
    </>
  );
};

export default App;
