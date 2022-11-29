import {Follow} from "../models/follows/Follow";
import {Request, Response} from "express";

export default interface FollowDaoI{
    userFollowsUser(uidA: string, uidB: string): Promise<Follow>;
    userUnfollowsUser(uidA: string, uidB: string): Promise<any>;
    findAllFollowedByUsers(uid: string):Promise<Follow[]>;
    findAllFollowingUsers(uid: string): Promise<Follow[]>;

    findAllFollowedByOther(uid: string):Promise<Follow[]>;
    findAllFollowingOfOther(uid: string):Promise<Follow[]>;


}