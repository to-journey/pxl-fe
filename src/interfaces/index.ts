export interface IGame {
    id: number;
    name: string;
    sname: string;
    is_open: boolean;
    is_played: boolean;
}

export interface IUser {
    id: number;
    email: string;
    username: string;
    twitter_id: string;
    avatar: string;
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
