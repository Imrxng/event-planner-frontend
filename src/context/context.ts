import { createContext } from "react";

import { MongoDbUser, UserRole } from "../types/types";

// Create a context for the user
export const UserContext = createContext<MongoDbUser | undefined>(undefined);


export const UserRoleContext = createContext<UserRole | undefined>(undefined);

// Create a context for the management token
export const ManagementTokenContext = createContext<string | undefined>(
  undefined
);