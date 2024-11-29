import { Component, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { trigger, transition, useAnimation } from "@angular/animations";
import { fadeIn } from "ng-animate";
import { NavService } from "../../../services/nav.service";
import { CustomizerService } from "../../../services/customizer.service";
import * as feather from "feather-icons";
import { ToastrService } from "ngx-toastr";
import { EventsService } from "../../../services/events.service";
import { environment } from "../../../../../environments/environment";
import { NgClass } from "@angular/common";
import { HeaderComponent } from "../../header/header.component";
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { RightSidebarComponent } from "../../right-sidebar/right-sidebar.component";
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb.component";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../footer/footer.component";
import { CustomizerComponent } from "../../customizer/customizer.component";
import { TawkChatComponent } from "../../../../components/tawk-chat/tawk-chat.component";

@Component({
    selector: "app-content-layout",
    templateUrl: "./content-layout.component.html",
    styleUrls: ["./content-layout.component.scss"],
    animations: [
        trigger("animateRoute", [
            transition("* => *", useAnimation(fadeIn, {
            // Set the duration to 5seconds and delay to 2 seconds
            // params: { timing: 3}
            })),
        ]),
    ],
    standalone: true,
    imports: [
        NgClass,
        HeaderComponent,
        SidebarComponent,
        RightSidebarComponent,
        BreadcrumbComponent,
        RouterOutlet,
        FooterComponent,
        CustomizerComponent,
        TawkChatComponent,
    ],
})
export class ContentLayoutComponent implements OnInit, AfterViewInit {
  public right_side_bar: boolean;
  public _environment = environment;

  constructor(
    public navServices: NavService,
    public customizer: CustomizerService,
    public toastrService: ToastrService,
    public events: EventsService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      feather.replace();
    });
  }

  @HostListener("document:click", ["$event"])
  clickedOutside(event) {
    // click outside Area perform following action
    document.getElementById("outer-container").onclick = function (e) {
      e.stopPropagation();
      if (e.target != document.getElementById("search-outer")) {
        document.getElementsByTagName("body")[0].classList.remove("offcanvas");
      }
      if (e.target != document.getElementById("outer-container")) {
        document
          .getElementById("canvas-bookmark")
          .classList.remove("offcanvas-bookmark");
      }
      if (e.target != document.getElementById("inner-customizer")) {
        document
          .getElementsByClassName("customizer-links")[0]
          .classList.remove("open");
        document
          .getElementsByClassName("customizer-contain")[0]
          .classList.remove("open");
      }
    };
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : "";
  }

  public rightSidebar($event) {
    this.right_side_bar = $event;
  }

  ngOnInit() {
    this.events.on("toast", (toast) => {
      switch (toast.type) {
        case "error":
          this.toastrService.error(toast.msg, toast.title);
          break;

        case "success":
            this.toastrService.success(toast.msg, toast.title);
            break;

        default:
          this.toastrService.info(toast.msg, toast.title);
      }
    });
  }

  ngOnDestroy() {
    this.events.off("toast");
  }
}
