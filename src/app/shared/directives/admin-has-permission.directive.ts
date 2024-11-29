import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { OrganisationAccountService } from '../services/api/organisation-account.service';

@Directive({
    selector: '[adminHasPermission]',
    standalone: true
})
export class AdminHasPermissionDirective implements OnInit {

  @Input('adminHasPermission') permission: string;

  constructor(
    public el: ElementRef,
    public adminService: OrganisationAccountService
  ) { }

  ngOnInit() {
    const admin = this.adminService.getActiveAccount();

    if ( admin && this.permission && !admin.hasPermission(this.permission)) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
