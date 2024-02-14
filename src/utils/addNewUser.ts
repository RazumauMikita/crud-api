import { v4 as uuid } from "uuid";

import { UserInterface } from "../types/interfaces";

export const getUsersBaseAfterAdding = (
  body: string,
  usersBase: UserInterface[]
): UserInterface[] => {
  const newUser: UserInterface = {
    ...JSON.parse(body),
    id: uuid(),
  };
  usersBase.push(newUser);
  return usersBase;
};
