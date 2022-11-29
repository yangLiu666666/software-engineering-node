import {User} from "../users/User";
import {Tuit} from "../tuits/Tuit";

export interface Like{
    tuit: Tuit;
    likedBy: User;
}