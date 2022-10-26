import {Request, Response, Express} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/TuitControllerI";

export default class TuitController implements TuitControllerI {
    app: Express;
    tuitDao: TuitDao;
    constructor(app: Express, TuitDao: TuitDao) {
        this.app = app;
        this.tuitDao = TuitDao;
        this.app.get('/api/tuits', this.findAllTuits);
        this.app.get('/api/tuits/:tid', this.findTuitById);
        this.app.get('/api/tuits/:uid', this.findTuitsByUser);
        this.app.post('/api/users/:uid/tuits', this.createTuit);
        this.app.delete('/api/tuits/:tid', this.deleteTuit);
        this.app.put('/api/tuits/:tid', this.updateTuit);
    }
    findAllTuits = (req: Request, res: Response) =>
        this.tuitDao.findAllTuits()
            .then(tuits => res.json(tuits));

    findTuitById = (req: Request, res: Response) =>
        this.tuitDao.findTuitById(req.params.tuitid)
            .then(tuit => res.json(tuit));

    findTuitsByUser = (req: Request, res: Response) =>
        this.tuitDao.findTuitsByUser(req.params.userid)
            .then(tuit => res.json(tuit));

    createTuit = (req: Request, res: Response) =>
        this.tuitDao.createTuit(req.body)
            .then(tuit => res.json(tuit));
    deleteTuit = (req: Request, res: Response) =>
        this.tuitDao.deleteTuit(req.params.tuitid)
            .then(status => res.json(status));

    updateTuit = (req: Request, res: Response) =>
        this.tuitDao.updateTuit(req.params.tuitid, req.body)
            .then(status => res.json(status));
}