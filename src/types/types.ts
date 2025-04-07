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
export interface LocationSelectorProps {
    locatiefilter: string;
    setLocatiefilter: React.Dispatch<React.SetStateAction<string>>;
}
export interface SearchbarProps {
    search: string;
    setOnsearch: (query: string) => void;
    locatiefilter: string;
    setLocatiefilter: React.Dispatch<React.SetStateAction<string>>;
  }

export type UserRole = string;