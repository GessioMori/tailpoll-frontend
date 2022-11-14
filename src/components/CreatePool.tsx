import { FunctionComponent, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type newPoolType = {
  question?: string;
  options: (string | undefined)[];
};

export const CreatePool: FunctionComponent = () => {
  const { control, register, handleSubmit } = useForm();
  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: "options",
    rules: {
      minLength: 2,
    },
  });
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    prepend({});
  }, []);

  return (
    <div className="w-full px-5">
      <form
        className="flex flex-col mx-auto gap-2 max-w-3xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <textarea
          placeholder="Is Tailpool your favorite pool platform?"
          className="w-full  bg-zinc-300 dark:bg-zinc-800 p-2 rounded-md border-2 border-transparent focus:border-2 focus:border-sky-400 outline-none resize-none"
          {...register("question")}
        />
        {fields.map((field, index) => {
          return (
            <div className="flex gap-2" key={field.id}>
              <input
                className="w-full bg-zinc-300 dark:bg-zinc-800 p-2 rounded-md border-2 border-transparent focus:border-2 focus:border-sky-400 outline-none"
                {...register(`options.${index}.value`)}
                placeholder={
                  index === 0 ? "Yes" : index === 1 ? "No" : undefined
                }
              />
              <button
                disabled={fields.length < 3}
                className="fill-transparent stroke-zinc-700 hover:stroke-red-500 hover:cursor-pointer disabled:stroke-zinc-900 disabled:dark:stroke-zinc-200 disabled:opacity-10 disabled:cursor-not-allowed"
                onClick={() => remove(index)}
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
        })}
        {fields.length < 11 && (
          <div className="flex justify-start">
            <button
              className="fill-transparent stroke-zinc-700 hover:stroke-sky-600 hover:cursor-pointer"
              onClick={() => append({})}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="12" y1="9" x2="12" y2="15" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex justify-center">
          <button
            className="mt-4 bg-gradient-to-tr from-[#00F260] to-[#0575E6] px-10 py-2 rounded-md font-bold text-zinc-100 outline outline-2 outline-offset-4 outline-transparent focus:outline-[#0575E6] hover:outline-[#0575E6]"
            type="submit"
          >
            Create pool
          </button>
        </div>
      </form>
    </div>
  );
};
