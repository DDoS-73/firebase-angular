import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authJwtToken: string;

    constructor(private afAuth: AngularFireAuth) {
        afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);
    }
}
