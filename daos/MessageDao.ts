import MessageDaoI from "../interfaces/MessageDaoI";
import {Message} from "../models/messages/Message";
import MessageModel from "../mongoose/messages/MessageModel";

export default class MessageDao implements MessageDaoI{
    private static MessageDao: MessageDao | null = null;

    public static getInstance = (): MessageDao => {
        if(MessageDao.MessageDao === null) {
            MessageDao.MessageDao = new MessageDao();
        }
        return MessageDao.MessageDao;
    }

    private constructor() { }

    async userMessagesUser(uidA: string, uidB: string, message: string): Promise<any> {
        return await MessageModel.create({from: uidA, to: uidB, message: message, sentOn: new Date});
    }

    async deleteMessage(mid: string): Promise<any> {
        return await MessageModel.deleteOne({_id:mid});
    }

    async findAllReceiveMessages(uid: string): Promise<Message[]> {
        return await MessageModel.find({from: uid}).populate("from").exec();
    }

    async findAllSentMessages(uid: string): Promise<Message[]> {
        return await  MessageModel.find({to: uid}).populate("to").exec();
    }
}
