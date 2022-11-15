import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPool, getResults } from "../api";
import loaderSVG from "../assets/loader.svg";
import { CreateVoteComponent } from "../components/CreateVote";
import { ResultsComponent } from "../components/Results";

export const PoolPage: FunctionComponent = () => {
  const { poolId } = useParams();

  const {
    isLoading,
    isError,
    data: poolData,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getPool({ params: { id: poolId } }),
  });

  const {
    isLoading: isLoadingResults,
    isError: isErrorResults,
    data: resultsData,
    refetch: fetchResults,
  } = useQuery({
    queryKey: ["results"],
    queryFn: () => getResults({ params: { id: poolId } }),
    enabled: false,
  });

  useEffect(() => {
    if (poolData?.isOwner) {
      fetchResults();
    }
  }, [poolData]);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full">
        <img src={loaderSVG} />
      </div>
    );
  }

  if (isError) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      {poolData.isOwner ? (
        resultsData && (
          <ResultsComponent
            question={poolData.pool.question}
            options={poolData.pool.options}
            votes={resultsData}
          />
        )
      ) : (
        <CreateVoteComponent
          question={poolData.pool.question}
          options={poolData.pool.options}
        />
      )}
    </>
  );
};
