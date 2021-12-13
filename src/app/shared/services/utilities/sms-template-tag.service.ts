import { Injectable } from "@angular/core";
import { OrganisationService } from "../api/organisation.service";

@Injectable({
  providedIn: 'root'
})
export class SmsTemplateTagService {

  tags = [];

  constructor(
    public organisationService: OrganisationService
  ) {
    this.setTags();
  }

  setTags() {
    this.tags = [
      { template: '{title_no}', title: 'Member Title No', example: 'Mr'},
      { template: '{title}', title: 'Member Title', example: 'Mr'},
      { template: '{first_name}', title: 'Member First Name', example: 'John'},
      { template: '{last_name}', title: 'Member Last Name', example: 'Doe'},
      { template: '{full_name}', title: 'Member Full Name', example: 'John Doe'},
      { template: '{membership_no}', title: 'Membership Number', example: 'MBZ001'},
      { template: '{organisation_name}', title: 'Organisation Name', example: this.organisationService.getActiveOrganisation().name},
    ];
  }

  getTags() {
    return this.tags;
  }

  processMessageTags(message) {
    this.getTags().forEach((tag) => {
      message = message.replace(tag.template, tag.example);
    });

    return message;
  }
}
