import {Request, Response} from "express";

export default interface LikeControllerI{
    findAllTuitsLikedByUser(req: Request, res: Response): void;
    findAllUsersLikedThatTuit(req: Request, res: Response): void;
    userLikesTuit(req: Request, res: Response): void;
    userUnlikesTuit(req: Request, res: Response): void;
}