
import { AppModel } from './app.model';

export class OrganisationFileImport extends AppModel {

  public id: any;
  public organisation_id: number;
  public import_type: string;
  public import_to_id: number;
  public file_path: string;
  public file_name: string;
  public import_status: string;
  public records_imported: number;
  public records_linked: number;
  public records_existing: number;

  constructor(data) {
    super(data);
  }
}
