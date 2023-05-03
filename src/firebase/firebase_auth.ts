import {
    Auth,
    User,
    Unsubscribe,
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { app } from "./firebase";
import { useEffect, useState } from "react";

let auth: Auth;
let googleProvider: GoogleAuthProvider;
let currentUser: User | null;

export function auth_Initialize() {
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    auth.useDeviceLanguage();

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
    });
}

/**
 * Hook a state dispatcher onto login change events
 * @param stateDispatcher The state dispatcher to attach
 * @returns An unsubscribe function to clean up when done
 * @deprecated useLoggedInUser()
 */
export function auth_HookUserState(
    stateDispatcher: React.Dispatch<React.SetStateAction<User | null>>
): Unsubscribe {
    return onAuthStateChanged(auth, (user) => {
        stateDispatcher(user);
    });
}

/**
 * React Hook to get the currently logged in user
 * @returns A state variable containing the logged in user
 */
export function useLoggedInUser(): User | null {
    const [user, setUser] = useState<User | null>(currentUser);
    useEffect(() => onAuthStateChanged(auth, setUser), []);
    return user;
}

/**
 * Hook a receiver onto login change events
 * @param receiver The function to attach
 * @returns An unsubscribe function to clean up when done
 */
export function auth_HookUser(
    receiver: (user: User | null) => void
): Unsubscribe {
    return onAuthStateChanged(auth, (user) => {
        receiver(user);
    });
}

/**
 * Get the current logged in user
 * @returns The user or null if not logged in
 */
export function auth_GetCurrentUser(): User | null {
    return currentUser;
}

/**
 * Create a user
 * @param email The users email
 * @param password The users password
 * @returns A Promise that resolves with the new logged in user, or rejects if an error occurred
 */
export function auth_CreateUser(
    email: string,
    password: string
): Promise<User> {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                resolve(userCredential.user);
            })
            .catch((error) => {
                reject(error.message);
            });
    });
}

/**
 * Sign in a user
 * @param email The users email
 * @param password The users password
 * @returns A Promise that resolves with the new logged in user, or rejects if an error occurred
 */
export function auth_SignIn(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) =>
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                resolve(userCredential.user);
            })
            .catch((error) => {
                reject(error.message);
            })
    );
}

/**
 * Sign in with Google (opens a popup window)
 * @returns A Promise that resolves with the new logged in user, or rejects if an error occurred
 */
export function auth_GoogleSignIn(): Promise<User> {
    return new Promise((resolve, reject) =>
        signInWithPopup(auth, googleProvider)
            .then((userCredential) => resolve(userCredential.user))
            .catch((error) => {
                reject(error.message);
            })
    );
}

/**
 * Sign out the current logged in user (if any)
 */
export function auth_SignOut() {
    signOut(auth);
}
