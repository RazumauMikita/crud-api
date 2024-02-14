import http from "http";

type StatusCode = 200 | 201 | 204 | 400 | 404 | 500;

export const sendResponse = (
  serverResponse: http.ServerResponse<http.IncomingMessage>,
  statusCode: StatusCode,
  contentType: string,
  responseData?: string
): void => {
  serverResponse.writeHead(statusCode, { "Content-Type": contentType });
  if (responseData) {
    serverResponse.write(responseData);
  }
  serverResponse.end();
};
