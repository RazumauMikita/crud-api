export const PORT: number = 3000;
export enum CONTENT_TYPES {
  TEXT = "text/html",
  JSON = "application/json",
}

export enum MESSAGES {
  REQUIRED_FIELD = "Body does not contain required fields",
  USER_NOT_EXIST = "doesn't exist",
  INVALID_USER_ID = "userId is invalid",
  PATH_NOT_EXIST = "Path not exist",
}
