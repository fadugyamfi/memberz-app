import { Directive, HostListener, Input } from '@angular/core';
import { OrganisationMember } from '../model/api/organisation-member';
import { EventsService } from '../services/events.service';

@Directive({
    selector: '[viewProfile]',
    standalone: true
})
export class ViewProfileDirective {

  @Input() membership: OrganisationMember;
  @Input() membershipId: number;
  @Input() memberId: number;

  constructor(
    public events: EventsService
  ) {}

	@HostListener('click') onClick() {
    if( this.membership ) {
      this.events.trigger('open:membership:flyout', this.membership);
      return;
    }

    if( this.membershipId ) {
      this.events.trigger('open:membership:flyout:by:id', this.membershipId);
      return;
    }

    if( this.memberId ) {
      this.events.trigger('open:membership:flyout:by:member_id', this.memberId);
      return;
    }
	}
}
