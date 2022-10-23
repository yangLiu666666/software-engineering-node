import Follow from "../models/Follow";
import {Request, Response} from "express";

export default interface FollowDaoI{
    userFollowsUser(uidA: string, uidB: string): Promise<any>;
    userUnfollowsUser(uidA: string, uidB: string): Promise<any>;
    findAllFollowedByUsers(uid: string):Promise<Follow[]>;
    findAllFollowingUsers(uid: string): Promise<Follow[]>;

    findAllFollowedByOther(uid: string):Promise<Follow[]>;
    findAllFollowingOfOther(uid: string):Promise<Follow[]>;


}