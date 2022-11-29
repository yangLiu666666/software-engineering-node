import {Tuit} from "../models/tuits/Tuit";
/**
 * @file Declares the TuitDao interface.
 */

export interface TuitDaoI {
    findAllTuits(): Promise<Tuit[]>;
    findTuitsByUser(uid: string): Promise<Tuit[]>;
    findTuitById(tid: string): Promise<Tuit | null>;
    createTuitByUser(uid: string, tuit: Tuit): Promise<Tuit>;
    updateTuit(tid: string, tuit: Tuit): Promise<any>;
    deleteTuit(tid: string): Promise<any>;
}

//
// /**
//  * @file Declares API for Tuits related data access object methods
//  */
// export default interface TuitDaoI {
//     findAllTuits (): Promise<Tuit[]>;
//     findAllTuitsByUser (uid: string): Promise<Tuit[]>;
//     findTuitById (tid: string): Promise<Tuit>;
//     createTuitByUser (uid: string, tuit: Tuit): Promise<Tuit>;
//     updateTuit (tid: string, tuit: Tuit): Promise<any>;
//     deleteTuit (tid: string): Promise<any>;
// };

