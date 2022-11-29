// import {Request, Response} from "express";
//
// export default interface UserControllerI {
//     findAllUsers(req: Request, res: Response): void;
//     findUserById(req: Request, res: Response): void;
//     createUser(req: Request, res: Response): void;
//     deleteUser(req: Request, res: Response): void;
//     updateUser(req: Request, res: Response): void;
//     deleteAllUsers (req: Request, res: Response): void;
// }
/**
 * @file Declares the UserController interface.
 */
import {NextFunction, Request, Response} from "express";

export interface UserControllerI {
    findAllUsers(req: Request, res: Response): void;
    findUserById(req: Request, res: Response, next: NextFunction): void;
    findUserByName(req: Request, res: Response, next: NextFunction): void;
    createUser(req: Request, res: Response, next: NextFunction): void;
    deleteUser(req: Request, res: Response, next: NextFunction): void;
    updateUser(req: Request, res: Response, next: NextFunction): void;
    deleteUsersByUsername(req: Request, res: Response, next: NextFunction): void;
}