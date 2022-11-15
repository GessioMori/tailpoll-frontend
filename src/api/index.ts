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

const pollObj = z.object({
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
  pollId: z.string().cuid(),
});

const getPollRequest = z.object({
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});
const getPollResponse = z.object({
  poll: pollObj,
  isOwner: z.boolean(),
});
export const getPoll = api<
  z.infer<typeof getPollRequest>,
  z.infer<typeof getPollResponse>
>({
  method: HTTPMethod.GET,
  path: "/poll",
  requestSchema: getPollRequest,
  responseSchema: getPollResponse,
});

export const createPollRequest = z.object({
  data: z.object({
    question: z.string().min(10).max(300),
    options: z.array(z.string().min(2).max(50)).min(2),
    endsAt: z.date().min(new Date()).nullish(),
  }),
});
const createPollResponse = pollObj;
export const createPoll = api<
  z.infer<typeof createPollRequest>,
  z.infer<typeof createPollResponse>
>({
  method: HTTPMethod.POST,
  path: "/poll",
  requestSchema: createPollRequest,
  responseSchema: createPollResponse,
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

const deletePollRequest = z.object({
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});
const deletePollResponse = z.any();
export const deletePoll = api<
  z.infer<typeof deletePollRequest>,
  z.infer<typeof deletePollResponse>
>({
  method: HTTPMethod.DELETE,
  path: "/poll",
  requestSchema: deletePollRequest,
  responseSchema: deletePollResponse,
});
