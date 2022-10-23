import MessageDaoI from "../interfaces/MessageDaoI";
import Message from "../models/Message";
import MessageModel from "../mongoose/MessageModel";

export default class MessageDao implements MessageDaoI{
    private static messageDao: MessageDao | null = null;

    public static getInstance = (): MessageDao => {
        if(MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }

    async userMessagesUser(uidA: string, uidB: string, message: Message): Promise<any> {
        return await MessageModel.create({...message, from: uidA, to: uidB});
    }

    async deleteMessage(mid: string): Promise<any> {
        return await MessageModel.deleteOne({_id:mid});
    }

    async findAllSendFromMessages(uid: string): Promise<Message[]> {
        return await MessageModel.find({from: uid}).populate("to").exec();
    }

    async findAllSendToMessages(uid: string): Promise<Message[]> {
        return await  MessageModel.find({to: uid}).populate("from").exec();
    }
}