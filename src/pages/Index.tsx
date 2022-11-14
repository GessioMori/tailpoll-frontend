import { FunctionComponent } from "react";
import { CreatePool } from "../components/CreatePool";

export const Index: FunctionComponent = () => {
  return (
    <>
      <div className={"text-6xl font-extrabold text-center  mb-4"}>
        Hello, TailPool!
      </div>
      <div className={"text-4xl  text-center"}>
        A pool app implementing TailwindCSS and RadixUI
      </div>
      <CreatePool />
    </>
  );
};
