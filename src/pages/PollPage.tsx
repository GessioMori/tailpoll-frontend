import { useQuery } from "@tanstack/react-query";
import { format, isBefore } from "date-fns";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPoll, getResults } from "../api/poll";
import { getVote } from "../api/vote";
import loaderSVG from "../assets/loader.svg";
import { CreateVoteComponent } from "../components/CreateVote";
import { ResultsComponent } from "../components/Results";

export const PollPage: FunctionComponent = () => {
  const { pollId } = useParams();

  const {
    isLoading,
    isError: isErrorPoll,
    data: pollData,
    refetch: refetchPoll,
    error,
  } = useQuery<Awaited<ReturnType<typeof getPoll>>, Error>({
    queryKey: ["todos"],
    queryFn: () => getPoll({ params: { id: pollId } }),
    enabled: false,
  });

  const { data: resultsData, refetch: refetchResult } = useQuery({
    queryKey: ["results"],
    queryFn: () => getResults({ params: { id: pollId } }),
    enabled: false,
  });

  const { data: voteData, refetch: refetchVote } = useQuery({
    queryKey: ["vote"],
    queryFn: () => getVote({ params: { id: pollId } }),
    enabled: false,
  });

  const handleVoteRefetch = () => {
    refetchVote().then((vote) => {
      if (vote.data) {
        refetchResult();
      }
    });
  };

  const handleResultRefetch = () => refetchResult();

  const handlePollRefetch = () => refetchPoll();

  useEffect(() => {
    refetchPoll().then((poll) => {
      if (poll.data?.isOwner) {
        refetchResult();
      } else {
        refetchVote().then((vote) => {
          if (vote.data) {
            refetchResult();
          }
        });
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full">
        <img src={loaderSVG} />
      </div>
    );
  }

  if (isErrorPoll) {
    return (
      <div className="w-full p-5">
        <div className="flex flex-col mx-auto gap-4 max-w-3xl">
          <div className="text-3xl font-bold text-center">
            {error.message === "Not found"
              ? "Poll not found!"
              : "Some error happened, try again!"}
          </div>
        </div>
      </div>
    );
  }

  const isEnded =
    !!pollData.poll.endsAt &&
    isBefore(new Date(pollData.poll.endsAt), new Date());

  return (
    <div className="w-full p-5">
      <div className="flex flex-col mx-auto gap-4 max-w-3xl">
        <div className="text-3xl font-bold">
          <h1>{pollData.poll.question}</h1>
        </div>
        {pollData.poll.endsAt && (
          <div className="text-md font-thin">
            <h3>
              {!isEnded ? "Ends at: " : "Ended at :"}

              {format(new Date(pollData.poll.endsAt), " dd/MM/yyyy - HH:mm")}
            </h3>
          </div>
        )}
        {(pollData.isOwner ||
          voteData ||
          (pollData.poll.endsAt &&
            isBefore(new Date(pollData.poll.endsAt), new Date()))) &&
        resultsData ? (
          <ResultsComponent
            options={pollData.poll.options}
            votes={resultsData}
            userVote={voteData?.option}
            isOwner={pollData.isOwner}
            handleResultRefetch={handleResultRefetch}
            handlePollRefetch={handlePollRefetch}
            isEnded={isEnded}
          />
        ) : (
          <CreateVoteComponent
            options={pollData.poll.options}
            endsAt={pollData.poll.endsAt}
            refetchVote={handleVoteRefetch}
          />
        )}
      </div>
    </div>
  );
};
