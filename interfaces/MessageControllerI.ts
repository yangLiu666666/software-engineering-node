import {Request, Response} from "express";

export default interface MessageControllerI{
    userMessagesUser(req: Request, res: Response): void;
    deleteMessage(req: Request, res: Response): void;
    findAllSentMessages(req: Request, res: Response): void;
    findAllReceiveMessages(req: Request, res: Response): void;
}

