/**
 * @file Implements DAO managing data storage of Dislikes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */
import DislikeDaoI from "../interfaces/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikesModel";
import Dislike from "../models/dislikes/dislike";
/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of Dislikes
 * @property {DislikeDao} DislikeDao Private single instance of DislikeDao
 */
export default class DislikeDao implements DislikeDaoI {
    private static DislikeDao: DislikeDao | null = null;

    public static getInstance = (): DislikeDao => {
        if (DislikeDao.DislikeDao === null) {
            DislikeDao.DislikeDao = new DislikeDao();
        }
        return DislikeDao.DislikeDao;
    }
    private constructor() { }

    findAllUsersThatDislikedTuit = async (tid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({ tuit: tid })
            .populate("dislikedBy")
            .exec();

    findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({ dislikedBy: uid })
            .populate("tuit")
            .exec();

    userDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.create({ tuit: tid, dislikedBy: uid });

    userUndislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({ tuit: tid, dislikedBy: uid });

    countHowManyDislikedTuit =
        async (tid: string) =>
            DislikeModel.count({ tuit: tid });

    findUserDislikesTuit =
        async (tid: string, uid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikeBy: uid});
}

