import http from "http";
import { URL } from "node:url";

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

type StatusCode = 200 | 201 | 204 | 400 | 404;

const sendResponse = (
  serverResponse: http.ServerResponse<http.IncomingMessage>,
  statusCode: StatusCode,
  responseData?: string
): void => {
  serverResponse.writeHead(statusCode, { "Content-Type": "application/json" });
  if (responseData) {
    serverResponse.write(responseData);
  }
  serverResponse.end();
};

const getRequestBody = (request: http.IncomingMessage) => {
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

const isValidUser = (body: string) => {
  const newUser = JSON.parse(body);
  if (!newUser.age || !newUser.hobbies || !newUser.username) return false;
  return true;
};

const addNewUser = (body: string) => {
  const newUser: User = {
    ...JSON.parse(body),
    id: (usersBase.length + 1).toString(),
  };
  usersBase.push(newUser);
};

const getUserIdFromReq = (req: http.IncomingMessage): string | undefined => {
  if (req.url?.startsWith("/api/users/")) {
    return req.url?.split("/").at(-1);
  }
};

const getUserById = (id: string): User | undefined => {
  return usersBase.find((user) => user.id === id);
};
const PORT: number = 3000;

const usersBase: User[] = [
  { age: 13, hobbies: ["none"], id: "1", username: "John" },
  { age: 23, hobbies: ["none"], id: "2", username: "Lom" },
];

const server = http.createServer(async (req, res) => {
  const method: string | undefined = req.method;
  let userId = getUserIdFromReq(req);

  switch (req.url) {
    case "/api/users":
      if (method === "GET") {
        sendResponse(res, 200, JSON.stringify(usersBase));
      }
      if (method === "POST") {
        const body = await getRequestBody(req);
        if (isValidUser(body)) {
          addNewUser(body);
          sendResponse(res, 201);
        } else {
          sendResponse(res, 400, "required fields");
        }
      }
      break;
    case `/api/users/${userId}`:
      if (method === "GET" && typeof userId === "string") {
        const user = getUserById(userId);
        if (user) {
          sendResponse(res, 200, JSON.stringify(user));
        } else {
          sendResponse(res, 400, "doesn't exist");
        }
      }
      if (method === "POST") {
      }
      break;
    default:
      res.setHeader("Content-Type", "text/html");
      res.end();
  }
});

server.listen(PORT, () => {
  console.log("Server is running...");
});
