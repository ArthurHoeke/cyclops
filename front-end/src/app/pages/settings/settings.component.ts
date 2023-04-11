import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage/storage.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ApiService } from 'src/app/services/api/api.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  subscanApiKey = "";
  public base64Preview: any = "";

  public networkList: any = null;
  
  constructor(private storageService: StorageService, private router: Router, private apiService: ApiService, private toastr: ToastrService, private dashboardService: DashboardService) {
    this.fetchNetworkList();
  }

  async fetchNetworkList() {
    await this.apiService.getNetworks().then((data: any) => {
      this.networkList = data['data'];
    });
  }

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

  public async submitNetwork(name: string, ticker: string, icon: string, decimals: string, modal: HTMLDivElement) {
    if (name != "" && ticker != "" && icon != "" && decimals != "") {
      this.apiService.addNetwork(name, ticker, icon, decimals).then(async (data) => {
        this.toastr.success("Network has been added!", "", {
          positionClass: "toast-top-left"
        });

        //update validator list
        await this.dashboardService.updateNetworkList();
        this.toggleModal(modal);
      }).catch((err) => {
        this.toastr.error('Something went wrong.', "", {
          positionClass: "toast-top-left"
        });
      });
    } else {
      this.toastr.error('Fill in all fields.', "", {
        positionClass: "toast-top-left"
      });
    }
  }

  encodeImageFileAsURL(element: any) {
    const self = this;
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      self.base64Preview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  public toggleModal(modal: HTMLDivElement) {
    if (modal.classList.contains("showModal")) {
      modal.classList.remove("showModal");
    } else {
      modal.classList.add("showModal");
    }
  }

  public logout() {
    this.storageService.clearAccessToken();
    this.router.navigate(['/']);
  }
}
