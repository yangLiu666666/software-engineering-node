/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TuitModel from "../mongoose/tuits/TuitModel";
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * @class UserDao Implements Data Access Object managing data storage
 * of Users
 * @property {UserDao} userDao Private single instance of UserDao
 */
export default class TuitDao implements TuitDaoI{
    private static tuitDao: TuitDao | null = null;
    public static getInstance = (): TuitDao => {
        if(TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    private constructor() {}

    findAllTuits =
        async () =>
            TuitModel.find()
                .populate("postedBy")
                .exec();

    findAllTuitsByUser =
        async (uid: string) =>
            TuitModel.find({postedBy: uid})
                .populate("postedBy")
                .exec();

    findTuitById =
        async (uid: string): Promise<any> =>
            TuitModel.findById(uid)
                .populate("postedBy")
                .exec();

    createTuitByUser =
        async (uid: string, tuit: Tuit) =>
            TuitModel.create({...tuit, postedBy: uid});

    updateTuit =
        async (uid: string, tuit: Tuit) =>
            TuitModel.updateOne(
                {_id: uid},
                {$set: tuit});

    updateLikes =
        async (tid: string, newStats: any) =>
            TuitModel.updateOne(
                {_id: tid},
                {$set: {stats: newStats}});

    updateDislikes =
        async (tid: string, newStats: any) =>
            TuitModel.updateOne(
                {_id: tid},
                {$set: {stats: newStats}});

    deleteTuit =
        async (uid: string) =>
            TuitModel.deleteOne({_id: uid});
}