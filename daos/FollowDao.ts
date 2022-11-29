import FollowDaoI from "../interfaces/FollowDaoI";
import {Follow} from "../models/follows/Follow";
import FollowModel from "../mongoose/follows/FollowModel";


export default class FollowDao implements FollowDaoI{
    private static followDao: FollowDao | null = null;

    public static getInstance = (): FollowDao => {
        if(FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }

    async userFollowsUser(uidA: string, uidB: string): Promise<Follow> {
        return await FollowModel.create({userFollowed: uidA, userFollowing: uidB});
    }

    async userUnfollowsUser(uidA: string, uidB: string): Promise<any> {
        return await FollowModel.deleteOne({userFollowed: uidA, userFollowing: uidB});
    }

    async findAllFollowedByUsers(uid: string): Promise<Follow[]> {
        return await FollowModel.find({userFollowed: uid}).populate("userFollowing").exec();
    }

    async findAllFollowingUsers(uid: string): Promise<Follow[]> {
        return await FollowModel.find({userFollowing: uid}).populate("userFollowed").exec();
    }

    async findAllFollowedByOther(uid: string): Promise<Follow[]> {
        return await FollowModel.find({userFollowed: uid}).populate("userFollowing").exec();
    }

    async findAllFollowingOfOther(uid: string): Promise<Follow[]> {
        return await FollowModel.find({userFollowing: uid}).populate("userFollowed").exec();
    }

}

