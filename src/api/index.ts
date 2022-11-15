import axios from "axios";
import { z } from "zod";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

function api<
  Request extends {
    params?: Record<string, string | undefined | null>;
    data?: Record<string, string | string[] | number | Date | undefined | null>;
  },
  Response
>({
  method,
  path,
  requestSchema,
  responseSchema,
}: {
  method: HTTPMethod;
  path: string;
  requestSchema: z.ZodType<Request>;
  responseSchema: z.ZodType<Response>;
}): (data: Request) => Promise<Response> {
  return function (requestData: Request) {
    async function apiCall() {
      console.log("API CALL");
      if (!requestSchema.safeParse(requestData).success) {
        throw new Error("Bad request");
      }
      try {
        const response = await axios({
          baseURL: import.meta.env.VITE_BASEURL,
          method,
          url: path,
          params: requestData.params,
          data: requestData.data,
          withCredentials: true,
        });
        const result = responseSchema.safeParse(response.data);

        if (!result.success) {
          throw new Error("Invalid data received");
        }

        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
          throw new Error(err.message);
        }
      }
    }

    return apiCall();
  };
}

const poolObj = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  endsAt: z.string().nullish(),
  creatorToken: z.string().cuid(),
  question: z.string(),
  options: z.array(z.string()),
});

const voteObj = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  voterToken: z.string().cuid(),
  option: z.number().min(0).max(9),
  poolId: z.string().cuid(),
});

const getPoolRequest = z.object({
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});
const getPoolResponse = z.object({
  pool: poolObj,
  isOwner: z.boolean(),
});
export const getPool = api<
  z.infer<typeof getPoolRequest>,
  z.infer<typeof getPoolResponse>
>({
  method: HTTPMethod.GET,
  path: "/pool",
  requestSchema: getPoolRequest,
  responseSchema: getPoolResponse,
});

export const createPoolRequest = z.object({
  data: z.object({
    question: z.string().min(10).max(300),
    options: z.array(z.string().min(2).max(50)).min(2),
    endsAt: z.date().min(new Date()).nullish(),
  }),
});
const createPoolResponse = poolObj;
export const createPool = api<
  z.infer<typeof createPoolRequest>,
  z.infer<typeof createPoolResponse>
>({
  method: HTTPMethod.POST,
  path: "/pool",
  requestSchema: createPoolRequest,
  responseSchema: createPoolResponse,
});

const createVoteRequest = z.object({
  data: z.object({
    option: z.number().min(0).max(9),
  }),
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});
const createVoteResponse = voteObj;
export const createVote = api<
  z.infer<typeof createVoteRequest>,
  z.infer<typeof createVoteResponse>
>({
  method: HTTPMethod.POST,
  path: "/vote",
  requestSchema: createVoteRequest,
  responseSchema: createVoteResponse,
});

const getResultsRequest = z.object({
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});
const getResultsResponse = z.array(
  z.object({
    _count: z.number(),
    option: z.number(),
  })
);
export const getResults = api<
  z.infer<typeof getResultsRequest>,
  z.infer<typeof getResultsResponse>
>({
  method: HTTPMethod.GET,
  path: "/result",
  requestSchema: getResultsRequest,
  responseSchema: getResultsResponse,
});

const getVoteRequest = z.object({
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});
const getVoteResponse = voteObj;
export const getVote = api<
  z.infer<typeof getVoteRequest>,
  z.infer<typeof getVoteResponse>
>({
  method: HTTPMethod.GET,
  path: "/vote",
  requestSchema: getVoteRequest,
  responseSchema: getVoteResponse,
});

const deletePoolRequest = z.object({
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});
const deletePoolResponse = z.any();
export const deletePool = api<
  z.infer<typeof deletePoolRequest>,
  z.infer<typeof deletePoolResponse>
>({
  method: HTTPMethod.DELETE,
  path: "/pool",
  requestSchema: deletePoolRequest,
  responseSchema: deletePoolResponse,
});
