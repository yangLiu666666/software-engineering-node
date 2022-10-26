import Like from "../models/Like";

export default interface LikeDaoI{
    findAllTuitsLikedByUser(uid: string): Promise<Like[]>;
    findAllUsersLikedThatTuit(tid: string): Promise<Like[]>;
    userLikesTuit(uid: string, tid: string): Promise<Like>;
    userUnlikesTuit(uid: string, tid: string): Promise<any>;
}