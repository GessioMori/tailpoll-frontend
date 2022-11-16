import { useQuery } from "@tanstack/react-query";
import { format, isBefore } from "date-fns";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { getUserPolls } from "../api/poll";
import loaderSVG from "../assets/loader.svg";

export const UserPolls: FunctionComponent = () => {
  const {
    isLoading,
    isError,
    data: polls,
  } = useQuery({
    queryKey: ["polls"],
    queryFn: () => getUserPolls({}),
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
            You don&#x27;t have any poll. Create a new one!
          </div>
        </div>
      </div>
    );
  }

  const sortPolls = (
    poll1: typeof polls[number],
    poll2: typeof polls[number]
  ) => {
    if (!poll1.endsAt && poll2.endsAt) {
      return 1;
    } else if (poll1.endsAt && !poll2.endsAt) {
      return -1;
    } else if (poll1.endsAt && poll2.endsAt) {
      return (
        new Date(poll2.endsAt).getTime() - new Date(poll1.endsAt).getTime()
      );
    } else {
      return 0;
    }
  };

  return (
    <div className="w-full p-5">
      <div className="flex flex-col mx-auto gap-4 max-w-3xl">
        {polls.length === 0 ? (
          <div className="text-3xl font-bold text-center">
            You don&#x27;t have any poll. Create a new one!
          </div>
        ) : (
          polls.sort(sortPolls).map((poll) => (
            <div key={poll.id}>
              <Link to={`/poll/${poll.id}`}>
                <div className="w-full flex flex-col gap-2 border-2 p-4 border-zinc-300 dark:border-zinc-600 rounded-md hover:border-sky-300 dark:hover:border-sky-800">
                  <div className="font-bold text-xl">{poll.question}</div>
                  <div className=" flex font-light flex-wrap gap-6">
                    <div>
                      Created at:
                      {format(new Date(poll.createdAt), " dd/MM/yyyy - HH:mm")}
                    </div>
                    {poll.endsAt && (
                      <div>
                        {isBefore(new Date(poll.endsAt), new Date())
                          ? "Ended at:"
                          : "Ends at:"}{" "}
                        {format(
                          new Date(poll.createdAt),
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
