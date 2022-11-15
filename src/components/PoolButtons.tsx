import { FunctionComponent } from "react";

export const PoolButtons: FunctionComponent = () => {
  return (
    <div className="w-full px-5">
      <div className="flex mx-auto gap-2 max-w-3xl justify-end">
        <button className="font-bold bg-sky-400 px-4 py-2 rounded-md text-zinc-100 hover:brightness-125">
          Close pool
        </button>
        <button className="font-bold bg-red-400 px-4 py-2 rounded-md text-zinc-100 hover:brightness-125">
          Delete pool
        </button>
      </div>
    </div>
  );
};
