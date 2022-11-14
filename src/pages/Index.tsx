import { FunctionComponent } from "react";
import { CreatePool } from "../components/CreatePool";

export const Index: FunctionComponent = () => {
  return (
    <div className="pt-8 flex flex-col gap-8">
      <div className="text-6xl font-extrabold text-center  mb-4">
        What's the question?
      </div>
      <CreatePool />
    </div>
  );
};
