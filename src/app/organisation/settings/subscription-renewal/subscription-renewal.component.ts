import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';
import { OrganisationSubscriptionService } from '../../../shared/services/cakeapi/organisation-subscription.service';
import { OrganisationSubscription } from '../../../shared/model/cakeapi/organisation-subscription';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-renewal',
  templateUrl: './subscription-renewal.component.html',
  styleUrls: ['./subscription-renewal.component.scss']
})
export class SubscriptionRenewalComponent implements OnInit, OnDestroy {
  public subscriptionForm: FormGroup;
  public activeSubscription: OrganisationSubscription;
  public subs: Subscription[] = [];

  constructor(
    public events: EventsService,
    public organisationService: OrganisationService,
    public subscriptionService: OrganisationSubscriptionService,
    public router: Router
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  setupForm() {
    const organisation = this.organisationService.getActiveOrganisation();
    this.activeSubscription = organisation.active_subscription;

    this.subscriptionForm = new FormGroup({
      subscription_type_name: new FormControl(
        this.activeSubscription.subscription_type.description
      ),
      subscription_type_id: new FormControl(
        this.activeSubscription.subscription_type_id,
        [Validators.required]
      ),
      length: new FormControl('', [Validators.required]),
      next_renewal_date: new FormControl(),
      subscription_cost: new FormControl()
    });

    this.subscriptionForm.controls.length.valueChanges.subscribe(value => {
      this.calculateRenewalInfo(+value);
    });

    this.subscriptionForm.patchValue({ length: 1 });
  }

  calculateRenewalInfo(sub_length: number) {
    const nextRenewalDate = this.activeSubscription.nextRenewalDate(sub_length);
    const renewalCost = this.activeSubscription.nextRenewalCost(sub_length);

    this.subscriptionForm.patchValue({
      next_renewal_date: nextRenewalDate.format('MMM DD, YYYY'),
      subscription_cost: renewalCost
    });
  }

  renewSubscription() {
    const params = this.subscriptionForm.value;

    Swal.fire({
      type: 'warning',
      title: 'Renewing Subscription',
      text: `This action will renew your subscription and generate an invoice for payment`,
      showCancelButton: true,
      cancelButtonColor: '#933'
    }).then(action => {
      if (action.value) {
        Swal.fire(
          'Renewing Subscription',
          'Please wait as subscription is renewed',
          'info'
        );
        Swal.showLoading();

        const sub = this.subscriptionService
          .renew(params.subscription_type_id, params.length)
          .subscribe(result => {
            Swal.hideLoading();
            Swal.close();
          });

        this.subs.push(sub);
      }
    });
  }

  cancelRenewal() {
    this.router.navigate(['/organisation/settings/subscription']);
  }
}
