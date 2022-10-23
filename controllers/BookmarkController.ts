import BookmarkControllerI from "../interfaces/BookmarkControllerI";
import BookmarkDao from "../daos/BookmarkDao";
import {Express, Request, Response} from "express";

export default class BookmarkController implements BookmarkControllerI{
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.post("/users/:userid/bookmarks/:tuitid", BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete("/users/:userid/unbookmarks/:tuitid", BookmarkController.bookmarkController.userUnbookmarksTuit);
            app.get("/users/:userid/bookmarks", BookmarkController.bookmarkController.findAllTuitsBookmarkedByUser);
            app.get("/users/:userid/bookmarks", BookmarkController.bookmarkController.findAllTuitsBookmarkedByOther);
        }
        return BookmarkController.bookmarkController;
    }
    userBookmarksTuit  = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    userUnbookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnbookmarksTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    findAllTuitsBookmarkedByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(req.params.uid)
            .then(bookmarks => res.json(bookmarks));

    findAllTuitsBookmarkedByOther = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByOther(req.params.uid)
            .then(bookmarks => res.json(bookmarks));
}