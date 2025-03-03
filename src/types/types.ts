export interface MongoDbUser {
    _id: string;
    role: string;
    location: string;
    favorites: any[];
    notifications: any[];
    createdAt: string;
    updatedAt: string;
    picture: string;
    name: string;
    __v: number;
}

export interface RootObjectMongoDbUser {
    user: MongoDbUser;
}

export type UserRole = string;
