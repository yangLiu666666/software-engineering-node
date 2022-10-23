import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";
import {Express, Request, Response} from "express";

export default class MessageController implements MessageControllerI {

    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;


    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.post("/users/:useridA/messages/:useridB", MessageController.messageController.userMessagesUser);
            app.delete("/messages/:mid", MessageController.messageController.deleteMessage);
            app.get("/users/:userid/messages", MessageController.messageController.findAllSendFromMessages);
            app.get("/messages/:userid", MessageController.messageController.findAllSendToMessages);
        }
        return MessageController.messageController;
    }
    userMessagesUser = (req: Request, res: Response) =>
        MessageController.messageDao.userMessagesUser(req.params.uidA, req.params.uidB, req.body)
            .then(messages => res.json(messages));

    deleteMessage = (req: Request, res: Response) =>
        MessageController.messageDao.deleteMessage(req.params.mid)
            .then(status => res.send(status));

    findAllSendFromMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllSendFromMessages(req.params.uid)
            .then(messages => res.json(messages));

    findAllSendToMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllSendToMessages(req.params.uid)
            .then(messages => res.json(messages));

}