import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPool, getResults, getVote } from "../api";
import loaderSVG from "../assets/loader.svg";
import { CreateVoteComponent } from "../components/CreateVote";
import { PoolButtons } from "../components/PoolButtons";
import { ResultsComponent } from "../components/Results";

export const PoolPage: FunctionComponent = () => {
  const { poolId } = useParams();

  const {
    isLoading,
    isError: isErrorPool,
    data: poolData,
    refetch: refetchPool,
    error,
  } = useQuery<Awaited<ReturnType<typeof getPool>>, Error>({
    queryKey: ["todos"],
    queryFn: () => getPool({ params: { id: poolId } }),
  });

  const { data: resultsData, refetch: fetchResults } = useQuery({
    queryKey: ["results"],
    queryFn: () => getResults({ params: { id: poolId } }),
    enabled: false,
  });

  const { data: voteData, refetch: fetchVote } = useQuery({
    queryKey: ["vote"],
    queryFn: () => getVote({ params: { id: poolId } }),
    enabled: false,
  });

  const handleVoteFetch = () => {
    fetchVote();
  };

  const handlePoolRefetch = () => refetchPool();

  useEffect(() => {
    if (poolData?.isOwner) {
      fetchResults();
    } else if (poolData) {
      fetchVote();
    }
  }, [poolData]);

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

  if (isErrorPool) {
    return (
      <div className="w-full p-5">
        <div className="flex flex-col mx-auto gap-4 max-w-3xl">
          <div className="text-3xl font-bold text-center">
            {error.message === "Not found"
              ? "Pool not found!"
              : "Some error happened, try again!"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {(poolData.isOwner || voteData) && resultsData ? (
        <ResultsComponent
          question={poolData.pool.question}
          options={poolData.pool.options}
          votes={resultsData}
          userVote={voteData?.option}
        />
      ) : (
        <CreateVoteComponent
          question={poolData.pool.question}
          options={poolData.pool.options}
          fetchVote={handleVoteFetch}
        />
      )}
      <PoolButtons
        isOwner={poolData.isOwner}
        handlePoolRefetch={handlePoolRefetch}
      />
    </>
  );
};
