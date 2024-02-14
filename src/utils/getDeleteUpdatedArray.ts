import { UserInterface } from "../types/interfaces";

export const getDeleteUpdatedArray = (
  usersBase: UserInterface[],
  id: string
): UserInterface[] => {
  return usersBase.filter((user) => user.id !== id);
};
