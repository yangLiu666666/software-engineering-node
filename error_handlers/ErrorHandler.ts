/**
 * @file Defines an error handler that handles all general errors.
 */
import {NextFunction, Request, Response} from "express";
import {NoSuchTuitError} from "./CustomErrors";

/**
 * Defines an error handler that handles all general errors that did not handled by the previous handlers.
 * @param {Error} err General error
 * @param {Request} req Represents the request from the client
 * @param {Response} res Represents the response to the client
 * @param {NextFunction} next Next error handling function
 */
export function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof NoSuchTuitError) {
        res.status(404).send(err.message);
    } else {
        res.status(403).send(err.message);
    }
}