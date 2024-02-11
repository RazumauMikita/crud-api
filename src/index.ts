import http from "http";
import { v4 as uuid, validate as isValidUserID } from "uuid";
import "dotenv/config";

import { sendResponse } from "./utils/sendResponse";
import { getRequestBody } from "./utils/getRequestBody";
import { UserInterface } from "./types/interfaces";
import { CONTENT_TYPES, MESSAGES, PORT } from "./constants/constants";
import { isUserExist, getPutUpdatedArray } from "./utils/updateUserById";
import { getDeleteUpdatedArray } from "./utils/getDeleteUpdatedArray";
import { testFn } from "./decorator";

let usersBase: UserInterface[] = [
  {
    age: 13,
    hobbies: ["none"],
    id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0a",
    username: "John",
  },
  {
    age: 23,
    hobbies: ["none"],
    id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0c",
    username: "Lom",
  },
];

const isValidUser = (body: string) => {
  const newUser = JSON.parse(body);
  if (!newUser.age || !newUser.hobbies || !newUser.username) return false;
  return true;
};

const addNewUser = (body: string) => {
  const newUser: UserInterface = {
    ...JSON.parse(body),
    id: uuid(),
  };
  usersBase.push(newUser);
};

const getUserIdFromReq = (req: http.IncomingMessage): string | undefined => {
  if (req.url?.startsWith("/api/users/")) {
    return req.url?.split("/").at(-1);
  }
};

const getUserById = (id: string): UserInterface | undefined => {
  return usersBase.find((user) => user.id === id);
};

const server = http.createServer(async (req, res) => {
  const method: string | undefined = req.method;
  let userId = getUserIdFromReq(req);

  testFn();

  switch (req.url) {
    case "/api/users":
      if (method === "GET") {
        sendResponse(res, 200, CONTENT_TYPES.JSON, JSON.stringify(usersBase));
      }
      if (method === "POST") {
        const body = await getRequestBody(req);
        if (isValidUser(body)) {
          addNewUser(body);
          sendResponse(res, 201, CONTENT_TYPES.JSON, body);
        } else {
          sendResponse(res, 400, CONTENT_TYPES.TEXT, MESSAGES.REQUIRED_FIELD);
        }
      }
      break;
    case `/api/users/${userId}`:
      if (method === "GET" && userId) {
        if (!isValidUserID(userId)) {
          sendResponse(res, 400, CONTENT_TYPES.TEXT, MESSAGES.INVALID_USER_ID);
          break;
        }
        const user = getUserById(userId);
        if (user) {
          sendResponse(res, 200, CONTENT_TYPES.JSON, JSON.stringify(user));
        } else {
          sendResponse(res, 400, CONTENT_TYPES.TEXT, MESSAGES.USER_NOT_EXIST);
        }
      }
      if (method === "PUT" && userId) {
        if (!isValidUserID(userId)) {
          sendResponse(res, 400, CONTENT_TYPES.TEXT, MESSAGES.INVALID_USER_ID);
          break;
        }
        if (!isUserExist(usersBase, userId)) {
          sendResponse(res, 404, CONTENT_TYPES.TEXT, MESSAGES.USER_NOT_EXIST);
          break;
        }
        const body = await getRequestBody(req);
        usersBase = getPutUpdatedArray(usersBase, userId, body);
        sendResponse(res, 200, CONTENT_TYPES.JSON, body);
        break;
      }

      if (method === "DELETE" && userId) {
        if (!isValidUserID(userId)) {
          sendResponse(res, 400, CONTENT_TYPES.TEXT, MESSAGES.INVALID_USER_ID);
          break;
        }
        if (!isUserExist(usersBase, userId)) {
          sendResponse(res, 404, CONTENT_TYPES.TEXT, MESSAGES.USER_NOT_EXIST);
          break;
        }
        usersBase = getDeleteUpdatedArray(usersBase, userId);
        sendResponse(res, 204, CONTENT_TYPES.JSON);
        break;
      }
    default:
      sendResponse(res, 200, CONTENT_TYPES.JSON, MESSAGES.PATH_NOT_EXIST);
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running...PORT: ${process.env.PORT}`);
});
