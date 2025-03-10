import { createContext } from "react";

import { MongoDbUser, UserRole } from "../types/types";
import { User } from "@auth0/auth0-react";

// Create a context for the user
export const UserContext = createContext<User | undefined>(undefined);

// Create a context for the user roles
interface UserRoleContextType {
  user: MongoDbUser | undefined;
  userRole: UserRole | undefined;
}
export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

// Create a context for the management token
export const ManagementTokenContext = createContext<string | undefined>(
  undefined
);