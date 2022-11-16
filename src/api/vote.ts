import { z } from "zod";
import { api, HTTPMethod } from ".";
import { pollObj } from "./poll";

const voteObj = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  voterToken: z.string().cuid(),
  option: z.number().min(0).max(9),
  pollId: z.string().cuid(),
});

// CREATE VOTE
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

// GET VOTE
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

//GET USER VOTES
const getUserVotesRequest = z.object({});
const getUserVotesResponse = z.array(
  z.object({
    id: z.string().cuid(),
    createdAt: z.string(),
    voterToken: z.string().cuid(),
    option: z.number().min(0).max(9),
    pollId: z.string().cuid(),
    poll: pollObj,
  })
);
export const getUserVotes = api<
  z.infer<typeof getUserVotesRequest>,
  z.infer<typeof getUserVotesResponse>
>({
  method: HTTPMethod.GET,
  path: "/votes",
  requestSchema: getUserVotesRequest,
  responseSchema: getUserVotesResponse,
});
