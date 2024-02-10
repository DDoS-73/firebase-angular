import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.auth.authJwtToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', this.auth.authJwtToken)
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }

}
