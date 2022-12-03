import LikeControllerI from "../interfaces/LikeControllerI";
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";
import TuitDao from "../daos/TuitDao";

export default class LikeController implements LikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeController: LikeController | null = null;

    public static getInstance = (app: Express): LikeController => {
        if (LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.get('/api/users/:uid/likes', LikeController.likeController.findAllTuitsLikedByUser);
            app.get('/api/tuits/:tid/likes', LikeController.likeController.findAllUsersLikedThatTuit);
            app.post('/api/users/:uid/likes/:tid', LikeController.likeController.userLikesTuit);
            app.delete('/api/users/:uid/unlikes/:tid', LikeController.likeController.userUnlikesTuit);
            app.put("/api/users/:uid/likes/:tid", LikeController.likeController.userTogglesTuitLikes);
            app.get("/api/users/:uid/likes/:tid", LikeController.likeController.userAlreadyLikedTuit);
        }
        return LikeController.likeController;
    }

    private constructor() {}

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersLikedThatTuit = (req: Request, res: Response) =>
        LikeController.likeDao.findAllUsersLikedThatTuit(req.params.tid)
            .then(likes => res.json(likes));

    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        if(uid === "me" && !profile){
            res.sendStatus(403);
            return;
        }

        const userId = uid === "me" && profile ?
            profile._id : uid;

        LikeController.likeDao.findAllTuitsLikedByUser(userId)
            .then(({likes}) => {
                const likesNonNullTuits = likes.filter(like => like.tuit);
                const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
                res.json(tuitsFromLikes);
            });
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userLikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then(likes => res.json(likes));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unliking
     * the tuit and the tuit being unliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     */
    userUnlikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userTogglesTuitLikes = async (req: Request, res: Response) => {
        const likeDao = LikeController.likeDao;
        const tuitDao = LikeController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        if(uid === "me" && !profile){
            res.sendStatus(403);
            return;
        }
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
            const howManyLikedTuit = await likeDao.countHowManyLikedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            if (userAlreadyLikedTuit) {
                await likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
            } else {
                await LikeController.likeDao.userLikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit + 1;
            };
            await tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the user likes the tuit
     */
    userAlreadyLikedTuit = (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        if(uid === "me" && !profile){
            res.sendStatus(403);
            return;
        }

        const userId = uid === "me" && profile ?
            profile._id : uid;
        LikeController.likeDao.findUserLikesTuit(userId, tid)
            .then((like) => res.json(like))
    }
};