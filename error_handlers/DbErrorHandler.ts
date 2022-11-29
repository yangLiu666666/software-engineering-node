/**
 * @file Defines an error handler that handles only database related errors.
 */
import {NextFunction, Request, Response} from "express";
import {DBError} from "./CustomErrors";

/**
 * Defines an error handler that handles database errors like "ValidationError" and "CastError", and passes
 * the request to the next handling function.
 * @param {DBError} err Database related errors
 * @param {Request} req Represents the request from the client
 * @param {Response} res Represents the response to the client
 * @param {NextFunction} next Next error handling function
 */
export function DbErrorHandler(err: DBError, req: Request, res: Response, next: NextFunction) {
    if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(403).send(err.message);
    } else if (err.code === 11000) {
        res.status(403).send(`${Object.keys(err.keyValue)[0]}: ${Object.values(err.keyValue)[0]} already exists.`);
    } else {
        next(err);
    }
}