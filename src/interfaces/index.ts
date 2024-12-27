export interface IGame {
    id: number;
    name: string;
    sname: string;
    is_open: boolean;
    is_played: boolean;
}

export interface IUser {
    id: number;
    name: string;
    avatar: string;
    dynamic_id: string;
    telegram_id: string;
    twitter_id: string;
    is_banned: boolean;
    is_admin: boolean;
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

export interface IPumpImage {
    id: number;
    image: string;
}
