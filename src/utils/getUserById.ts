import { UserInterface } from "../types/interfaces";

export const getUserById = (
  id: string,
  usersBase: UserInterface[]
): UserInterface | undefined => {
  return usersBase.find((user) => user.id === id);
};
