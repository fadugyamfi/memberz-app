import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { PageEvent, PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Organisation } from '../../../shared/model/api/organisation';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { MemberAccountService } from '../../../shared/services/api/member-account.service';
import { MemberService } from '../../../shared/services/api/member.service';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationRegistrationFormService } from '../../../shared/services/api/organisation-registration-form.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';

@Component({
    selector: 'app-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, AvatarModule, PaginationComponent, AsyncPipe]
})
export class PublicComponent implements OnInit {

  public organisation: Organisation;
  public subscriptions: Subscription[] = [];
  public memberships$: Observable<OrganisationMember[]>;

  constructor(
    public organisationService: OrganisationService,
    public registrationFormService: OrganisationRegistrationFormService,
    public route: ActivatedRoute,
    public router: Router,
    public translate: TranslateService,
    public profileService: MemberService,
    public membershipService: OrganisationMemberService,
    public events: EventsService,
    public accountService: MemberAccountService
  ) { }

  ngOnInit(): void {
    this.loadOrganisation();
  }

  loadOrganisation() {
    const slug = this.route.snapshot.paramMap.get('org_slug');
    const sub = this.organisationService.getBySlug(slug).subscribe(organisation => {
      this.organisation = organisation;
      this.organisationService.setSelectedModel(this.organisation);
      this.fetchMemberships();
    });

    this.subscriptions.push(sub);
  }

  fetchMemberships(page = 1, limit = 100) {
    const tenantHeaders = {
      'X-Tenant-Id': this.organisation.uuid
    };

    const params = { sort: 'last_name:asc', page, limit };

    this.memberships$ = this.membershipService.publicDirectory(this.organisation.slug, params, tenantHeaders);
  }

  onPaginate(event: PageEvent) {
    this.fetchMemberships(event.page, event.limit);
  }
}
