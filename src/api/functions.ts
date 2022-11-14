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
    if (!requestSchema.safeParse(requestData).success) {
      throw new Error("Bad request");
    }

    async function apiCall() {
      const response = await axios({
        baseURL: import.meta.env.VITE_BASEURL,
        method,
        url: path,
        [method === HTTPMethod.GET ? "params" : "data"]: requestData,
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

const getPoolRequest = z.object({
  id: z.string().cuid().nullish(),
});
const getPoolResponse = z.object({
  pool: z.object({
    id: z.string().cuid(),
    createdAt: z.string(),
    endsAt: z.string().nullish(),
    creatorToken: z.string().cuid(),
    question: z.string(),
    options: z.array(z.string()),
  }),
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
