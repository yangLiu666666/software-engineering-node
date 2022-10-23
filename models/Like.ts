import User from "./User";
import Tuit from "./Tuit";

export default interface Like{
    tuit: Tuit;
    likedBy: User;
}