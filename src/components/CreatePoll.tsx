import { useMutation } from "@tanstack/react-query";
import { FunctionComponent, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { createPoll, createPollRequest } from "../api/poll";
import { EndsInComponentMemo } from "./EndsIn";

export type fieldValues = {
  question: string;
  options: { value: string }[];
};

export const CreatePoll: FunctionComponent = () => {
  const [isEndEnable, setIsEndEnable] = useState(false);
  const [endsAt, setEndsAt] = useState<Date | undefined>(undefined);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<fieldValues>({});
  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: "options",
    rules: {
      minLength: 2,
      required: true,
    },
  });
  const navigate = useNavigate();

  const createPollMutation = useMutation({
    mutationFn: (newPoll: z.infer<typeof createPollRequest>) =>
      createPoll(newPoll),
  });

  const onSubmit = (data: fieldValues) => {
    createPollMutation
      .mutateAsync({
        data: {
          options: data.options.map((option) => option.value),
          question: data.question,
          endsAt,
        },
      })
      .then((response) => navigate("/poll/" + response.id));
  };

  useEffect(() => {
    prepend({ value: "" }, { shouldFocus: false });
    prepend({ value: "" }, { shouldFocus: false });
  }, []);

  const handleSetEndToggler = () => {
    setEndsAt(undefined);
    setIsEndEnable((current) => !current);
  };

  const handleSetEndDate = (date: Date) => {
    setEndsAt(() => date);
  };

  return (
    <div className="w-full px-5">
      <form
        className="flex flex-col mx-auto gap-2 max-w-3xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <textarea
          placeholder="Is Tailpoll your favorite poll platform?"
          className="w-full  bg-zinc-300 dark:bg-zinc-800 p-2 rounded-md border-2 border-transparent focus:border-2 focus:border-sky-400 outline-none resize-none"
          {...register("question", {
            required: true,
            minLength: 10,
            maxLength: 300,
          })}
        />
        {errors.question && (
          <div className="text-sm text-red-400">
            Question must have between 10 to 300 characters!
          </div>
        )}
        {fields.map((field, index) => {
          return (
            <div className="flex gap-2" key={field.id}>
              <input
                className="w-full bg-zinc-300 dark:bg-zinc-800 p-2 rounded-md border-2 border-transparent focus:border-2 focus:border-sky-400 outline-none"
                {...register(`options.${index}.value`, {
                  minLength: 2,
                  maxLength: 50,
                  required: true,
                })}
                placeholder={
                  index === 0 ? "Yes" : index === 1 ? "No" : undefined
                }
              />
              <button
                disabled={fields.length < 3}
                className="fill-transparent px-1 stroke-zinc-700 hover:stroke-red-500 hover:cursor-pointer disabled:stroke-zinc-900 disabled:dark:stroke-zinc-200 disabled:opacity-10 disabled:cursor-not-allowed"
                onClick={() => remove(index)}
                type="button"
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
        {errors.options && (
          <div className="text-sm text-red-400">
            All options must have between 2 to 50 characters!
          </div>
        )}

        <div className="flex justify-between mt-2">
          {isEndEnable ? (
            <EndsInComponentMemo
              handleSetEndToggler={handleSetEndToggler}
              handleSetEndDate={handleSetEndDate}
            />
          ) : (
            <button
              type="button"
              className="bg-green-500 rounded-md px-4 py-2 font-bold text-zinc-100 hover:brightness-90"
              onClick={() => setIsEndEnable(true)}
            >
              Set end time
            </button>
          )}

          {fields.length < 11 && (
            <button
              className="fill-transparent stroke-zinc-700 dark:stroke-zinc-400 hover:stroke-sky-600 hover:cursor-pointer"
              onClick={() => append({ value: "" })}
              type="button"
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
          )}
        </div>

        <div className="flex justify-center">
          <button
            className="mt-4 bg-sky-500 px-16 py-2 rounded-md font-bold text-zinc-100 outline outline-2 outline-offset-4 outline-transparent focus:outline-sky-500 hover:brightness-90 disabled:cursor-not-allowed"
            type="submit"
            disabled={createPollMutation.isLoading}
          >
            {createPollMutation.isLoading ? "Creating poll..." : "Create poll"}
          </button>
        </div>
      </form>
    </div>
  );
};
