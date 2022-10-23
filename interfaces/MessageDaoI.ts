import Message from "../models/Message";

export default interface MessageDaoI{
    userMessagesUser(uidA: string, uidB: string, message: Message): Promise<any>;
    deleteMessage(mid: string): Promise<any>;
    findAllSendToMessages(uid: string): Promise<Message[]>;
    findAllSendFromMessages(uid: string): Promise<Message[]>;
}