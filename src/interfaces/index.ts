export interface IGame {
    id: number;
    name: string;
    sname: string;
    is_open: boolean;
}

export interface IUser {
    id: number;
    name: string;
    avatar: string;
    dynamic_id: string;
    telegram_id: string;
    is_banned: boolean;
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