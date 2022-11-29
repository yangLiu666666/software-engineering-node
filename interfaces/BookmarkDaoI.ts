import {Bookmark} from "../models/bookmarks/Bookmark";

export default interface BookmarkDaoI{
    userBookmarksTuit(uid: string, tid: string) : Promise<any>;
    userUnbookmarksTuit(uid: string, tid: string) : Promise<any>;
    findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]>;
    findAllBookmarks():Promise<Bookmark[]>;
}