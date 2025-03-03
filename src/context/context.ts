import { createContext } from "react";

import { UserRoles } from "../types/types";
import { User } from "@auth0/auth0-react";

// Create a context for the user
export const UserContext = createContext<User | undefined>(undefined);

// Create a context for the user roles
export const UserRoleContext = createContext<UserRoles | undefined>(undefined);

// Create a context for the management token
export const ManagementTokenContext = createContext<string | undefined>(
  undefined
);