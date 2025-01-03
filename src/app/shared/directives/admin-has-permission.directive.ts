import { Directive, ElementRef, OnInit, input } from '@angular/core';
import { OrganisationAccountService } from '../services/api/organisation-account.service';

@Directive({
    selector: '[adminHasPermission]',
    standalone: true
})
export class AdminHasPermissionDirective implements OnInit {

  readonly permission = input<string>(undefined, { alias: "adminHasPermission" });

  constructor(
    public el: ElementRef,
    public adminService: OrganisationAccountService
  ) { }

  ngOnInit() {
    const admin = this.adminService.getActiveAccount();

    const permission = this.permission();
    if ( admin && permission && !admin.hasPermission(permission)) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
