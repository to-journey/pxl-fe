export interface IGame {
    id: number;
    name: string;
    sname: string;
    is_open: boolean;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    avatar: string;
    password: string;
}

export interface IScore {
    id: number;
    game_id: number;
    user_id: number;
    score: number;
    time: number;
}

export interface IQuestion {
    id: number;
    date: string;
    question: string;
}