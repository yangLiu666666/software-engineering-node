import LikeDaoI from "../interfaces/LikeDaoI";
import Like from "../models/Like";
import LikeModel from "../mongoose/LikeModel";

export default class LikeDao implements LikeDaoI{
    private static likeDao: LikeDao | null = null;

    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    findUserLikesTuit =
        async (uid, tid) =>
            LikeModel.findOne(
                {tuit: tid, likedBy: uid});

    countHowManyLikedTuit =
        async (tid) =>
            LikeModel.count({tuit: tid});

    userLikesTuit =
        async (uid, tid) =>
            LikeModel.create({tuit: tid, likedBy: uid});

    userUnlikesTuit =
        async (uid, tid) =>
            LikeModel.deleteOne({tuit: tid, likedBy: uid});

    findAllUsersLikedThatTuit =
        async (tid) =>
            LikeModel.find({tuit: tid})
                .populate("likedBy")
                .exec();

    findAllTuitsLikedByUser =
        async (uid)=>
            LikeModel.find({likedBy: uid})
                .populate({
                    path: "tuit",
                    populate: {
                        path: "postedBy"
                    }
                })
                .exec();

    // async findAllTuitsLikedByUser(uid: string): Promise<Like[]> {
    //     return await LikeModel.find({likeBy: uid}).populate("tuit").exec();
    // }
    //
    // async findAllUsersLikedThatTuit(tid: string): Promise<Like[]> {
    //     return await LikeModel.find({tuit: tid}).populate("likedBy").exec();
    // }
    //
    // async userLikesTuit(uid: string, tid: string): Promise<any> {
    //     return await LikeModel.create({tuit: tid, likedBy: uid});
    // }
    //
    // async userUnlikesTuit(uid: string, tid: string): Promise<any> {
    //     return await LikeModel.deleteOne({tuit: tid, likedBy: uid});
    // }
}
