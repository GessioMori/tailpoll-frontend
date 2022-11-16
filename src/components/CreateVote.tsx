import { useMutation } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { createVote } from "../api/vote";
import loaderSVG from "../assets/loader.svg";

type CreateVoteComponentProps = {
  options: string[];
  endsAt?: string | null;
  refetchVote: () => void;
};

export const CreateVoteComponent: FunctionComponent<
  CreateVoteComponentProps
> = ({ options, refetchVote }) => {
  const { pollId } = useParams();

  const createVoteMutation = useMutation({
    mutationFn: (option: number) =>
      createVote({ data: { option }, params: { id: pollId } }),
  });

  const handleVote = (option: number) => {
    createVoteMutation.mutateAsync(option).then(() => refetchVote());
  };

  return (
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
      {createVoteMutation.isLoading && (
        <div className="flex justify-center w-full h-20">
          <img src={loaderSVG} />
        </div>
      )}
    </div>
  );
};
