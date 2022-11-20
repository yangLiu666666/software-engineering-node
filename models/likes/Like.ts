import User from "../users/User";
import Tuit from "../tuits/Tuit";

export default interface Like{
    tuit: Tuit;
    likedBy: User;
}