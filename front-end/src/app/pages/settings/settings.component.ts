import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage/storage.service';
import { ApiService } from 'src/app/services/api/api.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  subscanApiKey = "";
  
  constructor(private storageService: StorageService, private router: Router, private apiService: ApiService, private toastr: ToastrService) {}

  updateApiKey() {
    this.apiService.setSubscanApiKey(this.subscanApiKey).then((data) => {
      this.toastr.success('API key updated', "", {
        positionClass: "toast-top-left"
      });
    }).catch((err) => {
      this.toastr.error('Unable to update key', "", {
        positionClass: "toast-top-left"
      });
    });
  }

  public logout() {
    this.storageService.clearAccessToken();
    this.router.navigate(['/']);
  }
}
