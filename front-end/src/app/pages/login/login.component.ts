import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { StorageService } from 'src/app/services/storage/storage.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private apiService: ApiService, private toastr: ToastrService, private authenticationService: AuthenticationService, private storageService: StorageService, private router: Router) {
    if (storageService.getAccessToken() !== String(null)) {
      authenticationService.verifyJWT().then((data: any) => {
        if (data.role != null) {
          this.authenticationService.setRole(data.role);
          this.authenticationService.setAuthenticationStatus(true);
          this.router.navigate(['/dashboard']);
        }
      })
    }
  }

  public email: string = "";
  public password: string = "";

  public login() {
    this.apiService.login(this.email, this.password).then((data: any) => {
      this.toastr.success('Welcome back!', "", {
        positionClass: "toast-top-left"
      });

      this.storageService.setAccessToken(data.accessToken);
      this.authenticationService.setAuthenticationStatus(true);
      this.router.navigate(['/dashboard']);
    }).catch((err) => {
      console.error(err)
      this.toastr.error('Incorrect login credentials.', "", {
        positionClass: "toast-top-left"
      });
    });
  }

  public register() {
    this.apiService.register(this.email, this.password).then((data: any) => {
      this.toastr.success('Registered successfully!', "", {
        positionClass: "toast-top-left"
      });

      this.storageService.setAccessToken(data.accessToken);
      this.router.navigate(['/dashboard']);
    }).catch((err) => {
      console.error(err)
      this.toastr.error('An account already exists with this e-mail.', "", {
        positionClass: "toast-top-left"
      });
    });
  }
}
