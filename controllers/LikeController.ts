/**
 * @file Controller RESTful web service API for likes resource
 */
import {LikeControllerI} from "../interfaces/LikeControllerI";
import {Express, NextFunction, Request, Response} from "express";
import {LikeDao} from "../daos/LikeDao";
import {NoSuchTuitError, NoUserLoggedInError} from "../error_handlers/CustomErrors";

/**
 * Implements RESTful Web service API for likes resource.
 * @property {LikeDao} likeDao Singleton DAO implementing like CRUD operations
 * @property {LikeController} likeController Singleton controller implementing RESTful web service API
 */
export class LikeController implements LikeControllerI {

    private static likeController: LikeController | null = null;
    private static likeDao: LikeDao = LikeDao.getInstance();

    private constructor() {};

    /**
     * Creates singleton controller instance.
     * @param {Express} app Express instance to declare the RESTful web service API
     * @returns {LikeController} Singleton controller
     */
    public static getInstance = (app: Express) => {
        if (LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.post("/api/users/:uid/likes/:tid", LikeController.likeController.userLikesTuit);
            app.delete("/api/users/:uid/likes/:tid", LikeController.likeController.userUnlikesTuit);
            app.get("/api/tuits/likes/:tid", LikeController.likeController.findAllUsersThatLikedTuit);
            app.get("/api/users/:uid/likes", LikeController.likeController.findAllTuitsLikedByUser);
            app.get("/api/likes", LikeController.likeController.findAllLikes);
            app.get("/api/users/:uid/likes/:tid", LikeController.likeController.findUserLikedTuit);
        }
        return LikeController.likeController;
    }

    /**
     * Creates a new like instance.
     * @param {Request} req, Represents request from the client, including path parameter uid identifying
     * the user's primary key and tid identifying the tuit's primary key
     * @param {Response} res Represents response to the client, including the body formatted as JSON containing the
     * new like that was inserted into the database
     * @param {NextFunction} next Error handling function
     */
    userLikesTuit = (req: Request, res: Response, next: NextFunction): void => {
        LikeController.likeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then((tuit) => res.json(tuit))
            .catch(next);
    }

    /**
     * Deletes a like instance from the database by the primary keys of the user and the tuit.
     * @param {Request} req Represents request from the client, including the path parameter uid
     * identifying the primary key of the user and tid identifying the tuit's primary key
     * @param {Response} res Represents response to the client, including status on
     * whether deleting was successful or not
     * @param {NextFunction} next Error handling function
     */
    userUnlikesTuit = (req: Request, res: Response, next: NextFunction): void => {
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then((status) => res.json(status))
            .catch(next);
    }

    /**
     * Retrieves the users who liked the specified tuit.
     * @param {Request} req Represents request from the client, including path parameter tid
     * identifying the primary key of the tuit object
     * @param {Response} res Represents response to the client, including the body formatted
     * as JSON array containing the users that liked the tuit
     * @param {NextFunction} next Error handling function
     */
    findAllUsersThatLikedTuit = (req: Request, res: Response, next: NextFunction): void => {
        LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then((users) => res.json(users))
            .catch(next);
    }

    /**
     * Retrieves the tuits liked by the specified user.
     * @param {Request} req Represents request from the client, including path parameter uid
     * identifying the primary key of the user object
     * @param {Response} res Represents response to the client, including the body formatted
     * as JSON array containing the tuits that liked by the user
     * @param {NextFunction} next Error handling function
     */
    findAllTuitsLikedByUser = (req: any, res: Response, next: NextFunction): void => {
        const uid = req.params.uid;
        const profile = req.session["profile"];
        if (uid === "me" && !profile) {
            next(new NoUserLoggedInError());
            return
        }
        const userId = uid === "me" ? profile._id : uid;
        LikeController.likeDao.findAllTuitsLikedByUser(userId)
            .then((likes) => {
                const likedTuits = likes.map((like) => {
                    return like.tuit;
                });
                res.json(likedTuits);
            }).catch(next);
    }

    /**
     * Finds "user likes a tuit" record.
     * @param {Request} req Represents request from the client, including the user's id and the tuit's id
     * @param {Response} res Represents response to the client, including the like record if exists
     * @param {NextFunction} next Error handling function
     */
    findUserLikedTuit = (req: any, res: Response, next: NextFunction): void => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session["profile"];
        if (uid === "me" && !profile) {
            next(new NoUserLoggedInError());
            return
        }
        const userId = uid === "me" ? profile._id : uid;
        LikeController.likeDao.findUserLikedTuit(userId, tid)
            .then((like) => res.json(like))
            .catch(next);
    }

    /**
     * Retrieves all likes from the database.
     * @param {Request} req Represents request from the client
     * @param {Response} res Represents response to the client
     */
    findAllLikes = (req: Request, res: Response): void => {
        LikeController.likeDao.findAllLikes()
            .then((likes) => res.json(likes));
    }

}


