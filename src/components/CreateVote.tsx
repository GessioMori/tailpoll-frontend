import { useMutation } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { createVote } from "../api";

type CreateVoteComponentProps = {
  question: string;
  options: string[];
  fetchVote: () => void;
};

export const CreateVoteComponent: FunctionComponent<
  CreateVoteComponentProps
> = ({ question, options, fetchVote }) => {
  const { pollId } = useParams();

  const createVoteMutation = useMutation({
    mutationFn: (option: number) =>
      createVote({ data: { option }, params: { id: pollId } }),
  });

  const handleVote = (option: number) => {
    createVoteMutation.mutateAsync(option).then(() => fetchVote());
  };

  return (
    <div className="w-full p-5">
      <div className="flex flex-col mx-auto gap-4 max-w-3xl">
        <div className="text-3xl font-bold">
          <h1>{question}</h1>
        </div>
        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <button
              key={option}
              className="w-full border-2 p-4 border-zinc-300 dark:border-zinc-600 rounded-md hover:border-sky-300 dark:hover:border-sky-800 text-left"
              onClick={() => handleVote(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
