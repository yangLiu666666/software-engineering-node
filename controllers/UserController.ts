/**
 * @file Controller RESTful web service API for users resource
 */
import {UserControllerI} from "../interfaces/UserControllerI";
import {UserDao} from "../daos/UserDao";
import {Express, NextFunction, Request, Response} from "express";

/**
 * Implements RESTful Web service API for users resource.
 * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
 * @property {UserController} userController Singleton controller implementing RESTful web service API
 */
export class UserController implements UserControllerI {

    private static userDao: UserDao = UserDao.getInstance();
    private static userController: UserController | null = null;

    /**
     * Creates singleton controller instance.
     * @param {Express} app Express instance to declare the RESTful web service API
     * @returns {UserController} Singleton controller
     */
    public static getInstance = (app: Express): UserController => {
        if (UserController.userController === null) {
            UserController.userController = new UserController();
            app.get("/api/users", UserController.userController.findAllUsers);
            app.get("/api/users/:userid", UserController.userController.findUserById);
            app.get("/api/users/username/:uname", UserController.userController.findUserByName);
            app.post("/api/users", UserController.userController.createUser);
            app.delete("/api/users/:userid", UserController.userController.deleteUser);
            app.put("/api/users/:userid", UserController.userController.updateUser);
            app.delete("/api/users/username/:name", UserController.userController.deleteUsersByUsername);
        }
        return UserController.userController;
    }

    private constructor() {}

    /**
     * Retrieves all users from the database.
     * @param {Request} req Represents request from the client
     * @param {Response} res Represents response to the client, including the body formatted
     * as JSON array containing the user objects
     */
    findAllUsers = (req: Request, res: Response) => {
        UserController.userDao.findAllUsers()
            .then(users => res.json(users));
    }

    /**
     * Retrieves the user object by its primary key.
     * @param {Request} req Represents request from the client, including path parameter uid
     * identifying the primary key of the user object
     * @param {Response} res Represents response to the client, including the body formatted
     * as JSON containing the user that matches the user ID
     * @param {NextFunction} next Error handling function
     */
    findUserById = (req: Request, res: Response, next: NextFunction) => {
        UserController.userDao.findUserById(req.params.userid)
            .then(user => res.json(user))
            .catch(next);
    }

    /**
     * Retrieves the user object by its username.
     * @param {Request} req Represents request from the client, including path parameter uid
     * identifying the username of the user object
     * @param {Response} res Represents response to the client, including the body formatted
     * as JSON containing the user that matches the username
     * @param {NextFunction} next Error handling function
     */
    findUserByName = (req: Request, res: Response, next: NextFunction) => {
        UserController.userDao.findUserByName(req.params.uname)
            .then(user => res.json(user))
            .catch(next);
    }

    /**
     * Creates a new user instance.
     * @param {Request} req, Represents request from the client, including body containing the
     * JSON object for the new user to be inserted in the database
     * @param {Response} res Represents response to the client, including the body formatted as JSON containing the
     * new user that was inserted into the database
     * @param {NextFunction} next Error handling function
     */
    createUser = (req: Request, res: Response, next: NextFunction) => {
        UserController.userDao.createUser(req.body)
            .then(user => res.json(user))
            .catch(next);
    }

    /**
     * Deletes a user instance from the database by its primary key.
     * @param {Request} req Represents request from the client, including the path parameter uid
     * identifying the primary key of the user to be deleted
     * @param {Response} res Represents response to the client, including status on
     * whether deleting was successful or not
     * @param {NextFunction} next Error handling function
     */
    deleteUser = (req: Request, res: Response, next: NextFunction) => {
        UserController.userDao.deleteUser(req.params.userid)
            .then(status => res.json(status))
            .catch(next);
    }

    /**
     * Modified an existing user instance.
     * @param {Request} req Represents request from the client, including the path parameter uid identifying
     * the primary key of the user, and the body containing properties with new values for the user
     * @param {Response} res Represents response to the client, including status on whether updating was
     * successful or not
     * @param next Error handling function
     */
    updateUser = (req: Request, res: Response, next: NextFunction) => {
        UserController.userDao.updateUser(req.params.userid, req.body)
            .then(status => res.json(status))
            .catch(next);
    }

    /**
     * Deletes a user from the database by the username
     * @param {Request} req Represents request from the client, including the path parameter name identifying
     * the username
     * @param {Response} res Represents response to the client, including status on whether deleting was
     * successful or not
     * @param next Error handling function
     */
    deleteUsersByUsername = (req: Request, res: Response, next: NextFunction) => {
        UserController.userDao.deleteUserByName(req.params.name)
            .then(status => res.json(status))
            .catch(next);
    }

}

