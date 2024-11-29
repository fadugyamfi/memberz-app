import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { Organisation } from '../../../shared/model/api/organisation';
import { AuthService } from '../../../shared/services/api/auth.service';
import { MemberAccountService } from '../../../shared/services/api/member-account.service';
import { Router } from '@angular/router';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../shared/services/storage.service';
import { EventsService } from '../../../shared/services/events.service';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SmsAccountService } from '../../../shared/services/api/sms-account.service';
import { OrganisationRoleService } from '../../../shared/services/api/organisation-role.service';
import { OrganisationAccountService } from '../../../shared/services/api/organisation-account.service';
import { SystemSettingService } from '../../../shared/services/api/system-setting.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { NgClass, DecimalPipe } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';
import { OrganisationEditorComponent } from './organisation-editor/organisation-editor.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [AvatarModule, NgClass, PaginationComponent, OrganisationEditorComponent, DecimalPipe, TranslateModule]
})
export class HomeComponent implements OnInit, OnDestroy {

  public organisations: Organisation[];

  constructor(
    public authService: AuthService,
    public memberAccountService: MemberAccountService,
    public router: Router,
    public organisationService: OrganisationService,
    public storage: StorageService,
    public events: EventsService,
    public smsAccountService: SmsAccountService,
    public orgAccountService: OrganisationAccountService,
    public translate: TranslateService,
    public systemSettingService: SystemSettingService
  ) { }

  ngOnInit() {
    this.setupEvents();
    const activeOrganisation = this.organisationService.getActiveOrganisation();
    if ( activeOrganisation ) {
      this.loadOrganisation(activeOrganisation);
    } else {
      this.fetchUserOrganisations();
    }
  }

  ngOnDestroy() {
    this.removeEvents();
  }

  setupEvents() {
    this.events.on('Organisation:created', (organisation) => {
      Swal.close();
      this.organisations.push(organisation);
    });

    this.events.on('Organisation:updated', (organisation) => {
      Swal.close();

      this.organisations.forEach((org, index) => {
        if ( org.id === organisation.id ) {
          this.organisations[index] = organisation;
        }
      });
    });

    this.events.on('Organisation:deleted', (organisation) => {
      Swal.close();

      this.organisations.forEach((org, index) => {
        if ( org.id === organisation.id ) {
          this.organisations.splice(index, 1);
        }
      });
    });
  }

  removeEvents() {
    this.events.off('Organisation:deleted');
  }

  emptyDataset() {
    return this.organisations && this.organisations.length === 0;
  }

  dataAvailable() {
    return this.organisations && this.organisations.length > 0;
  }

  fetchUserOrganisations(page = 1, limit = 15) {
    this.organisations = null;
    const user = this.authService.userData;
    this.memberAccountService.organisations(user.id, page, limit).subscribe(organisations => this.organisations = organisations);
  }

  loadOrganisation(org: Organisation) {
    Swal.fire(`Switching To ${org.name}`, '', 'info');
    Swal.showLoading();

    this.events.trigger('switching_organisation');
    this.organisationService.setActiveOrganisation(org);
    this.smsAccountService.refreshAccount();
    const user = this.authService.userData;

    this.orgAccountService.fetchAdminAccount(org.id, user.id).subscribe({
      next: () => {
        this.router.navigate(['/organisation/dashboard']).then(() => {
          setTimeout(() => Swal.close(), 500);
        });
      },
      error: () => {
        Swal.fire(
          this.translate.instant('Invalid Access'),
          this.translate.instant('Could not retrieve a valid account to access this organisation\'s data'),
          'error'
        );
        Swal.hideLoading();
      }
    })
  }

  deleteOrganisation(organisation: Organisation) {
    Swal.fire({
      title: 'Delete Organisation',
      text: `This action will delete '${organisation.name}' and all related data.`,
      icon: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      cancelButtonColor: '#933'
    }).then((action) => {
      if ( action.value ) {
        Swal.fire('Deleting Organisation', 'Please wait ...', 'info');
        Swal.showLoading();

        this.organisationService.remove(organisation);
      }
    });
  }

  /**
   * Handles the pagination events
   *
   * @param event PageEvent
   */
  onPaginate(event: PageEvent) {
    this.fetchUserOrganisations(event.page, event.limit);
  }

  revertExperience(e) {
    e.preventDefault();

    Swal.fire({
      title: this.translate.instant('Revert Experience'),
      text: this.translate.instant('This will revert you to the old Memberz\.Org Web Experience on this device') + '.'
      + this.translate.instant('You can re-activate the experience at any time'),
      icon: 'info',
      showCancelButton: true,
    }).then((action) => {
      if( action.isConfirmed ) {
        window.location.href = `${environment.cakeapp.url}/new_experience/reset`;
      }
    })

  }
}
