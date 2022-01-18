import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { NavService } from '../../../services/nav.service';
import { CustomizerService } from '../../../services/customizer.service';
import * as feather from 'feather-icons';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from '../../../services/events.service';
import { Router } from '@angular/router';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { OrganisationMemberService } from '../../../services/api/organisation-member.service';

@Component({
  selector: 'app-organisation-layout',
  templateUrl: './organisation-layout.component.html',
  styleUrls: ['./organisation-layout.component.scss'],
  animations: [
    trigger('animateRoute', [transition('* => *', useAnimation(fadeIn, {
      // Set the duration to 5seconds and delay to 2 seconds
      // params: { timing: 3}
    }))])
  ]
})
export class OrganisationLayoutComponent implements OnInit, OnDestroy, AfterViewInit {


  public right_side_bar: boolean;
  public flyoutOpen = false;
  public membership: OrganisationMember;

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

    this.events.on('close:membership:flyout', () => this.flyoutOpen = false);
  }

  ngOnDestroy() {
    this.events.off('toast');
  }

  toggleFlyout() {
    this.flyoutOpen = !this.flyoutOpen;
  }
}
