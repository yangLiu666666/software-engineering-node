import {Like} from "../models/likes/Like";

// export default interface LikeDaoI{
//     findAllTuitsLikedByUser(uid: string): Promise<Like[]>;
//     findAllUsersLikedThatTuit(tid: string): Promise<Like[]>;
//     userLikesTuit(uid: string, tid: string): Promise<Like>;
//     userUnlikesTuit(uid: string, tid: string): Promise<any>;
// }
export interface LikeDaoI {
    userLikesTuit(uid: string, tid: string): Promise<Like>;
    userUnlikesTuit(uid: string, tid: string): Promise<any>;
    findUserLikedTuit(uid: string, tid: string): Promise<Like | null>;
    findAllUsersThatLikedTuit(tid: string): Promise<Like[]>;
    findAllTuitsLikedByUser(uid: string): Promise<Like[]>;
    findAllLikes(): Promise<Like[]>;
    countHowManyLikedTuit(tid: string): Promise<number>;
}