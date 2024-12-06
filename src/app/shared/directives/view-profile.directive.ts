import { Directive, HostListener, input } from '@angular/core';
import { OrganisationMember } from '../model/api/organisation-member';
import { EventsService } from '../services/events.service';

@Directive({
    selector: '[viewProfile]',
    standalone: true
})
export class ViewProfileDirective {

  readonly membership = input<OrganisationMember>(undefined);
  readonly membershipId = input<number>(undefined);
  readonly memberId = input<number>(undefined);

  constructor(
    public events: EventsService
  ) {}

	@HostListener('click') onClick() {
    const membership = this.membership();
    if( membership ) {
      this.events.trigger('open:membership:flyout', membership);
      return;
    }

    const membershipId = this.membershipId();
    if( membershipId ) {
      this.events.trigger('open:membership:flyout:by:id', membershipId);
      return;
    }

    const memberId = this.memberId();
    if( memberId ) {
      this.events.trigger('open:membership:flyout:by:member_id', memberId);
      return;
    }
	}
}
