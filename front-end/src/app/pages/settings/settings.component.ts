import { Component } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  public logout() {
    this.authenticationService.clearAccessToken();
    this.router.navigate(['/']);
  }
}
