import {User} from "../users/User"

export interface Follow{
    userFollowed : User;
    userFollowing : User;
}