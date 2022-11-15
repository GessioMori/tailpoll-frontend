import axios from "axios";
import { z } from "zod";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
}

export enum HTTPStatusCode {
  OK = 200,
}

function api<Request, Response>({
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
      if (!requestSchema.safeParse(requestData).success) {
        throw new Error("Bad request");
      }

      const response = await axios({
        baseURL: import.meta.env.VITE_BASEURL,
        method,
        url: path,
        [method === HTTPMethod.GET ? "params" : "data"]: requestData,
        withCredentials: true,
      });

      const result = responseSchema.safeParse(response.data);

      if (!result.success) {
        throw new Error("Invalid data received");
      }

      return response.data;
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

const getPoolRequest = z.object({
  id: z.string().cuid().nullish(),
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
  question: z.string().min(10).max(300),
  options: z.array(z.string().min(2).max(50)).min(2),
  endsAt: z.date().min(new Date()).nullish(),
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
