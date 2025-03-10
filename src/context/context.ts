import { createContext } from "react";
import { MongoDbUser, UserRole } from "../types/types";

export const UserContext = createContext<MongoDbUser | undefined>(undefined);
export const UserRoleContext = createContext<UserRole | undefined>(undefined);
export const ManagementTokenContext = createContext<string | undefined>(
  undefined
);