import { UserInterface } from "../types/interfaces";

export const isUserExist = (usersBase: UserInterface[], id: string) => {
  const user = usersBase.find((user) => user.id === id);
  if (user) return true;
  return false;
};
