/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB.
 */
import {LikeDaoI} from "../interfaces/LikeDaoI";
import {Like} from "../models/likes/Like";
import LikeModel from "../mongoose/likes/LikeModel";
import {UserDao} from "./UserDao";
import {TuitDao} from "./TuitDao";
import likeModel from "../mongoose/likes/LikeModel";
import {NoSuchTuitError, NoSuchUserError} from "../error_handlers/CustomErrors";

/**
 * Implements Data Access Object managing data storage of likes.
 * @property {LikeDao} likeDao Private single instance of LikeDao
 **/
export class LikeDao implements LikeDaoI {

    private static likeDao: LikeDao | null = null;

    /**
     * Creates singleton DAO instance.
     * @returns {LikeDao} A DAO instance
     */
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    /**
     * Inserts a new data record into the database that reflects "user likes a tuit" relationship.
     * @param {string} uid The user's primary key
     * @param {string} tid The tuit's primary key
     * @return {Promise} To be notified when the like is inserted into the database
     */
    userLikesTuit = async(uid: string, tid: string): Promise<Like> => {
        const user = await UserDao.getInstance().findUserById(uid);
        const tuit = await TuitDao.getInstance().findTuitById(tid);
        if (user) {
            if (tuit) {
                return LikeModel.findOne({tuit: tid, likedBy: uid}).then((like) => {
                    return like === null ? LikeModel.create({tuit: tid, likedBy: uid}) : like;
                })
            } else {
                throw new NoSuchTuitError()
            }
        } else {
            throw new NoSuchUserError();
        }
    }

    /**
     * Deletes a like record from the database to reflect "user unlikes a tuit" relationship.
     * @param {string} uid The user's primary key
     * @param {string} tid The tuit's primary key
     * @returns {Promise} To be notified when the like is deleted from the database
     */
    userUnlikesTuit = async(uid: string, tid: string): Promise<any> => {
        return LikeModel.deleteOne({tuit: tid, likedBy: uid});
    }

    /**
     * Reads a list of users who liked a specified tuit.
     * @param tid The tuit's primary key
     * @returns {Promise} To be notified when the list of users is retrieved from the database
     */
    findAllUsersThatLikedTuit = async(tid: string): Promise<Like[]> => {
        return LikeModel.find({tuit: tid}).populate("likedBy").exec();
    }

    /**
     * Reads a list of tuits that are liked by a specified user.
     * @param {string} uid The user's primary key
     * @returns {Promise} To be notified when the list of tuits are retrieved from the database
     */
    findAllTuitsLikedByUser = async(uid: string): Promise<Like[]> => {
        return LikeModel.find({likedBy: uid}).populate(
            {path: "tuit", populate: {path: "postedBy"}}).exec();
    }

    /**
     * Reads all the like records from the database.
     * @returns {Promise} To be notified when the list of likes are retrieved from the database
     */
    findAllLikes = async(): Promise<Like[]> => {
        return LikeModel.find();
    }

    /**
     * Finds "user likes a tuit" record
     * @param {string} uid The user's primary key
     * @param {string} tid The tuit's primary key
     * @return {Promise} To be notified when the like is found
     */
    findUserLikedTuit = async (uid: string, tid: string): Promise<Like | null> => {
        return LikeModel.findOne({tuit: tid, likedBy: uid});
    }

    /**
     * Counts how many users liked the tuit
     * @param {string} tid The tuit's primary key
     * @return {Promise} To be notified when the count is collected
     */
    countHowManyLikedTuit = async (tid: string): Promise<number> => {
        return likeModel.countDocuments({tuit: tid});
    }

}
// import LikeDaoI from "../interfaces/LikeDaoI";
// import Like from "../models/likes/Like";
// import LikeModel from "../mongoose/likes/LikeModel";
// import UserDao from "./UserDao";
// import TuitDao from "./TuitDao";
// import {NoSuchTuitError, NoSuchUserError} from "../error_handlers/CustomErrors";
//
// export default class LikeDao implements LikeDaoI{
//     private static likeDao: LikeDao | null = null;
//
//     public static getInstance = (): LikeDao => {
//         if(LikeDao.likeDao === null) {
//             LikeDao.likeDao = new LikeDao();
//         }
//         return LikeDao.likeDao;
//     }
//
//     private constructor() {}
//
//     findUserLikesTuit =
//         async (uid: string, tid: string) =>
//             LikeModel.findOne(
//                 {tuit: tid, likedBy: uid});
//
//     countHowManyLikedTuit =
//         async (tid: string) =>
//             LikeModel.count({tuit: tid});
//
//     // userLikesTuit =
//     //     async (uid: string, tid: string) =>
//     //         LikeModel.create({tuit: tid, likedBy: uid});
//     /**
//      * Inserts a new data record into the database that reflects "user likes a tuit" relationship.
//      * @param {string} uid The user's primary key
//      * @param {string} tid The tuit's primary key
//      * @return {Promise} To be notified when the like is inserted into the database
//      */
//     userLikesTuit = async(uid: string, tid: string): Promise<Like> => {
//         const user = await UserDao.getInstance().findUserById(uid);
//         const tuit = await TuitDao.getInstance().findTuitById(tid);
//         if (user) {
//             if (tuit) {
//                 return LikeModel.findOne({tuit: tid, likedBy: uid}).then((like) => {
//                     return like === null ? LikeModel.create({tuit: tid, likedBy: uid}) : like;
//                 })
//             } else {
//                 throw new NoSuchTuitError()
//             }
//         } else {
//             throw new NoSuchUserError();
//         }
//     }
//
//     userUnlikesTuit =
//         async (uid: string, tid: string) =>
//             LikeModel.deleteOne({tuit: tid, likedBy: uid});
//
//     findAllUsersLikedThatTuit =
//         async (tid: string) =>
//             LikeModel.find({tuit: tid})
//                 .populate("likedBy")
//                 .exec();
//
//     findAllTuitsLikedByUser =
//         async (uid: string)=>
//             LikeModel.find({likedBy: uid})
//                 .populate({
//                     path: "tuit",
//                     populate: {
//                         path: "postedBy"
//                     }
//                 })
//                 .exec();
//
// }
