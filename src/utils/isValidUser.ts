export const isValidUser = (body: string) => {
  const newUser = JSON.parse(body);
  if (!newUser.age || !newUser.hobbies || !newUser.username) return false;
  return true;
};
