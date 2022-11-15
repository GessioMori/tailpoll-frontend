import * as Select from "@radix-ui/react-select";
import { add } from "date-fns";
import { FunctionComponent, memo, useEffect, useState } from "react";

const options = ["minutes", "hours", "days"];

type EndsInComponentProps = {
  handleSetEndToggler: () => void;
  handleSetEndDate: (date: Date) => void;
};

const EndsInComponent: FunctionComponent<EndsInComponentProps> = ({
  handleSetEndDate,
  handleSetEndToggler,
}) => {
  const [endNumber, setEndNumber] = useState<number>(5);
  const [selectValue, setSelectValue] = useState("minutes");

  useEffect(() => {
    handleSetEndDate(add(new Date(), { [selectValue]: endNumber }));
  }, [endNumber, selectValue]);

  return (
    <div className="w-full flex gap-2 items-center">
      <p>Ends in:</p>
      <input
        value={endNumber}
        type="number"
        onChange={(e) => setEndNumber(Number(e.target.value))}
        className="bg-zinc-300 dark:bg-zinc-800 p-2 rounded-md border-2 border-transparent focus:border-2 focus:border-sky-400 outline-none w-20"
      />
      <Select.Root
        value={selectValue}
        onValueChange={(value) => setSelectValue(value)}
      >
        <Select.Trigger className="bg-zinc-300 dark:bg-zinc-800 flex gap-2 h-11 py-2 px-4 rounded-md w-50 outline-none">
          <Select.Value placeholder="Select duration" />
        </Select.Trigger>

        <Select.Content className="bg-zinc-200 dark:bg-zinc-700 px-6 py-3 w-50 rounded-md">
          <Select.Viewport className="">
            <Select.Group className="flex flex-col gap-2">
              {options.map((option) => (
                <Select.Item
                  key={option}
                  value={option}
                  className="cursor-pointer outline-none"
                >
                  <Select.ItemText>{option}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
      <button
        type="button"
        onClick={handleSetEndToggler}
        className="fill-transparent px-1 stroke-zinc-700 hover:stroke-red-500 hover:cursor-pointer disabled:stroke-zinc-900 disabled:dark:stroke-zinc-200 disabled:opacity-10 disabled:cursor-not-allowed"
      >
        <svg
          className="w-6 h-6 "
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="4" width="16" height="16" rx="10" />
          <path d="M10 10l4 4m0 -4l-4 4" />
        </svg>
      </button>
    </div>
  );
};

export const EndsInComponentMemo = memo(EndsInComponent);
