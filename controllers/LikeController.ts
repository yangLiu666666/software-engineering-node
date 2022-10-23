import LikeControllerI from "../interfaces/LikeControllerI";
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";

/**
 * @class TuitController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /likes to retrieve all likes
 *     </li>
 *     <li>GET /users/:userid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /tuits/:tuitid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /users/:userid/likes/:tuitid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /users/:userid/likes/:tuitid to record that a user no longer likes a tuit
 *     </li>
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing likes CRUD operations
 * @property {LikeController} likeController Singleton controller implementing
 * RESTful Web service API
 */
export default class LikeController implements LikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static likeController: LikeController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return LikeController
     */
    public static getInstance = (app: Express): LikeController => {
        if (LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.get("/likes", LikeController.likeController.findAllLikes);
            app.get("/users/:userid/likes", LikeController.likeController.findAllTuitsLikedByUser);
            app.get("/tuits/:tuitid/likes", LikeController.likeController.findAllUsersLikedThatTuit);
            app.post("/users/:userid/likes/:tuitid", LikeController.likeController.userLikesTuit);
            app.delete("/users/:userid/likes/:tuitid", LikeController.likeController.userUnlikesTuit);
        }
        return LikeController.likeController;
    }

    /**
     * Retrieves all likes
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllLikes = (req: Request, res: Response) =>
        LikeController.likeDao.findAllLikes().then(likes => res.json(likes));

    /**
     * Retrieves all tuits liked by a user
     * @param {Request} req Represents request from client, including the path
     * parameter userid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = (req: Request, res: Response) =>
        LikeController.likeDao.findAllTuitsLikedByUser(req.params.uid)
            .then(likes => res.json(likes));

    /**
     * Retrieves all users that liked a tuit
     * @param {Request} req Represents request from client, including the path
     * parameter tuitid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects that likes the tuit
     */
    findAllUsersLikedThatTuit = (req: Request, res: Response) =>
        LikeController.likeDao.findAllUsersLikedThatTuit(req.params.tid)
            .then(likes => res.json(likes));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters userid and tid representing the user that is liking the tuit
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
     * path parameters userid and tuitid representing the user that is unliking
     * the tuit and the tuit being unliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     */
    userUnlikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));
};