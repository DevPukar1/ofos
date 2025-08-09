import { v4 as uuidv4 } from "uuid";

const generateUUID = () => {
  const uuid = uuidv4(); // generate a new uuid for users
  return uuid;
};

export { generateUUID };
