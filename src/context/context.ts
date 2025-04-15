import { createContext } from "react";
import { MongoDbUser, UserRole } from "../types/types";

interface IUserContext {
  user : MongoDbUser | undefined;
  loadingUser: boolean;
}

export const UserContext = createContext<IUserContext>(
  {
    user: undefined, loadingUser: false
});
export const UserRoleContext = createContext<UserRole | undefined>(undefined);
export const ManagementTokenContext = createContext<string | undefined>(
  undefined
);