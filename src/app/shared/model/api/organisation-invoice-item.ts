
import { AppModel } from './app.model';

export class OrganisationInvoiceItem extends AppModel {

  
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
