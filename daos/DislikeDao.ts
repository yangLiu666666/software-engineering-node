/**
 * @file Implements DAO managing data storage of dislikes.
 */
import {DislikeDaoI} from "../interfaces/DislikeDaoI";
import {Dislike} from "../models/dislikes/Dislike";
import {UserDao} from "./UserDao";
import {TuitDao} from "./TuitDao";
import {NoSuchTuitError, NoSuchUserError} from "../error_handlers/CustomErrors";
import DislikeModel from "../mongoose/dislikes/DislikesModel";

/**
 * Implements Data Access Object managing data storage of dislikes.
 * @property {DislikeDao} dislikeDao Private single instance of DislikeDao
 **/
export class DislikeDao implements DislikeDaoI {

    private static dislikeDao: DislikeDao | null = null;

    /**
     * Creates singleton DAO instance.
     * @returns {DislikeDao} A DAO instance
     */
    public static getInstance = () => {
        if (DislikeDao.dislikeDao == null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }

    /**
     * Deletes "user dislikes a tuit" record when the user likes the tuit.
     * @param {string} uid The user's primary key
     * @param {string} tid The tuit's primary key
     * @return {Promise} To be notified when the dislike is deleted into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<any> => {
        return DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});
    }

    /**
     * Inserts a new data record into the database that reflects "user dislikes a tuit" relationship.
     * @param {string} uid The user's primary key
     * @param {string} tid The tuit's primary key
     * @return {Promise} To be notified when the dislike is inserted into the database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<Dislike> => {
        const user = await UserDao.getInstance().findUserById(uid);
        const tuit = await TuitDao.getInstance().findTuitById(tid);
        if (user) {
            if (tuit) {
                return DislikeModel.findOne({tuit: tid, dislikedBy: uid}).then((dislike) => {
                    return dislike === null ? DislikeModel.create({tuit: tid, dislikedBy: uid}) : dislike;
                })
            } else {
                throw new NoSuchTuitError()
            }
        } else {
            throw new NoSuchUserError();
        }
    }

    /**
     * Finds "user dislikes a tuit" record
     * @param {string} uid The user's primary key
     * @param {string} tid The tuit's primary key
     * @return {Promise} To be notified when the dislike is found
     */
    findUserDislikedTuit = async (uid: string, tid: string): Promise<Dislike | null> => {
        return DislikeModel.findOne({tuit: tid, dislikedBy: uid});
    }

    /**
     * Reads all the dislike records from the database.
     * @returns {Promise} To be notified when the list of dislikes are retrieved from the database
     */
    findAllDislikes = async (): Promise<Dislike[]> => {
        return DislikeModel.find();
    }

    /**
     * Reads a list of tuits that are disliked by a specified user.
     * @param {string} uid The user's primary key
     * @returns {Promise} To be notified when the list of tuits are retrieved from the database
     */
    findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> => {
        return DislikeModel.find({dislikedBy: uid}).populate(
            {path: "tuit", populate: {path: "postedBy"}}).exec();
    }

    /**
     * Counts how many users disliked the tuit
     * @param {string} tid The tuit's primary key
     * @return {Promise} To be notified when the count is collected
     */
    countHowManyDislikedTuit = async (tid: string): Promise<number> => {
        return DislikeModel.countDocuments({tuit: tid});
    }

}
// /**
//  * @file Implements DAO managing data storage of Dislikes. Uses mongoose DislikeModel
//  * to integrate with MongoDB
//  */
// import DislikeDaoI from "../interfaces/DislikeDaoI";
// import DislikeModel from "../mongoose/dislikes/DislikesModel";
// import Dislike from "../models/dislikes/dislike";
// /**
//  * @class DislikeDao Implements Data Access Object managing data storage
//  * of Dislikes
//  * @property {DislikeDao} DislikeDao Private single instance of DislikeDao
//  */
// export default class DislikeDao implements DislikeDaoI {
//     private static DislikeDao: DislikeDao | null = null;
//
//     public static getInstance = (): DislikeDao => {
//         if (DislikeDao.DislikeDao === null) {
//             DislikeDao.DislikeDao = new DislikeDao();
//         }
//         return DislikeDao.DislikeDao;
//     }
//     private constructor() { }
//
//     findAllUsersThatDislikedTuit = async (tid: string): Promise<Dislike[]> =>
//         DislikeModel
//             .find({ tuit: tid })
//             .populate("dislikedBy")
//             .exec();
//
//     findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
//         DislikeModel
//             .find({ dislikedBy: uid })
//             .populate("tuit")
//             .exec();
//
//     userDislikesTuit = async (uid: string, tid: string): Promise<any> =>
//         DislikeModel.create({ tuit: tid, dislikedBy: uid });
//
//     userUndislikesTuit = async (uid: string, tid: string): Promise<any> =>
//         DislikeModel.deleteOne({ tuit: tid, dislikedBy: uid });
//
//     countHowManyDislikedTuit =
//         async (tid: string) =>
//             DislikeModel.count({ tuit: tid });
//
//     findUserDislikesTuit =
//         async (tid: string, uid: string): Promise<any> =>
//         DislikeModel.findOne({tuit: tid, dislikeBy: uid});
// }
//
