import {Dislike} from "../models/dislikes/Dislike";
/**
 * @file Declares API for Dislikes related data access object methods
 */
// export default interface DislikeDaoI {
//     findAllUsersThatDislikedTuit(tid: string):Promise<Dislike[]>;
//     findAllTuitsDislikedByUser (uid: string): Promise<Dislike[]>;
//     userUndislikesTuit (tid: string, uid: string): Promise<any>;
//     userDislikesTuit (tid: string, uid: string): Promise<Dislike>;
//     countHowManyDislikedTuit(tid:string):Promise<number>;
//     findUserDislikesTuit(tid: string, uid: string): Promise<any>;
// };

export interface DislikeDaoI {
    userLikesTuit(uid: string, tid: string): Promise<any>;
    userUnlikesTuit(uid: string, tid: string): Promise<Dislike>;
    findUserDislikedTuit(uid: string, tid: string): Promise<Dislike | null>;
    findAllDislikes(): Promise<Dislike[]>;
    findAllTuitsDislikedByUser(uid: string): Promise<Dislike[]>;
    countHowManyDislikedTuit(tid: string): Promise<number>;
}