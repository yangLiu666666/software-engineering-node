import User from "./User";
export default interface Message{
    message: Message;
    to: User;
    from: User;
    sentOn: Date;
}