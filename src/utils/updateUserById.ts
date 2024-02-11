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

export const isUserExist = (usersBase: UserInterface[], id: string) => {
  const user = usersBase.find((user) => user.id === id);
  if (user) return true;
  return false;
};
