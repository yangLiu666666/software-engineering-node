import LikeDaoI from "../interfaces/LikeDaoI";
import Like from "../models/likes/Like";
import LikeModel from "../mongoose/likes/LikeModel";

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
        async (uid: string, tid: string) =>
            LikeModel.findOne(
                {tuit: tid, likedBy: uid});

    countHowManyLikedTuit =
        async (tid: string) =>
            LikeModel.count({tuit: tid});

    userLikesTuit =
        async (uid: string, tid: string) =>
            LikeModel.create({tuit: tid, likedBy: uid});

    userUnlikesTuit =
        async (uid: string, tid: string) =>
            LikeModel.deleteOne({tuit: tid, likedBy: uid});

    findAllUsersLikedThatTuit =
        async (tid: string) =>
            LikeModel.find({tuit: tid})
                .populate("likedBy")
                .exec();

    findAllTuitsLikedByUser =
        async (uid: string)=>
            LikeModel.find({likedBy: uid})
                .populate({
                    path: "tuit",
                    populate: {
                        path: "postedBy"
                    }
                })
                .exec();

}