// /**
//  * @file Controller RESTful Web service API for users resource
//  */
// import UserDao from "../daos/UserDao";
// import User from "../models/users/User";
// import {Express, Request, Response} from "express";
// import UserControllerI from "../interfaces/UserControllerI";
//
// /**
//  * @class UserController Implements RESTful Web service API for users resource.
//  * Defines the following HTTP endpoints:
//  * <ul>
//  *     <li>POST /api/users to create a new user instance</li>
//  *     <li>GET /api/users to retrieve all the user instances</li>
//  *     <li>GET /api/users/:uid to retrieve an individual user instance </li>
//  *     <li>PUT /api/users to modify an individual user instance </li>
//  *     <li>DELETE /api/users/:uid to remove a particular user instance</li>
//  * </ul>
//  * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
//  * @property {UserController} userController Singleton controller implementing
//  * RESTful Web service API
//  */
// export default class UserController implements UserControllerI {
//     private static userDao: UserDao = UserDao.getInstance();
//     private static userController: UserController | null = null;
//
//     /**
//      * Creates singleton controller instance
//      * @param {Express} app Express instance to declare the RESTful Web service
//      * API
//      * @returns UserController
//      */
//     public static getInstance = (app: Express): UserController => {
//         if(UserController.userController === null) {
//             UserController.userController = new UserController();
//
//             // RESTful User Web service API
//             app.get("/api/users",
//                 UserController.userController.findAllUsers);
//             app.get("/api/users/:uid",
//                 UserController.userController.findUserById);
//             app.post("/api/users",
//                 UserController.userController.createUser);
//             app.put("/api/users/:uid",
//                 UserController.userController.updateUser);
//             app.delete("/api/users/:uid",
//                 UserController.userController.deleteUser);
//             app.delete("/api/users",
//                 UserController.userController.deleteAllUsers);
//
//             app.post("/api/login",
//                 UserController.userController.login);
//
//             // for testing. Not RESTful
//             app.get("/api/users/create",
//                 UserController.userController.createUser);
//             app.get("/api/users/id/:uid/delete",
//                 UserController.userController.deleteUser);
//             app.get("/api/users/username/:username/delete",
//                 UserController.userController.deleteUsersByUsername);
//             app.get("/api/users/delete",
//                 UserController.userController.deleteAllUsers);
//         }
//         return UserController.userController;
//     }
//
//     private constructor() {}
//
//     /**
//      * Retrieves all users from the database and returns an array of users.
//      * @param {Request} req Represents request from client
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON arrays containing the user objects
//      */
//     findAllUsers = (req: Request, res: Response) =>
//         UserController.userDao.findAllUsers()
//             .then((users: User[]) => res.json(users));
//
//     /**
//      * Retrieves the user by their primary key
//      * @param {Request} req Represents request from client, including path
//      * parameter uid identifying the primary key of the user to be retrieved
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the user that matches the user ID
//      */
//     findUserById = (req: Request, res: Response) =>
//         UserController.userDao.findUserById(req.params.uid)
//             .then((user: User) => res.json(user));
//
//     /**
//      * Creates a new user instance
//      * @param {Request} req Represents request from client, including body
//      * containing the JSON object for the new user to be inserted in the
//      * database
//      * @param {Response} res Represents response to client, including the
//      * body formatted as JSON containing the new user that was inserted in the
//      * database
//      */
//     createUser = (req: Request, res: Response) =>
//         UserController.userDao.createUser(req.body)
//             .then((user: User) => res.json(user));
//
//     /**
//      * Modifies an existing user instance
//      * @param {Request} req Represents request from client, including path
//      * parameter uid identifying the primary key of the user to be modified
//      * @param {Response} res Represents response to client, including status
//      * on whether updating a user was successful or not
//      */
//     updateUser = (req: Request, res: Response) =>
//         UserController.userDao.updateUser(req.params.uid, req.body)
//             .then((status) => res.send(status));
//
//     /**
//      * Removes a user instance from the database
//      * @param {Request} req Represents request from client, including path
//      * parameter uid identifying the primary key of the user to be removed
//      * @param {Response} res Represents response to client, including status
//      * on whether deleting a user was successful or not
//      */
//     deleteUser = (req: Request, res: Response) =>
//         UserController.userDao.deleteUser(req.params.uid)
//             .then((status) => res.send(status));
//
//     /**
//      * Removes all user instances from the database. Useful for testing
//      * @param {Request} req Represents request from client
//      * @param {Response} res Represents response to client, including status
//      * on whether deleting all users was successful or not
//      */
//     deleteAllUsers = (req: Request, res: Response) =>
//         UserController.userDao.deleteAllUsers()
//             .then((status) => res.send(status));
//
//     deleteUsersByUsername = (req: Request, res: Response) =>
//         UserController.userDao.deleteUsersByUsername(req.params.username)
//             .then(status => res.send(status));
//
//     login = (req: Request, res: Response) =>
//         UserController.userDao
//             .findUserByCredentials(req.body.username, req.body.password)
//             .then(user => {
//                 res.json(user)
//             });
//
//     register = (req: Request, res: Response) =>
//         UserController.userDao.findUserByUsername(req.body.username)
//             .then(user => {
//
//             })
// };
