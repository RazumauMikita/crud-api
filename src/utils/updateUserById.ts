import { UserInterface } from "../types/interfaces";

export const getPutUpdatedArray = (
  usersBase: UserInterface[],
  id: string,
  body: string
): UserInterface[] => {
  return usersBase.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        ...JSON.parse(body),
      };
    }
    return user;
  });
};
