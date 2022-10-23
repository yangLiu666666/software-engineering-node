import {Request, Response} from "express";

export default interface LikeControllerI{
    findAllLikes(req: Request, res: Response): void;
    findAllTuitsLikedByUser(req: Request, res: Response): void;
    findAllUsersLikedThatTuit(req: Request, res: Response): void;
    userLikesTuit(req: Request, res: Response): void;
    userUnlikesTuit(req: Request, res: Response): void;
}