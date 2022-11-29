import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import {Bookmark} from "../models/bookmarks/Bookmark";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";

export default class BookmarkDao implements BookmarkDaoI{
    private static bookmarkDao: BookmarkDao | null = null;

    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }

    async findAllBookmarks(): Promise<Bookmark[]> {
        return await BookmarkModel.find();
    }

    async userBookmarksTuit(uid: string, tid: string): Promise<any> {
        return await BookmarkModel.create({bookmarkedTuit: tid, bookmarkedBy: uid});
    }

    async userUnbookmarksTuit(uid: string, tid: string): Promise<any> {
        return await BookmarkModel.deleteOne({bookmarkedTuit: tid, bookmarkedBy: uid});
    }

    async findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]> {
        return await BookmarkModel.find({bookmarkedBy:uid}).populate("bookmarkedTuit").exec();
    }
}