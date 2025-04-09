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
  
  export interface Poll {
    title: string;
    description: string;
    image: string;
    createdBy: string;
    location: string;
    address: string;
    startDate: string;
    endDate: string;
    attendances: number;
    subjects: Subject[];
    declinedUsers: string[]; // Assuming declinedUsers is an array of user IDs or names
    organizors: string[]; // Assuming organizors is an array of user names
    validated: boolean;
    form: any | null; // Replace `any` with the specific type if the form has a defined structure
    createdAt: string;
    updatedAt: string;
  }


export interface Attendance {
    userName: string;
    answers: string[];
}

export type UserRole = string;