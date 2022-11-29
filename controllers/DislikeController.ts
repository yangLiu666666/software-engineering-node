/**
 * @file Controller RESTful web service API for dislikes resource
 */
import {DislikeControllerI} from "../interfaces/DislikeControllerI";
import {Express, NextFunction, Request, Response} from "express";
import {DislikeDao} from "../daos/DislikeDao";
import {NoUserLoggedInError} from "../error_handlers/CustomErrors";

/**
 * Implements RESTful Web service API for dislikes resource.
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislike CRUD operations
 * @property {DislikeController} dislikeController Singleton controller implementing RESTful web service API
 */
export class DislikeController implements DislikeControllerI {

    private static dislikeController: DislikeController | null = null;
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();

    /**
     * Creates singleton controller instance.
     * @param {Express} app Express instance to declare the RESTful web service API
     * @returns {DislikeController} Singleton controller
     */
    public static getInstance = (app: Express) => {
        if (DislikeController.dislikeController == null) {
            DislikeController.dislikeController = new DislikeController();
            app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.findUserDislikedTuit);
            app.get("/api/dislikes", DislikeController.dislikeController.findAllDislikes);
            app.post("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userUnlikesTuit);
            app.delete("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userLikesTuit);
            app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
        }
        return DislikeController.dislikeController;
    }

    /**
     * Handles dislike record when user likes a tuit.
     * @param {Request} req Represents request from the client, including the user's id and the tuit's id
     * @param {Response} res Represents response to the client, including the operation status
     * @param {NextFunction} next Error handling function
     */
    userLikesTuit = (req: Request, res: Response, next: NextFunction): void => {
        DislikeController.dislikeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then((status) => res.json(status))
            .catch(next);
    }

    /**
     * Creates a dislike record.
     * @param {Request} req Represents request from the client, including the user's id and the tuit's id
     * @param {Response} res Represents response to the client, including the dislike data
     * @param {NextFunction} next Error handling function
     */
    userUnlikesTuit = (req: Request, res: Response, next: NextFunction):void => {
        DislikeController.dislikeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then((dislike) => res.json(dislike))
            .catch(next);
    }

    /**
     * Retrieves all dislike records.
     * @param {Request} req Represents request from the client
     * @param {Response} res Represents response to the client, including all dislike records formatted as JSON object
     */
    findAllDislikes = (req: Request, res: Response): void => {
        DislikeController.dislikeDao.findAllDislikes()
            .then((dislikes) => res.json(dislikes));
    }

    /**
     * Finds "user dislikes a tuit" record.
     * @param {Request} req Represents request from the client, including the user's id and the tuit's id
     * @param {Response} res Represents response to the client, including the dislike record if exists
     * @param {NextFunction} next Error handling function
     */
    findUserDislikedTuit = (req: any, res: Response, next: NextFunction): void => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session["profile"];
        if (uid === "me" && !profile) {
            next(new NoUserLoggedInError());
            return
        }
        const userId = uid === "me" ? profile._id : uid;
        DislikeController.dislikeDao.findUserDislikedTuit(userId, tid)
            .then((dislike) => res.json(dislike))
            .catch(next);
    }