// import LikeControllerI from "../interfaces/LikeControllerI";
// import {Express, Request, Response} from "express";
// import LikeDao from "../daos/LikeDao";
// import TuitDao from "../daos/TuitDao";
//
// export default class LikeController implements LikeControllerI {
//     private static likeDao: LikeDao = LikeDao.getInstance();
//     private static tuitDao: TuitDao = TuitDao.getInstance();
//     private static likeController: LikeController | null = null;
//
//     public static getInstance = (app: Express): LikeController => {
//         if (LikeController.likeController === null) {
//             LikeController.likeController = new LikeController();
//             app.get('/api/users/:uid/likes', LikeController.likeController.findAllTuitsLikedByUser);
//             app.get('/api/tuits/:tid/likes', LikeController.likeController.findAllUsersLikedThatTuit);
//             app.post('/api/users/:uid/likes/:tid', LikeController.likeController.userLikesTuit);
//             app.delete('/api/users/:uid/unlikes/:tid', LikeController.likeController.userUnlikesTuit);
//             app.put("/api/users/:uid/likes/:tid", LikeController.likeController.userTogglesTuitLikes);
//             app.get("/api/users/:uid/likes/:tid", LikeController.likeController.userAlreadyLikedTuit);
//         }
//         return LikeController.likeController;
//     }
//
//     private constructor() {}
//
//     /**
//      * Retrieves all users that liked a tuit from the database
//      * @param {Request} req Represents request from client, including the path
//      * parameter tid representing the liked tuit
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON arrays containing the user objects
//      */
//     findAllUsersLikedThatTuit = (req: Request, res: Response) =>
//         LikeController.likeDao.findAllUsersLikedThatTuit(req.params.tid)
//             .then(likes => res.json(likes));
//
//     /**
//      * Retrieves all tuits liked by a user from the database
//      * @param {Request} req Represents request from client, including the path
//      * parameter uid representing the user liked the tuits
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON arrays containing the tuit objects that were liked
//      */
//     findAllTuitsLikedByUser = (req: Request, res: Response) => {
//         const uid = req.params.uid;
//         // @ts-ignore
//         const profile = req.session['profile'];
//         if(uid === "me" && !profile){
//             res.sendStatus(403);
//             return;
//         }
//
//         const userId = uid === "me" && profile ?
//             profile._id : uid;
//
//         LikeController.likeDao.findAllTuitsLikedByUser(userId)
//             .then(likes => {
//                 const likesNonNullTuits = likes.filter(like => like.tuit);
//                 const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
//                 res.json(tuitsFromLikes);
//             });
//     }
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is liking the tuit
//      * and the tuit being liked
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the new likes that was inserted in the
//      * database
//      */
//     userLikesTuit = (req: Request, res: Response) =>
//         LikeController.likeDao.userLikesTuit(req.params.uid, req.params.tid)
//             .then(likes => res.json(likes));
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is unliking
//      * the tuit and the tuit being unliked
//      * @param {Response} res Represents response to client, including status
//      * on whether deleting the like was successful or not
//      */
//     userUnlikesTuit = (req: Request, res: Response) =>
//         LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
//             .then(status => res.send(status));
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is liking the tuit
//      * and the tuit being liked
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the new likes that was inserted in the
//      * database
//      */
//     userTogglesTuitLikes = async (req: Request, res: Response) => {
//         const likeDao = LikeController.likeDao;
//         const tuitDao = LikeController.tuitDao;
//         const uid = req.params.uid;
//         const tid = req.params.tid;
//         // @ts-ignore
//         const profile = req.session['profile'];
//         if(uid === "me" && !profile){
//             res.sendStatus(403);
//             return;
//         }
//         const userId = uid === "me" && profile ?
//             profile._id : uid;
//         try {
//             const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
//             const howManyLikedTuit = await likeDao.countHowManyLikedTuit(tid);
//             let tuit = await tuitDao.findTuitById(tid);
//             if (userAlreadyLikedTuit) {
//                 await likeDao.userUnlikesTuit(userId, tid);
//                 tuit.stats.likes = howManyLikedTuit - 1;
//             } else {
//                 await LikeController.likeDao.userLikesTuit(userId, tid);
//                 tuit.stats.likes = howManyLikedTuit + 1;
//             };
//             await tuitDao.updateLikes(tid, tuit.stats);
//             res.sendStatus(200);
//         } catch (e) {
//             res.sendStatus(404);
//         }
//     }
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is liking the tuit
//      * and the tuit being liked
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the user likes the tuit
//      */
//     userAlreadyLikedTuit = (req: Request, res: Response) => {
//         const uid = req.params.uid;
//         const tid = req.params.tid;
//         // @ts-ignore
//         const profile = req.session['profile'];
//         if(uid === "me" && !profile){
//             res.sendStatus(403);
//             return;
//         }
//
//         const userId = uid === "me" && profile ?
//             profile._id : uid;
//         LikeController.likeDao.findUserLikesTuit(userId, tid)
//             .then((like) => res.json(like))
//     }
// };