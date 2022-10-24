import FollowControllerI from "../interfaces/FollowControllerI";
import FollowDao from "../daos/FollowDao";
import {Express, Request, Response} from "express";
export default class FollowController implements FollowControllerI{
    private static followDao: FollowDao = FollowDao.getInstance();
    private static followController: FollowController | null = null;

    public static getInstance = (app: Express): FollowController => {
        if (FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.post("/users/:useridA/follows/:useridB", FollowController.followController.userFollowsUser);
            app.delete("/users/:useridA/follows/:useridB", FollowController.followController.userUnfollowsUser);
            app.get("/users/:userid/follows/", FollowController.followController.findAllFollowedByUsers);
            app.get("/follows/:userid", FollowController.followController.findAllFollowingUsers);
            app.get("/users/:userid/follows/", FollowController.followController.findAllFollowedByOther);
            app.get("/follows/:userid", FollowController.followController.findAllFollowingOfOther);
        }
        return FollowController.followController;
    }

    userFollowsUser = (req: Request, res: Response) =>
        FollowController.followDao.userFollowsUser(req.params.uidA, req.params.uidB)
            .then(follows => res.json(follows));

    userUnfollowsUser = (req: Request, res: Response) =>
        FollowController.followDao.userUnfollowsUser(req.params.uidA, req.params.uidB)
            .then(status => res.send(status));

    findAllFollowedByUsers = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollowedByUsers(req.params.uid)
            .then(follows => res.json(follows));

    findAllFollowingUsers = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollowingUsers(req.params.uid)
            .then(follows => res.json(follows));


    findAllFollowedByOther = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollowedByOther(req.params.uid)
            .then(follows => res.json(follows));


    findAllFollowingOfOther= (req: Request, res: Response) =>
        FollowController.followDao.findAllFollowingOfOther(req.params.uid)
            .then(follows => res.json(follows));
}

