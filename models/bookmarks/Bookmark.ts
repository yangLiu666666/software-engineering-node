import {Tuit} from "../tuits/Tuit";
import {User} from "../users/User";

export interface Bookmark{
    bookmarkedTuit: Tuit;
    bookmarkedBy: User;
}