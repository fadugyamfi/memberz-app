import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SmsBroadcastList } from '../../../shared/model/api/sms-broadcast-list';
import { SmsBroadcastListService } from '../../../shared/services/api/sms-broadcast-list.service';

@Component({
  selector: 'app-broadcast-list-preview',
  templateUrl: './broadcast-list-preview.component.html',
  styleUrls: ['./broadcast-list-preview.component.scss']
})
export class BroadcastListPreviewComponent implements OnInit, OnDestroy {

  public broadcastList: SmsBroadcastList;
  public subscriptions: Subscription[] = [];
  public listContacts;

  constructor(
    public broadcastListService: SmsBroadcastListService,
    public router: Router,
    public route: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadBroadcastList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBroadcastList() {
    Swal.fire(
      this.translate.instant('Loading Data'),
      this.translate.instant('Fetching Broadcast List Data'),
      'info'
    );
    Swal.showLoading();

    const sub = this.route.params.subscribe(params => {
      const broadcast_list_id = params.id; // (+) converts string 'id' to a number

      if( this.broadcastListService.hasItems() ) {
        this.broadcastList = this.broadcastListService.getItem(broadcast_list_id);
        this.loadListContacts(this.broadcastList);
        return;
      }

      const bsub = this.broadcastListService.getAll({ id: broadcast_list_id }).subscribe(lists => {
        this.broadcastList = lists[0];
        this.loadListContacts(this.broadcastList);
      });

      this.subscriptions.push(bsub);
    });

    this.subscriptions.push(sub);
  }

  loadListContacts(broadcastList: SmsBroadcastList) {
    this.broadcastListService.getListPreview(broadcastList).subscribe(list => {
      this.listContacts = list;
      Swal.close();
    });
  }

}
