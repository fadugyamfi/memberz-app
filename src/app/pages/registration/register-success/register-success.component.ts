import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Organisation } from '../../../shared/model/api/organisation';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { OrganisationRegistrationForm } from '../../../shared/model/api/organisation-registration-form';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationRegistrationFormService } from '../../../shared/services/api/organisation-registration-form.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';

@Component({
  selector: 'membership-registration-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss']
})
export class RegisterSuccessComponent implements OnInit, OnDestroy {

  public organisation: Organisation;
  public membership: OrganisationMember;
  public registrationFormConfig: OrganisationRegistrationForm;
  public subscriptions: Subscription[] = [];
  public tenantHeaders = {};

  constructor(
    public organisationService: OrganisationService,
    public registrationFormService: OrganisationRegistrationFormService,
    public route: ActivatedRoute,
    public router: Router,
    public membershipService: OrganisationMemberService
  ) { }

  ngOnInit(): void {
    this.loadOrganisationAndThenFormBySlugs();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadOrganisationAndThenFormBySlugs() {
    const onOrganisationLoaded = (organisation) => {
      this.organisation = organisation;

      this.tenantHeaders = {
        'X-Tenant-Id': organisation.uuid
      };

      this.loadRegistrationForm();
      this.loadRegisteredMembership();
    }

    const org = this.organisationService.getSelectedModel();
    if( org ) {
      return onOrganisationLoaded(org);
    }

    const orgSlug = this.route.snapshot.paramMap.get('org_slug');

    const sub = this.organisationService.getBySlug(orgSlug).subscribe({
      next: (organisation) => {
        onOrganisationLoaded(organisation);
      },

      error: (err) => {
        Swal.fire('Invalid Configuration', 'Link provided was invalid', 'error').then(() => {
          this.router.navigate(['/']);
        });
      }
    });

    this.subscriptions.push(sub);
  }

  loadRegistrationForm() {
    const regForm = this.registrationFormService.getSelectedModel();

    if( regForm ) {
      this.registrationFormConfig = regForm;
      return;
    }

    const slug = this.route.snapshot.paramMap.get('slug');

    const sub2 = this.registrationFormService.getBySlugs(this.organisation.slug, slug, {}, this.tenantHeaders).subscribe(form => {
      this.registrationFormConfig = form;
    });

    this.subscriptions.push(sub2);
  }

  loadRegisteredMembership() {
    const membership = this.membershipService.getSelectedModel();

    if( membership ) {
      return this.membership = membership;
    }

    const orgSlug = this.route.snapshot.paramMap.get('org_slug');
    const membership_id = this.route.snapshot.paramMap.get('membership_id');

    const sub = this.membershipService
      .get(`/organisations/${orgSlug}/organisation_members/${membership_id}`, {}, this.tenantHeaders)
      .subscribe({
        next: (response) => this.membership = new OrganisationMember(response['data']),
        error: () => Swal.fire('Membership Not Found', 'Invalid registration link provided', 'error')
      });

    this.subscriptions.push(sub);
  }

  startNewRegistration() {
    this.membershipService.setSelectedModel(null);
    this.router.navigate(['/', this.organisation.slug, 'register', this.registrationFormConfig.slug]);
  }

  async shareForm() {
    if (typeof navigator.share == 'undefined') {
      Swal.fire('Share not supported', 'Please share url manually', 'error');
      return;
    }

    const shareData = {
      title: this.registrationFormConfig.name + ' Membership Registration',
      text: 'Register with ' + this.organisation.name,
      url: this.router.createUrlTree(['/', this.organisation.slug, 'register', this.registrationFormConfig.slug]).toString()
    }

    Swal.fire('Loading Share Options', '', 'info');
    Swal.showLoading();

    try {
      await navigator.share(shareData);
      Swal.close();
    } catch(err) {
      Swal.hideLoading();
      Swal.fire('Form share failed: ' + err, '', 'error');
    }
  }
}
