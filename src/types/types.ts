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

export interface Question {
    question: string;
    possibleAnswers: string[];
}
  
export interface Event {
    title: string;
    description: string;
    location: string;
    address: string;
    type: 'regionaal' | 'nationaal';
    startDate: Date;
    endDate: Date;
    createdBy: string;
    attendances: string[];
    declinedUsers: string[];
    organizors: string[];
    validated: boolean;
    form: Question[];
    refusalReason?: string;
    paidByBrightest: boolean;
    emoji: string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export interface Attendance {
    userName: string;
    answers: string[];
  }

export type UserRole = string;