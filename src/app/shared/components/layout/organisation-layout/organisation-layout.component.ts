import { Component, OnInit, AfterViewInit, HostListener, OnDestroy, viewChild } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { NavService } from '../../../services/nav.service';
import { CustomizerService } from '../../../services/customizer.service';
import * as feather from 'feather-icons';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from '../../../services/events.service';
import { Router, RouterOutlet } from '@angular/router';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { OrganisationMemberService } from '../../../services/api/organisation-member.service';
import { ProfileViewComponent } from '../../profile-view/profile-view.component';
import { environment } from '../../../../../environments/environment';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { OrganisationSidebarComponent } from '../../organisation-sidebar/organisation-sidebar.component';
import { RightSidebarComponent } from '../../right-sidebar/right-sidebar.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../footer/footer.component';
import { TawkChatComponent } from '../../../../components/tawk-chat/tawk-chat.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-organisation-layout',
    templateUrl: './organisation-layout.component.html',
    styleUrls: ['./organisation-layout.component.scss'],
    animations: [
        trigger('animateRoute', [transition('* => *', useAnimation(fadeIn, {
            // Set the duration to 5seconds and delay to 2 seconds
            // params: { timing: 3}
            }))])
    ],
    imports: [NgClass, HeaderComponent, OrganisationSidebarComponent, RightSidebarComponent, BreadcrumbComponent, RouterOutlet, FooterComponent, ProfileViewComponent, TawkChatComponent, TranslateModule]
})
export class OrganisationLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  readonly profileView = viewChild<ProfileViewComponent>("profileView");

  public right_side_bar: boolean;
  public flyoutOpen = false;
  public membership: OrganisationMember;
  public _environment = environment;

  constructor(
    public navServices: NavService,
    public customizer: CustomizerService,
    public toastrService: ToastrService,
    public events: EventsService,
    public router: Router,
    public membershipService: OrganisationMemberService
  ) { }


  ngAfterViewInit() {
    setTimeout(() => {
      feather.replace();
    });
  }

  @HostListener('document:click', ['$event'])
  clickedOutside(event) {
    // click outside Area perform following action
    // document.getElementById('outer-container').onclick = (e) => {
    //   e.stopPropagation();
    //   if (e.target !== document.getElementById('search-outer')) {
    //     document.getElementsByTagName('body')[0].classList.remove('offcanvas');
    //   }
    //   if (e.target !== document.getElementById('outer-container')) {
    //     document.getElementById('canvas-bookmark').classList.remove('offcanvas-bookmark');
    //   }
    //   if (e.target !== document.getElementById('inner-customizer')) {
    //     document.getElementsByClassName('customizer-links')[0].classList.remove('open');
    //     document.getElementsByClassName('customizer-contain')[0].classList.remove('open');
    //   }
    // };
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public rightSidebar($event) {
    this.right_side_bar = $event;
  }

  ngOnInit() {
    this.events.on('toast', (toast) => {
      switch (toast.type) {
        case 'error':
          this.toastrService.error(toast.msg, toast.title);
          break;

        case "success":
            this.toastrService.success(toast.msg, toast.title);
            break;

        default:
          this.toastrService.info(toast.msg, toast.title);
      }
    });

    this.events.on("open:membership:flyout", (membership: OrganisationMember) => {
      this.flyoutOpen = true;
      this.membership = membership;
    });

    this.events.on("open:membership:flyout:by:id", (membershipId: number) => {
      this.flyoutOpen = true;
      this.profileView()?.loadProfileById(membershipId);
    });

    this.events.on("open:membership:flyout:by:member_id", (member_id: number) => {
      this.flyoutOpen = true;
      this.profileView()?.loadProfileByMemberId(member_id);
    });

    this.events.on('close:membership:flyout', () => this.flyoutOpen = false);
  }

  ngOnDestroy() {
    this.events.off('toast');
  }

  toggleFlyout() {
    this.flyoutOpen = !this.flyoutOpen;
  }
}
