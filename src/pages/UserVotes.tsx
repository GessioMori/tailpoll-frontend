import { useQuery } from "@tanstack/react-query";
import { format, isBefore } from "date-fns";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { getUserVotes } from "../api/vote";
import loaderSVG from "../assets/loader.svg";

export const UserVotes: FunctionComponent = () => {
  const {
    isLoading,
    isError,
    data: votes,
  } = useQuery({
    queryKey: ["votes"],
    queryFn: () => getUserVotes({}),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center w-full">
        <img src={loaderSVG} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-5">
        <div className="flex flex-col mx-auto gap-4 max-w-3xl">
          <div className="text-3xl font-bold text-center">
            You don&#x27;t have any vote.
          </div>
        </div>
      </div>
    );
  }

  const sortVotes = (
    poll1: typeof votes[number],
    poll2: typeof votes[number]
  ) => {
    if (!poll1.poll.endsAt && poll2.poll.endsAt) {
      return -1;
    } else if (poll1.poll.endsAt && !poll2.poll.endsAt) {
      return 1;
    } else if (poll1.poll.endsAt && poll2.poll.endsAt) {
      return (
        new Date(poll2.poll.endsAt).getTime() -
        new Date(poll1.poll.endsAt).getTime()
      );
    } else {
      return 0;
    }
  };

  return (
    <div className="w-full p-5">
      <div className="flex flex-col mx-auto gap-4 max-w-3xl">
        {votes.length === 0 ? (
          <div className="text-3xl font-bold text-center">
            You don&#x27;t have any vote.
          </div>
        ) : (
          votes.sort(sortVotes).map((vote) => (
            <div key={vote.id}>
              <Link to={`/poll/${vote.poll.id}`}>
                <div className="w-full flex flex-col gap-2 border-2 p-4 border-zinc-300 dark:border-zinc-600 rounded-md hover:border-sky-300 dark:hover:border-sky-800">
                  <div className="font-bold text-xl">{vote.poll.question}</div>
                  <div>Voted for: {vote.poll.options[vote.option]}</div>
                  <div className=" flex font-light flex-wrap gap-x-6">
                    <div>
                      Created at:
                      {format(
                        new Date(vote.poll.createdAt),
                        " dd/MM/yyyy - HH:mm"
                      )}
                    </div>
                    {vote.poll.endsAt && (
                      <div>
                        {isBefore(new Date(vote.poll.endsAt), new Date())
                          ? "Ended at:"
                          : "Ends at:"}{" "}
                        {format(
                          new Date(vote.poll.endsAt),
                          " dd/MM/yyyy - HH:mm"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
