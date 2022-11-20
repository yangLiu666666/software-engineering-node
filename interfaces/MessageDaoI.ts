import Message from "../models/messages/Message";

export default interface MessageDaoI{
    userMessagesUser(uidA: string, uidB: string, message: string): Promise<Message>;
    deleteMessage(mid: string): Promise<any>;
    findAllSentMessages(uid: string): Promise<Message[]>;
    findAllReceiveMessages(uid: string): Promise<Message[]>;
}
