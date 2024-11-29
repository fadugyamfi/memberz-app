import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-list-filter',
    templateUrl: './list-filter.component.html',
    styleUrls: ['./list-filter.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, TranslateModule]
})
export class ListFilterComponent implements OnInit {

  public selectedFilterField;
  @Input() listFilters;
  @Input() filterGroup;
  @Input() optionalOnly = false;
  @Input() filter;

  @Output() remove = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    if( this.filter ) {
      this.setSelectedFilterField( this.filter.field );
    }
  }

  setSelectedFilterField(fieldId) {
    this.listFilters.forEach(group => {
      const selected = group.fields.find(filter => filter.id == fieldId);
      if( selected ) {
        this.selectedFilterField = selected;
      }
    });
  }

  showOptional() {
    return this.filterGroup.controls.optional?.value == this.optionalOnly ? 1 : 0;
  }
}
