/**
 * An error class for "user does not exist" error
 */
export class NoSuchUserError extends Error {

    constructor() {
        super("No such user.");
    }

}

/**
 * An error class for "tuit does not exist" error
 */
export class NoSuchTuitError extends Error {
    constructor() {
        super("No such tuit.");
    }

}

/**
 * An error class for "no user is logged in" error
 */
export class NoUserLoggedInError extends Error {

    constructor() {
        super("No user is logged in.");
    }

}

/**
 * An error class for "user already exists" error
 */
export class DuplicateUserError extends Error {

    constructor() {
        super("User already exists.");
    }

}

/**
 * An error class for "username and password do not match" error
 */
export class IncorrectCredentialError extends Error {

    constructor() {
        super("Username and password do not match.");
    }

}

/**
 * An error class for "tuit has empty content" error
 */
export class EmptyTuitError extends Error {

    constructor() {
        super("Empty tuit content");
    }

}

/**
 * An interface for mongoose errors
 */
export interface DBError extends Error {
    code: number;
    keyValue: object;
    path: string;
    value: string;
}