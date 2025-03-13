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

export interface Event {
    title: string;
    description: string;
    location: string;
    type: "regionaal" | "nationaal";
    startDate: Date;
    endDate: Date;
    createdBy: string;
    organizors: string[];
    form: string[];
    paidByBrightest: boolean;
    emoji: string;
    createdAt?: Date;
    updatedAt?: Date;
    address: string;
    attendances: string;
    _id: string;
}

export type UserRole = string;
