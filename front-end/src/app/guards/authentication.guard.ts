import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard  {
  constructor(private authenticationService: AuthenticationService, private router: Router) { };

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isAuth : any = await this.authenticationService.verifyJWT();
    if(isAuth.role == undefined) {
      this.router.navigate(['/']);
      return false;
    } else {
      this.authenticationService.setRole(isAuth.role);
      this.authenticationService.setAuthenticationStatus(true);
      return true;
    }
  }
}
