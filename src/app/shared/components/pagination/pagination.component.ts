import { Component, OnInit, ViewEncapsulation, OnDestroy, input, output } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { APIService, PagingMeta } from '../../services/api/api.service';
import { AppModel } from '../../model/api/app.model';

import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export interface PageEvent {
  page: number;
  limit: number;
}

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [TranslateModule, NgbModule]
})
export class PaginationComponent implements OnInit, OnDestroy {

  readonly paginate = output<PageEvent>();
  readonly service = input<APIService<AppModel>>();

  public pageLimit? = 15;
  public collectionSize? = 1;
  public currentPage? = 1;
  public pagination_limits: Array<any>;

  readonly startColWidth = input('col-sm-3');
  readonly midColWidth = input('col-sm-6');

  constructor(private events: EventsService) { }

  ngOnInit() {
    const service = this.service();
    if (service == null) {
      throw new Error('[service] input is required');
    }

    service.pagination.subscribe({
      next: (meta: PagingMeta) => {
        this.collectionSize = meta.total;
        this.pageLimit = meta.per_page;
        this.currentPage = meta.current_page;
      }
    })

    this.pagination_limits = [5, 10, 15, 20, 25, 30, 50, 100];
  }

  ngOnDestroy() {
    this.events.off(this.service()?.model_name + ':paging');
  }

  onPageChange(page) {
    this.currentPage = page;
    this.paginate.emit(this.formatParams());
  }

  onLimitChangeEvent($event) {
    this.onLimitChange($event.target.value);
  }

  onLimitChange(limit) {
    this.pageLimit = limit;
    this.paginate.emit(this.formatParams());
  }

  onReload() {
    this.paginate.emit(this.formatParams());
  }

  formatParams(): PageEvent {
    return {
      page: this.currentPage as number,
      limit: this.pageLimit as number
    };
  }

}
