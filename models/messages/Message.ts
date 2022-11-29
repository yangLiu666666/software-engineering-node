import {User} from "../users/User";
export interface Message{
    message: string;
    to: User;
    from: User;
    sentOn: Date;
}