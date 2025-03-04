export interface MongoDbUser {
    _id: string;
    role: string;
    location: string;
    notifications: Notifications[];
    createdAt: string;
    updatedAt: string;
    picture: string;
    name: string;
    __v: number;
}

interface Notifications {
    type: string;
    message: string;
}

export interface RootObjectMongoDbUser {
    user: MongoDbUser;
}

export type UserRole = string;