    /**
     * Finds all tuits disliked by the user.
     * @param {Request} req Represents request from the client, including the user's id
     * @param {Response} res Represents response to the client, including all the tuits disliked by the user
     * formatted as JSON object
     * @param {NextFunction} next Error handling function
     */
    findAllTuitsDislikedByUser = (req: any, res: Response, next: NextFunction): void => {
        const uid = req.params.uid;
        const profile = req.session["profile"];
        if (uid === "me" && !profile) {
            next(new NoUserLoggedInError());
            return
        }
        const userId = uid === "me" ? profile._id : uid;
        DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then((dislikes) => {
                const tuits = dislikes.map((dislike) => {
                    return dislike.tuit;
                });
                res.json(tuits);
            }).catch(next)
    }

}
// /**
//  * @file Controller RESTful Web service API for dislikes resource
//  */
// import {Express, Request, Response} from "express";
// import TuitDao from "../daos/TuitDao";
// import DislikeControllerI from "../interfaces/DislikeControllerI";
// import DislikeDao from "../daos/DislikeDao";
//
// /**
//  * @class DislikeController Implements RESTful Web service API for dislikes resource.
//  * Defines the following HTTP endpoints:
//  * <ul>
//  *     <li>GET /api/users/:uid/dislikes to retrieve all the tuits disliked by a user</li>
//  *     <li>GET /api/tuits/:tid/dislikes to retrieve all users that disliked a tuit</li>
//  *     <li>POST /api/users/:uid/dislikes/:tid to record that a user dislikes a tuit</li>
//  *     <li>DELETE /api/users/:uid/undislikes/:tid to record that a user no longer dislikes a tuit</li>
//  *     <li>PUT /api/users/:uid/dislikes/:tid to record that a user dislikes a tuit
//  *     </li>
//  * </ul>
//  * @property {DislikeDao} DislikeDao Singleton DAO implementing likes CRUD operations
//  * @property {DislikeController} DislikeController Singleton controller implementing
//  * RESTful Web service API
//  */
// export default class DislikeController implements DislikeControllerI {
//     private static dislikeDao: DislikeDao = DislikeDao.getInstance();
//     private static tuitDao: TuitDao = TuitDao.getInstance();
//     private static dislikeController: DislikeController | null = null;
//     /**
//      * Creates singleton controller instance
//      * @param {Express} app Express instance to declare the RESTful Web service
//      * API
//      * @return LikeController
//      */
//     public static getInstance = (app: Express): DislikeController => {
//         if(DislikeController.dislikeController === null) {
//             DislikeController.dislikeController = new DislikeController();
//             app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
//             app.get("/api/tuits/:tid/dislikes", DislikeController.dislikeController.findAllUsersThatDislikedTuit);
//             app.post("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userDislikesTuit);
//             app.delete("/api/users/:uid/undislikes/:tid", DislikeController.dislikeController.userUndislikesTuit);
//             app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesTuitDislikes);
//             app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userAlreadyDislikedTuit);
//         }
//         return DislikeController.dislikeController;
//     }
//
//     private constructor() {}
//
//     /**
//      * Retrieves all users that Disliked a tuit from the database
//      * @param {Request} req Represents request from client, including the path
//      * parameter tid representing the Disliked tuit
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON arrays containing the user objects
//      */
//     findAllUsersThatDislikedTuit = (req: Request, res: Response) =>
//         DislikeController.dislikeDao.findAllUsersThatDislikedTuit(req.params.tid)
//             .then(Dislikes => res.json(Dislikes));
//
//     /**
//      * Retrieves all tuits Disliked by a user from the database
//      * @param {Request} req Represents request from client, including the path
//      * parameter uid representing the user Disliked the tuits
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON arrays containing the tuit objects that were Disliked
//      */
//     findAllTuitsDislikedByUser = (req: Request, res: Response) => {
//         const uid = req.params.uid;
//         // @ts-ignore
//         const profile = req.session['profile'];
//         if(uid === "me" && !profile){
//             res.sendStatus(403);
//             return;
//         }
//         const userId = uid === "me" && profile ?
//             profile._id : uid;
//
//         DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
//             .then(dislikes => {
//                 const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
//                 const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
//                 res.json(tuitsFromDislikes);
//             });
//     }
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is liking the tuit
//      * and the tuit being Disliked
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the new Dislikes that was inserted in the
//      * database
//      */
//     userDislikesTuit = (req: Request, res: Response) =>
//         DislikeController.dislikeDao.userDislikesTuit(req.params.uid, req.params.tid)
//             .then(Dislikes => res.json(Dislikes));
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is disliking the tuit
//      * and the tuit being liked
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the user dislikes the tuit
//      */
//
//     userAlreadyDislikedTuit = (req: Request, res: Response)=> {
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
//         DislikeController.dislikeDao.findUserDislikesTuit(userId, tid)
//             .then((dislike) => res.json(dislike))
//     }
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is unliking
//      * the tuit and the tuit being unDisliked
//      * @param {Response} res Represents response to client, including status
//      * on whether deleting the Dislike was successful or not
//      */
//     userUndislikesTuit = (req: Request, res: Response) =>
//         DislikeController.dislikeDao.userUndislikesTuit(req.params.uid, req.params.tid)
//             .then(status => res.send(status));
//
//     /**
//      * @param {Request} req Represents request from client, including the
//      * path parameters uid and tid representing the user that is disliking
//      * the tuit and the tuit being disliked
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the new Dislikes that was inserted in the
//      * database
//      */
//     userTogglesTuitDislikes = async (req: Request, res: Response) => {
//         const dislikeDao = DislikeController.dislikeDao;
//         const tuitDao = DislikeController.tuitDao;
//         const uid = req.params.uid;
//         const tid = req.params.tid;
//
//         // @ts-ignore
//         const profile = req.session['profile'];
//         if(uid === "me" && !profile){
//             res.sendStatus(403);
//             return;
//         }
//         const userId = uid === "me" && profile ?
//             profile._id : uid;
//         try {
//             const userAlreadyDislikedTuit = await dislikeDao.findUserDislikesTuit(userId, tid);
//             const howManyDislikedTuit = await dislikeDao.countHowManyDislikedTuit(tid);
//             let tuit = await tuitDao.findTuitById(tid);
//             if (userAlreadyDislikedTuit) {
//                 await dislikeDao.userUndislikesTuit(userId, tid);
//                 tuit.stats.dislikes = howManyDislikedTuit - 1;
//             } else {
//                 await DislikeController.dislikeDao.userDislikesTuit(userId, tid);
//                 tuit.stats.dislikes = howManyDislikedTuit + 1;
//             };
//             await tuitDao.updateDislikes(tid, tuit.stats);
//             res.sendStatus(200);
//         } catch (e) {
//             res.sendStatus(404);
//         }
//     }
// };