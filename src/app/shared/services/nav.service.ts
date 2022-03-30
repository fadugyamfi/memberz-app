import { Injectable, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

// Menu
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  permission?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public screenWidth: any;
  public collapseSidebar = false;

  // Member Portal Items
  PORTAL_MENUITEMS: Menu[] = [
    {
      path: '/portal/home',
      title: this.translate.instant('Home'),
      icon: 'home',
      type: 'link',
      bookmark: true
    },
    {
      path: '/portal/profile',
      title: this.translate.instant('Your Profile'),
      icon: 'user',
      type: 'link',
      bookmark: true
    },
    {
      path: '/portal/notifications',
      title: this.translate.instant('Notifications'),
      icon: 'star',
      type: 'link',
      bookmark: true
    },
  ];

  portalMenuItems = new BehaviorSubject<Menu[]>(this.PORTAL_MENUITEMS);

  // Member Portal Items
  ORGANISATION_MENUITEMS: Menu[] = [
    {
      path: '/organisation/dashboard',
      title: 'Dashboard',
      icon: 'home',
      type: 'link',
      bookmark: true
    },
    {
      title: 'Memberships',
      icon: 'user',
      type: 'sub',
      active: false,
      bookmark: true,
      path: '/organisation/memberships/profiles',
      children: [
        // {
        //   title: 'Settings',
        //   type: 'sub',
        //   active: false,
        //   children: [
        //     { path: '/organisation/memberships/categories', title: 'Categories', type: 'link' },
        //     { path: '/organisation/memberships/groups', title: 'Groups', type: 'link' },
        //     { path: '/organisation/memberships/anniversaries', title: 'Anniversaries', type: 'link' }
        //   ]
        // },
        {
          path: '/organisation/memberships/add',
          title: 'Add Member',
          type: 'link',
          permission: 'memberships:profiles:add',
        },
        {
          path: '/organisation/memberships/profiles',
          title: 'Find Members',
          type: 'link',
          icon: 'users'
        },
        {
          path: '/organisation/memberships/registration-forms',
          title: 'Registration Forms',
          type: 'link',
          permission: 'memberships:registrations:view'
        },
        {
          path: '/organisation/memberships/pending-approvals',
          title: 'Pending Approvals',
          type: 'link',
          permission: 'memberships:registrations:approve'
        },
        {
          path: '/organisation/memberships/bulk-upload',
          title: 'Bulk Upload',
          type: 'link',
          permission: 'memberships:bulk_upload:view'
        },
        // {
        //   path: '/organisation/memberships/reports',
        //   title: 'Reports',
        //   type: 'link'
        // }
      ]
    },
    {
      title: 'Messaging',
      icon: 'message-square',
      type: 'sub',
      active: false,
      bookmark: true,
      path: '/organisation/messaging/history',
      children: [
        { path: '/organisation/messaging/settings', title: 'Dashboard', type: 'link', permission: 'messaging:settings:view' },
        { path: '/organisation/messaging/history', title: 'History', type: 'link', permission: 'messaging:history:view' },
        { path: '/organisation/messaging/broadcast', title: 'Broadcast', type: 'link', permission: 'messaging:broadcast:view' },
        { path: '/organisation/messaging/broadcast-lists', title: 'Broadcast Lists', type: 'link', permission: 'messaging:broadcast-lists:view' },
        { path: '/organisation/messaging/purchase-credits', title: 'Purchase Credits', type: 'link', permission: 'messaging:purchase-credits:view' },
      ]
    },
    {
      title: 'Finance',
      icon: 'credit-card',
      type: 'sub',
      active: false,
      bookmark: true,
      path: '/organisation/finance/dashboard',
      children: [
        { path: '/organisation/finance/dashboard', title: 'Dashboard', type: 'link', icon: 'dashboard', permission: 'finance:dashboard:view' },
        { path: '/organisation/finance/income', title: 'Income', type: 'link', permission: 'finance:income:view' },
        // {
        //   path: '/organisation/finance/settings',
        //   title: 'Settings',
        //   type: 'sub',
        //   active: false,
        //   children: [
        //     { path: '/organisation/finance/settings/income-sources', title: 'Income Sources', type: 'link', icon: 'cash' },
        //     { path: '/organisation/finance/settings/receipts', title: 'Receipts', type: 'link', icon: 'cogs' },
        //   ]
        // },
        // { path: '/organisation/finance/expenditure', title: 'Expenditure', type: 'link' },
        {
          title: 'Reports',
          type: 'sub',
          active: false,
          permission: 'finance:reports:view',
          children: [
            { path: '/organisation/finance/reports/income-summary', title: 'Income Summary', type: 'link' },
            { path: '/organisation/finance/reports/yearly-summary', title: 'Yearly Summary', type: 'link' },
            { path: '/organisation/finance/reports/top-contributors', title: 'Top Contributors', type: 'link' },
            { path: '/organisation/finance/reports/non-contributing-members', title: 'Non Contributors', type: 'link' }
          ]
        }
      ]
    },
    {
      title: 'Settings',
      icon: 'settings',
      type: 'sub',
      bookmark: true,
      active: false,
      path: '/organisation/settings/subscription',
      children: [

        {
          title: 'Memberships',
          type: 'sub',
          active: false,
          children: [
            { path: '/organisation/memberships/categories', title: 'Categories', type: 'link', permission: 'settings:categories:view' },
            { path: '/organisation/memberships/groups', title: 'Groups', type: 'link', permission: 'settings:groups:view' },
            { path: '/organisation/memberships/anniversaries', title: 'Anniversaries', type: 'link', permission: 'settings:anniversaries:view' }
          ]
        },
        // { path: '/organisation/messaging/settings', title: 'Messaging', type: 'link' },
        {
          path: '/organisation/finance/settings',
          title: 'Finances',
          type: 'sub',
          active: false,
          permission: 'finance:settings:view',
          children: [
            { path: '/organisation/finance/settings/income-sources', title: 'Income Sources', type: 'link', icon: 'cash' },
            { path: '/organisation/finance/settings/receipts', title: 'Receipts', type: 'link', icon: 'cogs' },
          ]
        },
        {
          path: '/organisation/settings/subscription',
          title: 'Subscription',
          type: 'link',
          permission: 'settings:subscriptions:view'
        },
        {
          path: '/organisation/settings/roles',
          title: 'Roles & Permissions',
          type: 'link',
          permission: 'settings:organisation_roles:view'
        },
        {
          path: '/organisation/settings/accounts',
          title: 'Admin Accounts',
          type: 'link',
          permission: 'settings:accounts:view'
        },
        {
          path: '/organisation/settings/user-activities',
          title: 'User Activities',
          type: 'link'
        },
        {
          path: '/organisation/settings/payment-platforms',
          title: 'Payment Platforms',
          type: 'link',
          permission: 'settings:payment_platforms:view'
        }
      ]
    }
  ];

  organisationMenuItems = new BehaviorSubject<Menu[]>(
    this.ORGANISATION_MENUITEMS
  );


  constructor(
    public translate: TranslateService
  ) {
    this.onResize();
    if (this.screenWidth < 991) {
      this.collapseSidebar = true;
    }
  }

  // Windows width
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
}
