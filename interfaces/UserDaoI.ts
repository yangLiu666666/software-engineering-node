import {User} from "../models/users/User";

// export default interface UserDaoI {
//     findAllUsers (): Promise<User[]>;
//     findUserById (uid: string): Promise<any>;
//     createUser (user: User): Promise<User>;
//     updateUser (uid: string, user: User): Promise<any>;
//     deleteUser (uid: string): Promise<any>;
//     deleteAllUsers (): Promise<any>;
// };
/**
 * @file Declares the UserDao interface.
 */

export interface UserDaoI {
    findAllUsers(): Promise<User[]>;
    findUserById(uid: string): Promise<User | null>;
    findUserByName(uname: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string): Promise<any>;
    deleteUserByName(name: string): Promise<any>;
}