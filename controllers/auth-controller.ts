/**
 * @file Controller RESTful web service API for authentication services
 */
import {Express, NextFunction, Response} from "express";
import {UserDao} from "../daos/UserDao";
import {
    DuplicateUserError,
    IncorrectCredentialError,
    NoSuchUserError,
    NoUserLoggedInError
} from "../error_handlers/CustomErrors";

const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * Implements RESTful Web service API for authentication services
 * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
 * @property {AuthController} authController Singleton controller implementing RESTful web service API
 */
export class AuthController {

    private static userDao: UserDao = UserDao.getInstance();
    private static authController: AuthController | null = null;

    /**
     * Creates singleton controller instance.
     * @param {Express} app Express instance to declare the RESTful web service API
     * @returns {AuthController} Singleton controller
     */
    public static getInstance = (app: Express) => {
        if (AuthController.authController === null) {
            AuthController.authController = new AuthController();
            app.get("/api/auth/profile", AuthController.authController.profile);
            app.post("/api/auth/signup", AuthController.authController.signup);
            app.post("/api/auth/logout", AuthController.authController.logout);
            app.post("/api/auth/login", AuthController.authController.login);
        }
        return AuthController.authController;
    }

    /**
     * Creates a new user with the provided username and password and automatically logs in the user.
     * @param {any} req Represents request from the client, including body contains data of the new user object
     * @param {Response} res Represents response to the client, including the newly created user data with password
     * musked
     * @param {NextFunction} next Error handling function
     */
    signup = async (req: any, res: Response, next: NextFunction) => {
        const newUser = req.body;
        const password = newUser.password;
        newUser.password = await bcrypt.hash(password, saltRounds);
        const existingUser = await AuthController.userDao.findUserByName(newUser.username);
        if (existingUser) {
            next(new DuplicateUserError());
        } else {
            const insertedUser = await AuthController.userDao.createUser(newUser);
            insertedUser.password = "";
            req.session["profile"] = insertedUser;
            res.json(insertedUser);
        }
    }

    /**
     * Gets the logged-in user's profile
     * @param {any} req Represents request from the client
     * @param {Response} res Represents response to the client, including the logged-in user's profile if exists
     * @param {NextFunction} next Error handling function
     */
    profile = (req: any, res: Response, next: NextFunction) => {
        const profile = req.session["profile"];
        if (profile) {
            profile.password = "";
            res.json(profile);
        } else {
            next(new NoUserLoggedInError());
        }
    }

    /**
     * Logs out the currently logged-in user and clears the session
     * @param {any} req Represents request from the client
     * @param {Response} res Represents response to the client
     */
    logout = (req: any, res: Response) => {
        req.session.destroy();
        res.sendStatus(200);
    }

    /**
     * Logs in the user and creates session for the user
     * @param {any} req Represents request from the client, including body contains data of the user object
     * @param {Response} res Represents response to the client, including the user's data with password musked
     * @param {NextFunction} next Error handling function
     */
    login = async (req: any, res: Response, next: NextFunction) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await AuthController.userDao.findUserByName(username);
        if (!existingUser) {
            next(new NoSuchUserError());
        } else {
            const match = await bcrypt.compare(password, existingUser.password);
            if (match) {
                existingUser.password = "******";
                req.session["profile"] = existingUser;
                res.json(existingUser);
            } else {
                next(new IncorrectCredentialError())
            }
        }
    }

}



