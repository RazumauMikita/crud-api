import http from "http";

export const getRequestBody = (request: http.IncomingMessage) => {
  return new Promise<string>((res, rej) => {
    let body = "";
    request.on("data", (data) => {
      body += data.toString().trim();
    });
    request.on("end", () => {
      res(body);
    });
    request.on("error", (error) => {
      rej(error);
    });
  });
};
