/**
 * @file Implements an Express Node HTTP server.
 */
import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import UserDao from "./daos/UserDao";
import TuitDao from "./daos/TuitDao";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";

var cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/fse');

const userDao = new UserDao();
const userController = new UserController(app, userDao);
const tuitDao = new TuitDao();
const tuitController = new TuitController(app, tuitDao);

function sayHello(req: Request, res: Response) {
    res.send('Hi from FSD1!!!')
}

const sayHello2 =(req: Request, res: Response) =>
    res.send('Hi from FSD 2!!!')
app.get('/', sayHello);

app.get('/hello', sayHello2);

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