// /**
//  * @file Controller RESTful web service API for authentication services
//  */
// import {Express, NextFunction, Response} from "express";
// import UserDao from "../daos/UserDao";
// import {
//     DuplicateUserError,
//     IncorrectCredentialError,
//     NoSuchUserError,
//     NoUserLoggedInError
// } from "../error_handlers/CustomErrors";
//
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
//
// /**
//  * Implements RESTful Web service API for authentication services
//  * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
//  * @property {AuthController} authController Singleton controller implementing RESTful web service API
//  */
// export class AuthController {
//
//     private static userDao: UserDao = UserDao.getInstance();
//     private static authController: AuthController | null = null;
//
//     /**
//      * Creates singleton controller instance.
//      * @param {Express} app Express instance to declare the RESTful web service API
//      * @returns {AuthController} Singleton controller
//      */
//     public static getInstance = (app: Express) => {
//         if (AuthController.authController === null) {
//             AuthController.authController = new AuthController();
//             app.get("/api/auth/profile", AuthController.authController.profile);
//             app.post("/api/auth/signup", AuthController.authController.signup);
//             app.post("/api/auth/logout", AuthController.authController.logout);
//             app.post("/api/auth/login", AuthController.authController.login);
//         }
//         return AuthController.authController;
//     }
//
//     /**
//      * Creates a new user with the provided username and password and automatically logs in the user.
//      * @param {any} req Represents request from the client, including body contains data of the new user object
//      * @param {Response} res Represents response to the client, including the newly created user data with password
//      * musked
//      * @param {NextFunction} next Error handling function
//      */
//     signup = async (req: any, res: Response, next: NextFunction) => {
//         const newUser = req.body;
//         const password = newUser.password;
//         newUser.password = await bcrypt.hash(password, saltRounds);
//         const existingUser = await AuthController.userDao.findUserByUsername(newUser.username);
//         if (existingUser) {
//             next(new DuplicateUserError());
//         } else {
//             const insertedUser = await AuthController.userDao.createUser(newUser);
//             insertedUser.password = "";
//             req.session["profile"] = insertedUser;
//             res.json(insertedUser);
//         }
//     }
//
//     /**
//      * Gets the logged-in user's profile
//      * @param {any} req Represents request from the client
//      * @param {Response} res Represents response to the client, including the logged-in user's profile if exists
//      * @param {NextFunction} next Error handling function
//      */
//     profile = (req: any, res: Response, next: NextFunction) => {
//         const profile = req.session["profile"];
//         if (profile) {
//             profile.password = "";
//             res.json(profile);
//         } else {
//             next(new NoUserLoggedInError());
//         }
//     }
//
//     /**
//      * Logs out the currently logged-in user and clears the session
//      * @param {any} req Represents request from the client
//      * @param {Response} res Represents response to the client
//      */
//     logout = (req: any, res: Response) => {
//         req.session.destroy();
//         res.sendStatus(200);
//     }
//
//     /**
//      * Logs in the user and creates session for the user
//      * @param {any} req Represents request from the client, including body contains data of the user object
//      * @param {Response} res Represents response to the client, including the user's data with password musked
//      * @param {NextFunction} next Error handling function
//      */
//     login = async (req: any, res: Response, next: NextFunction) => {
//         const user = req.body;
//         const username = user.username;
//         const password = user.password;
//         const existingUser = await AuthController.userDao.findUserByUsername(username);
//         if (!existingUser) {
//             next(new NoSuchUserError());
//         } else {
//             const match = await bcrypt.compare(password, existingUser.password);
//             if (match) {
//                 existingUser.password = "******";
//                 req.session["profile"] = existingUser;
//                 res.json(existingUser);
//             } else {
//                 next(new IncorrectCredentialError())
//             }
//         }
//     }
// }

// import {Request, Response, Express} from "express";
// import UserDao from "../daos/UserDao";
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
//
// const AuthenticationController = (app: Express) => {
//
//     const userDao: UserDao = UserDao.getInstance();
//
//     const login = async (req: Request, res: Response) => {
//         const user = req.body;
//         const username = user.username;
//         const password = user.password;
//
//         const existingUser = await userDao
//             .findUserByUsername(username);
//
//         if (!existingUser) {
//             res.sendStatus(403);
//             return;
//         }
//         const match = await bcrypt.compare(password, existingUser.password);
//
//         if (match) {
//             existingUser.password = '*****';
//             // @ts-ignore
//             req.session['profile'] = existingUser;
//             res.json(existingUser);
//         } else {
//             res.sendStatus(403);
//         }
//     }
//
//     const register = async (req: Request, res: Response) => {
//         const newUser = req.body;
//         const password = newUser.password;
//         const hash = await bcrypt.hash(password, saltRounds);
//         newUser.password = hash;
//
//         const existingUser = await userDao
//             .findUserByUsername(req.body.username);
//         if (existingUser) {
//             res.sendStatus(403);
//             return;
//         } else {
//             const insertedUser = await userDao
//                 .createUser(newUser);
//             insertedUser.password = '';
//             // @ts-ignore
//             req.session['profile'] = insertedUser;
//             res.json(insertedUser);
//         }
//     }
//
//     const profile = (req: Request, res: Response) => {
//         // @ts-ignore
//         const profile = req.session['profile'];
//         if (profile) {
//             res.json(profile);
//         } else {
//             res.sendStatus(403);
//         }
//     }
//
//     const logout = (req: Request, res: Response) => {
//         // @ts-ignore
//         req.session.destroy();
//         res.sendStatus(200);
//     }
//
//     app.post("/api/auth/login", login);
//     app.post("/api/auth/register", register);
//     app.post("/api/auth/profile", profile);
//     app.post("/api/auth/logout", logout);
// }
//
// export default AuthenticationController;