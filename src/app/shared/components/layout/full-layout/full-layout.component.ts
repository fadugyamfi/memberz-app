import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { environment } from '../../../../../environments/environment';
import { EventsService } from "../../../services/events.service";
import { RouterOutlet } from '@angular/router';
import { TawkChatComponent } from '../../../../components/tawk-chat/tawk-chat.component';

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss'],
    standalone: true,
    imports: [RouterOutlet, TawkChatComponent]
})
export class FullLayoutComponent implements OnInit {

  public _environment = environment;

  constructor(
    public toastrService: ToastrService,
    public events: EventsService
  ) { }

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
