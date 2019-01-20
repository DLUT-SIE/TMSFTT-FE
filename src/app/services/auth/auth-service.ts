import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';


/** This interface declares required methods for an authentication service. */
export interface AuthService {
    /** Indicate whether the current user is authenticated. */
    isAuthenticated: boolean;
    /** ID for authenticated user. */
    userID: number|null;
    /** Username for authenticated user. */
    username: string|null;
    /** Firstnam for authenticated user. */
    firstName: string|null;
    /** Lastname for authenticated user. */
    lastName: string|null;
    /**
     * Login user before retrieving JWT. This method will redirect user to
     * CAS authentication page.
     */
    login(): void;
    /**
     * Retrieve JWT by ticket, return an Observable of True and False to
     * indicate the validity of the JWT.
     */
    retrieveJWT(ticket: string, serviceURL: string): Observable<boolean>;
    /**
     * Verify the existing JWT. This method will try to load JWT from Storage
     * and request server to verify it. return and Observable of True and False
     * to indicate the validity of the JWT.
     */
    verifyJWT(): Observable<boolean>;
    /**
     * Refresh the existing JWT. This method will try to load JWT from Storage
     * and request server to refresh it with a new JWT. return and Observable
     * of True and False to indicate the validity of the JWT.
     */
    refreshJWT(): Observable<boolean>;
}

export const AUTH_SERVICE = new InjectionToken<AuthService>('AuthService');
