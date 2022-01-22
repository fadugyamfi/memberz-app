import { Directive, HostListener, Input } from '@angular/core';
import { OrganisationMember } from '../model/api/organisation-member';
import { EventsService } from '../services/events.service';

@Directive({
	selector: '[viewProfile]'
})
export class ViewProfileDirective {

  @Input() membership: OrganisationMember;

  constructor(
    public events: EventsService
  ) {}

	@HostListener('click') onClick() {
    this.events.trigger('open:membership:flyout', this.membership)
	}
}
