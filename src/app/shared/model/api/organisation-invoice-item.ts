
import { AppModel } from './app.model';
import * as moment from 'moment';

export class OrganisationInvoiceItem extends AppModel {

  public id: any;
  public organisation_id: number;
  public qty: number;
  public product_type: string;
  public product_id: number;
  public description: string;
  public unit_price: number;
  public tax_amount: number;
  public gross_total: number;
  public total: number;

  constructor(data) {
    super(data);
  }
}
