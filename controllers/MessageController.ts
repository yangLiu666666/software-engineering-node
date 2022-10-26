import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";
import {Express, Request, Response} from "express";

export default class MessageController implements MessageControllerI {

    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;


    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.post('/api/users/:uidA/messages/:uidB', MessageController.messageController.userMessagesUser);
            app.delete('/api/messages/:mid', MessageController.messageController.deleteMessage);
            app.get('/api/users/:uid/messages', MessageController.messageController.findAllReceiveMessages);
            app.get('/api/messages/:uid', MessageController.messageController.findAllSentMessages);
        }
        return MessageController.messageController;
    }
    userMessagesUser = (req: Request, res: Response) =>
        MessageController.messageDao.userMessagesUser(req.params.uidA, req.params.uidB, req.body)
            .then(messages => res.json(messages));

    deleteMessage = (req: Request, res: Response) =>
        MessageController.messageDao.deleteMessage(req.params.mid)
            .then(status => res.send(status));

    findAllReceiveMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllReceiveMessages(req.params.uid)
            .then(messages => res.json(messages));

    findAllSentMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllSentMessages(req.params.uid)
            .then(messages => res.json(messages));

}
