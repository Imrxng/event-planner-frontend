import React, { createContext } from "react";
import { MongoDbUser, Notification, UserRole } from "../types/types";

interface IUserContext {
  user: MongoDbUser | undefined;
  loadingUser: boolean;
  setUser: React.Dispatch<React.SetStateAction<MongoDbUser | undefined>>;
}

interface INotificationContext {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  notificationLoader: boolean;
  firstRender: boolean;
}

export const UserContext = createContext<IUserContext>({
  user: undefined,
  loadingUser: false,
  setUser: () => {},
});
export const UserRoleContext = createContext<UserRole | undefined>(undefined);
export const ManagementTokenContext = createContext<string | undefined>(
  undefined,
);

export const NotificationContext = createContext<INotificationContext>({
  notifications: [],
  setNotifications: () => {},
  notificationLoader: false,
  firstRender: true,
});
