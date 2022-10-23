import {Request, Response} from "express";


export default interface FollowControllerI{
    userFollowsUser(req: Request, res: Response): void;
    userUnfollowsUser(req: Request, res: Response): void;
    findAllFollowedByUsers(req: Request, res: Response): void;
    findAllFollowingUsers(req: Request, res: Response): void;

    findAllFollowedByOther(req: Request, res: Response): void;
    findAllFollowingOfOther(req: Request, res: Response): void;
}