/**
 * @file Implements an Express Node HTTP server. Declares RESTful web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 *     <li>bookmarks</li>
 *     <li>messages</li>
 *     <li>follows</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database service.
 */
import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import {config} from "dotenv";
import {TuitController} from "./controllers/TuitController";
import {UserController} from "./controllers/UserController";
import {LikeController} from "./controllers/LikeController";
import FollowController from "./controllers/FollowController";
import BookmarkController from "./controllers/BookmarkController";
import MessageController from "./controllers/MessageController";
import cors from "cors";
import {AuthController} from "./controllers/auth-controller";
import {DislikeController} from "./controllers/DislikeController";

const app = express();
const cors = require('cors');
const session = require("express-session");


const corsOptions ={
    origin:true,
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());

// build the connection string
const url='mongodb+srv://yangliu:yl8596221YL!@tuitproject.vfnfs4p.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(url)
// mongoose.connect('mongodb://localhost:27017/tuiter');



let sess = {
    secret: process.env.SESSION_SECRET || 'Super Secret (change it)',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: true,
        resave: true,
        sameSite: 'none'
    }
}

app.set('trust proxy', 1) // trust first proxy


app.use(session(sess))


app.get('/', (req: Request, res: Response) =>
    res.send('Welcome!'));



// create RESTful Web service API
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likesController = LikeController.getInstance(app);
const dislikeController = DislikeController.getInstance(app);
const messageController = MessageController.getInstance(app);
const followController = FollowController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);
const authController = AuthController.getInstance(app);

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);

// /**
//  * @file Implements an Express Node HTTP server.
//  */
// import express, {Request, Response} from 'express';
// import mongoose from "mongoose";
// import UserController from "./controllers/UserController";
// import TuitController from "./controllers/TuitController";
// import LikeController from "./controllers/LikeController";
// import FollowController from "./controllers/FollowController";
// import MessageController from "./controllers/MessageController";
// import BookmarkController from "./controllers/BookmarkController";
// import DislikeController from "./controllers/DislikeController";
// import AuthenticationController from "./controllers/auth-controller";
// require('dotenv').config();
// const cors = require('cors');
// const session = require("express-session");
//
// // mongoose.connect('mongodb://localhost:27017/fse');
// mongoose.connect('mongodb+srv://yangliu:yl8596221YL!@tuitproject.vfnfs4p.mongodb.net/?retryWrites=true&w=majority');
//
// const app = express();
//
// app.use(cors({
//         credentials: true,
//         origin:true
//     }));
//
// let sess = {
//     secret: process.env.SECRET,
//     cookie: {
//         secure: false
//     },
//     resave: true,
//     saveUninitialized: true
// }
//
// if (process.env.ENV === 'PRODUCTION') {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = true // serve secure cookies
// }
//
// app.use(session(sess));
// app.use(express.json());
//
//
// const userController = UserController.getInstance(app);
// const tuitController = TuitController.getInstance(app);
// const likeController = LikeController.getInstance(app);
// const messageController = MessageController.getInstance(app);
// const followController = FollowController.getInstance(app);
// const bookmarkController = BookmarkController.getInstance(app);
// const dislikeController = DislikeController.getInstance(app);
// AuthenticationController(app);
//
// app.get('/', (req: Request, res: Response) =>
//     res.send('Hi from FSD1!!!'));
// app.get('/hello', (req: Request, res: Response) =>
//     res.send('Hi from FSD2!!!'));
//
// /**
//  * Start a server listening at port 4000 locally
//  * but use environment variable PORT on Heroku if available.
//  */
// const PORT = 4000;
// app.listen(process.env.PORT || PORT);
