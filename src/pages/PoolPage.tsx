import { useQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { getPool } from "../api/functions";

export const PoolPage: FunctionComponent = () => {
  const { poolId } = useParams();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getPool({ id: poolId }),
  });

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (isError) {
    return <h1>ERROR</h1>;
  }

  return (
    <div>
      <h1>{JSON.stringify(data)}</h1>
    </div>
  );
};
