import { z } from "zod";
import { api, HTTPMethod } from ".";

const pollObj = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  endsAt: z.string().nullish(),
  creatorToken: z.string().cuid(),
  question: z.string(),
  options: z.array(z.string()),
});

const pollParams = z.object({
  params: z.object({
    id: z.string().cuid().nullish(),
  }),
});

// GET POLL
const getPollRequest = pollParams;
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

// CREATE POLL
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

// GET RESULTS
const getResultsRequest = pollParams;
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

// DELETE POLL
const deletePollRequest = pollParams;
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

// END POLL
const endPollRequest = pollParams;
const endPollResponse = pollObj;
export const endPoll = api<
  z.infer<typeof endPollRequest>,
  z.infer<typeof endPollResponse>
>({
  method: HTTPMethod.PATCH,
  path: "/poll",
  requestSchema: endPollRequest,
  responseSchema: endPollResponse,
});
