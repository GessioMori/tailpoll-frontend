import { FunctionComponent } from "react";
import { CreatePoll } from "../components/CreatePoll";

export const Index: FunctionComponent = () => {
  return (
    <div className="pt-8 flex flex-col gap-8">
      <div className="md:text-6xl text-3xl font-extrabold text-center  mb-4">
        What's the question?
      </div>
      <CreatePoll />
    </div>
  );
};
