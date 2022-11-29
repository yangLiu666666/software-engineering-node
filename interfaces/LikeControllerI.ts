// import {Request, Response} from "express";
//
// export default interface LikeControllerI{
//     findAllTuitsLikedByUser(req: Request, res: Response): void;
//     findAllUsersLikedThatTuit(req: Request, res: Response): void;
//     userLikesTuit(req: Request, res: Response): void;
//     userUnlikesTuit(req: Request, res: Response): void;
// }
/**
 * @file Declares the likeController interface.
 */
import {NextFunction, Request, Response} from "express";

export interface LikeControllerI {
    userLikesTuit(req: Request, res: Response, next: NextFunction): void;
    userUnlikesTuit(req: Request, res: Response, next: NextFunction): void;
    findAllUsersThatLikedTuit(req: Request, res: Response, next: NextFunction): void;
    findAllTuitsLikedByUser(req: any, res: Response, next: NextFunction): void;
    findAllLikes(req: Request, res: Response): void;
    findUserLikedTuit(req: any, res: Response, next: NextFunction): void;
}