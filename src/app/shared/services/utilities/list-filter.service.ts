import { Injectable } from "@angular/core";
import { SmsBroadcastListService } from '../api/sms-broadcast-list.service';

export type ListFilter = {
  field: string,
  condition: string,
  value: string
}

@Injectable({
  providedIn: 'root'
})
export class ListFilterService {

  public listFilters: any[] = [];

  constructor(
    public broadcastListService: SmsBroadcastListService,
  ) {

  }

  fetchFilters() {
    this.broadcastListService.getFilters().subscribe((filters: any) => this.listFilters = filters);
  }

  getQueryParts(filters: any[] = []) {

    let required: ListFilter[] = [];
    let optional: ListFilter[] = [];

    filters.forEach(filter => {

      if( !filter.value || !filter.condition || !filter.field ) {
        return;
      }

      this.listFilters.forEach(group => {
        const selected = group.fields.find(fieldFilter => fieldFilter.id == filter.field);
        if( !selected ) {
          return;
        }

        let selectedValueName = filter.value;

        if( selected.options ) {
          const option = selected.options.find(v => v.value == filter.value);
          if( option ) {
            selectedValueName = option.label;
          }
        }

        if( filter.optional ) {
          optional.push({ 'field': selected.name, 'condition': filter.condition, 'value': selectedValueName });
        } else {
          required.push({ 'field': selected.name, 'condition': filter.condition, 'value': selectedValueName });
        }
      });
    });

    return { required, optional };
  }

  getQueryExample(filters) {
    const { required, optional } = this.getQueryParts(filters);

    let requiredParts = required.map(item => this.generateSQLString(item));
    let optionalParts = optional.map(item => this.generateSQLString(item));
    let example = `${requiredParts.join(' AND ')}`;

    if( optionalParts.length > 0 ) {
      example += ` AND (${optionalParts.join(' OR ')})`;
    }

    return example;
  }

  generateSQLString(item) {
    if( item.condition.includes("%") ) {
      const conditionText = "LIKE '" + item.condition.replace("{s}", item.value) + "'";
      return `${item.field} ${conditionText}`;
    }

    return `${item.field} ${item.condition} '${item.value}'`;
  }
}
