import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EventsService } from "../../services/events.service";
import { APIService } from '../../services/cakeapi/api.service';

export interface PageEvent {
  page: number,
  limit: number
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit, OnDestroy {

  @Output() paginate = new EventEmitter();
  @Input() service: APIService;

  public pageLimit = 15;
  public collectionSize = 0;
  public currentPage = 1;
  public pagination_limits: Array<any>;

  constructor(private events: EventsService) { }

  ngOnInit() {
    if (this.service == null) {
      throw new Error('[service] input is required');
    }
    
    this.events.on(this.service.model_name + ':paging', (data) => {
      this.collectionSize = data['total'];
      this.pageLimit = data['per_page'];
      this.currentPage = data['current_page'];
    });

    this.pagination_limits = [5, 10, 15, 20, 25, 30, 50, 100];
  }

  ngOnDestroy() {
    this.events.off(this.service.model_name + ':paging');
  }

  onPageChange(page) {
    this.currentPage = page;
    this.paginate.emit(this.formatParams());
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
    }
  }

}
