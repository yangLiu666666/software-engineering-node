import LikeDaoI from "../interfaces/LikeDaoI";
import Like from "../models/Like";
import LikeModel from "../mongoose/LikeModel";

/**
 * @class LikeDao Implements Data Access Object managing data storage
 * of Likes
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI{
    private static likeDao: LikeDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns LikeDao
     */
    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    /**
     * Uses LikeModel to retrieve all like documents from likes collection
     * @returns Promise To be notified when the likes are retrieved from
     * database
     */
    async findAllLikes(): Promise<Like[]> {
        return await LikeModel.find();
    }

    /**
     * Uses LikeModel to retrieve all like documents liked by the given user from likes collection
     * @param {string} uid primary key of the user
     * @returns Promise To be notified when the likes are retrieved from
     * database
     */
    async findAllTuitsLikedByUser(uid: string): Promise<Like[]> {
        return await LikeModel.find({likeBy: uid}).populate("tuit").exec();
    }

    /**
     * Uses LikeModel to retrieve all like documents of the given tuit from likes collection
     * @param {string} tid primary key of the tuit
     * @returns Promise To be notified when the likes are retrieved from
     * database
     */
    async findAllUsersLikedThatTuit(tid: string): Promise<Like[]> {
        return await LikeModel.find({tuit: tid}).populate("likedBy").exec();
    }

    /**
     * Insert like instance of the given user likes the given tuit.
     * @param {string} uid Primary key of the given user
     * @param {string} tid primary key of the given tuit
     * @returns Promise To be notified when the like is inserted into
     * database
     */
    async userLikesTuit(uid: string, tid: string): Promise<any> {
        return await LikeModel.create({tuit: tid, likedBy: uid});
    }

    /**
     * Remove like instance of the given user likes the given tuit.
     * @param {string} uid Primary key of the given user
     * @param {string} tid primary key of the given tuit
     * @returns Promise To be notified when the like is removed from
     * database
     */
    async userUnlikesTuit(uid: string, tid: string): Promise<any> {
        return await LikeModel.deleteOne({tuit: tid, likedBy: uid});
    }
}
