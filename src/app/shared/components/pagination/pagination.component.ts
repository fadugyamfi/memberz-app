import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { APIService, PagingMeta } from '../../services/api/api.service';
import { AppModel } from '../../model/api/app.model';

export interface PageEvent {
  page: number;
  limit: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit, OnDestroy {

  @Output() paginate = new EventEmitter();
  @Input() service: APIService<AppModel>;

  public pageLimit = 15;
  public collectionSize = 1;
  public currentPage = 1;
  public pagination_limits: Array<any>;

  @Input() startColWidth = 'col-sm-3';
  @Input() midColWidth = 'col-sm-6';

  constructor(private events: EventsService) { }

  ngOnInit() {
    if (this.service == null) {
      throw new Error('[service] input is required');
    }

    // this.events.on(this.service.model_name + ':paging', (data) => {
    //   this.collectionSize = data.total;
    //   this.pageLimit = data.per_page;
    //   this.currentPage = data.current_page;
    // });

    this.service.pagination.subscribe({
      next: (meta: PagingMeta) => {
        this.collectionSize = meta.total;
        this.pageLimit = meta.per_page;
        this.currentPage = meta.current_page;
      }
    })

    this.pagination_limits = [5, 10, 15, 20, 25, 30, 50, 100];
  }

  ngOnDestroy() {
    this.events.off(this.service.model_name + ':paging');
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
      page: this.currentPage,
      limit: this.pageLimit
    };
  }

}
