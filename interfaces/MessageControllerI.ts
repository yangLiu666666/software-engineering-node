import {Request, Response} from "express";

export default interface MessageControllerI{
    userMessagesUser(req: Request, res: Response): void;
    deleteMessage(req: Request, res: Response): void;
    findAllSendToMessages(req: Request, res: Response): void;
    findAllSendFromMessages(req: Request, res: Response): void;
}