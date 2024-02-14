import http from "http";

export const getUserIdFromReq = (
  req: http.IncomingMessage
): string | undefined => {
  if (req.url?.startsWith("/api/users/")) {
    return req.url?.split("/").at(-1);
  }
};
