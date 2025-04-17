export interface MongoDbUser {
    _id: string;
    role: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    picture: string;
    name: string;
    __v: number;
}

export interface Notification {
    type: string;
    message: string;
    createdAt: string;
    read: boolean;
}

export interface RootObjectMongoDbUser {
    user: MongoDbUser;
}

export interface Question {
    question: string;
    possibleAnswers: string[];
}


export interface Event {
    title: string;
    description: string;
    location: string;
    address: string;
    startDate: Date;
    endDate?: Date;
    createdBy: string;
    attendances: string[];
    declinedUsers: string[];
    organizors: string[];
    validated: boolean;
    form: Question[];
    refusalReason?: string;
    paidByBrightest: boolean;
    emoji: string;
    _id: string;
}
export interface Subject {
    id: string;
    title: string;
    votes: number;
    percentage: number;
}

export interface Option {
    text: string;
    votersId: string[];
    votes: number;
}

export interface Poll {
    _id: string;
    question: string;
    description: string;
    location: string;
    options: Option[];
    createdBy: string;
    createdAt: string;
}


export interface Attendance {
    userName: string;
    answers: string[];
}

export interface EventFormData {
    title: string;
    description: string;
    emoji: string;
    startDate: Date;
    endDate?: Date;
    address: string;
    location: string;
    paidByBrightest: boolean;
    organizors: string[];
    form: Question[];
    createdBy: string;
}

export interface PollFormData {
    question: string;
    description: string;
    location: string;
    options: string[];
    createdBy: string;
}


export type UserRole = string;