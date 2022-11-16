import axios from "axios";
import { z } from "zod";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export function api<
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
