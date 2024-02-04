import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserRoles } from '../model/user-roles';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;
    pictureUrl$: Observable<string | null>;
    roles$: Observable<UserRoles>;

    constructor(private afAuth: AngularFireAuth, private router: Router) {
        this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(status => !status));
        this.pictureUrl$ = this.afAuth.authState.pipe(map(user => user ? user.photoURL : null));
        this.roles$ = this.afAuth.idTokenResult.pipe(
            map(token => token.claims as UserRoles ?? {admin: false})
        );
    }

    logout(): void {
        this.afAuth.signOut();
        this.router.navigateByUrl('/login');
    }
}
