import http from "http";
import { validate as isValidUserID } from "uuid";
import "dotenv/config";

import { CONTENT_TYPES, MESSAGES } from "./constants/constants";
import { UserInterface } from "./types/interfaces";
import {
  getUserIdFromReq,
  sendResponse,
  getRequestBody,
  isValidUser,
  getUsersBaseAfterAdding,
  getUserById,
  isUserExist,
  getPutUpdatedArray,
  getDeleteUpdatedArray,
} from "./utils";

let usersBase: UserInterface[] = [
  {
    age: 13,
    hobbies: [],
    id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0a",
    username: "John",
  },
  {
    age: 23,
    hobbies: [],
    id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0c",
    username: "Lom",
  },
];

const server = http.createServer(async (req, res) => {
  try {
    const method: string | undefined = req.method;
    let userId = getUserIdFromReq(req);

    switch (req.url) {
      case "/api/users":
        if (method === "GET") {
          sendResponse(res, 200, CONTENT_TYPES.JSON, JSON.stringify(usersBase));
        }
        if (method === "POST") {
          const body = await getRequestBody(req);
          if (isValidUser(body)) {
            getUsersBaseAfterAdding(body, usersBase);
            sendResponse(res, 201, CONTENT_TYPES.JSON, body);
          } else {
            sendResponse(res, 400, CONTENT_TYPES.TEXT, MESSAGES.REQUIRED_FIELD);
          }
        }
        break;
      case `/api/users/${userId}`:
        if (method === "GET" && userId) {
          if (!isValidUserID(userId)) {
            sendResponse(
              res,
              400,
              CONTENT_TYPES.TEXT,
              MESSAGES.INVALID_USER_ID
            );
            break;
          }

          const user = getUserById(userId, usersBase);
          if (user) {
            sendResponse(res, 200, CONTENT_TYPES.JSON, JSON.stringify(user));
          } else {
            sendResponse(res, 400, CONTENT_TYPES.TEXT, MESSAGES.USER_NOT_EXIST);
          }
          break;
        }
        if (method === "PUT" && userId) {
          if (!isValidUserID(userId)) {
            sendResponse(
              res,
              400,
              CONTENT_TYPES.TEXT,
              MESSAGES.INVALID_USER_ID
            );
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
            sendResponse(
              res,
              400,
              CONTENT_TYPES.TEXT,
              MESSAGES.INVALID_USER_ID
            );
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
  } catch {
    sendResponse(res, 500, CONTENT_TYPES.TEXT, MESSAGES.SERVER_ERROR);
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running...PORT: ${process.env.PORT}`);
});
