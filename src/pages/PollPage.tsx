import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPoll, getResults, getVote } from "../api";
import loaderSVG from "../assets/loader.svg";
import { CreateVoteComponent } from "../components/CreateVote";
import { PollButtons } from "../components/PollButtons";
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
  });

  const { data: resultsData, refetch: fetchResults } = useQuery({
    queryKey: ["results"],
    queryFn: () => getResults({ params: { id: pollId } }),
    enabled: false,
  });

  const { data: voteData, refetch: fetchVote } = useQuery({
    queryKey: ["vote"],
    queryFn: () => getVote({ params: { id: pollId } }),
    enabled: false,
  });

  const handleVoteFetch = () => {
    fetchVote();
  };

  const handlePollRefetch = () => refetchPoll();

  useEffect(() => {
    if (pollData?.isOwner) {
      fetchResults();
    } else if (pollData) {
      fetchVote();
    }
  }, [pollData]);

  useEffect(() => {
    if (voteData) {
      fetchResults();
    }
  }, [voteData]);

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

  return (
    <>
      {(pollData.isOwner || voteData) && resultsData ? (
        <ResultsComponent
          question={pollData.poll.question}
          options={pollData.poll.options}
          votes={resultsData}
          userVote={voteData?.option}
        />
      ) : (
        <CreateVoteComponent
          question={pollData.poll.question}
          options={pollData.poll.options}
          fetchVote={handleVoteFetch}
        />
      )}
      <PollButtons
        isOwner={pollData.isOwner}
        handlePollRefetch={handlePollRefetch}
      />
    </>
  );
};
