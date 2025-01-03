
import { BulkUploadService } from './api/bulkupload.service';
import { Injectable, ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';
import { OrganisationService } from './api/organisation.service';
import { TranslateService } from '@ngx-translate/core';

type AOA = any[][];
type ExcelImport = {
  data: AOA,
  headers: any[]
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private extension = '.xlsx';
  private moduleHeader = [];

  private importedData: AOA = [];
  private importedHeaders: string[] = [];
  private importedMultiSheetData = {};

  constructor(
    public storage: StorageService,
    public orgService: OrganisationService,
    public translate: TranslateService
  ) { }

  import(file, headers): Subject<ExcelImport> {
    this.moduleHeader = headers;
    this.importedData = [];
    this.importedHeaders = [];

    const subject = new Subject<ExcelImport>();

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      // read workbook
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // grab first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.importedData = (XLSX.utils.sheet_to_json(ws, { raw: true, defval: null })) as AOA;
      // console.log(this.importedData);
      this.importedHeaders = this.extractHeaders(ws);

      subject.next({ 'data': this.importedData, 'headers': this.importedHeaders });
    };

    reader.readAsBinaryString(file);

    return subject;
  }

  getImportedData() {
    return this.importedData;
  }

  getImportedMultiSheetData() {
    return this.importedMultiSheetData;
  }

  getImportedHeaders() {
    return this.importedHeaders;
  }

  importMultiSheet(file) {

    this.importedMultiSheetData = {};
    this.importedMultiSheetData['filename'] = file.name;

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      for (let i = 0; i < wb.SheetNames.length; ++i) {
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: i }) as AOA;
        this.importedMultiSheetData[`sheet${i + 1}`] = data;
        this.importedHeaders = this.extractHeaders(ws);
      }
    };
  }

  private extractHeaders(sheet) {
    const headers: string[] = [];
    const range = XLSX.utils.decode_range(sheet['!ref']);
    let column;
    const row = range.s.r; // start in the first row
    // walk every column in the range
    for (column = range.s.c; column <= range.e.c; ++column) {
      const cell = sheet[XLSX.utils.encode_cell({ c: column, r: row })];
      // find the cell in the first row
      let hdr = 'UNKNOWN ' + column; // default
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
    }

    return headers;
  }



  public generateExcel(json: any[], name: string): void {
    this.showLoader();
    const org_data = this.orgService.getActiveOrganisation();
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      [`${org_data.name}`],
      [org_data.address],
      [`Email: ${org_data.email} Phone: ${org_data.phone}`],
    ]);

    XLSX.utils.sheet_add_json(worksheet, json, { origin: 'A5' });
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, name);
    swal.fire({
      title: this.translate.instant('Excel Exported'),
      showConfirmButton: false,
      timer: 1500,
      icon: 'success',
    });
  }

  private saveAsExcelFile(buffer: any, name: string): void {
    const data: Blob = new Blob([buffer], { type: this.type });
    FileSaver.saveAs(data, name + '_' + new Date().getTime() + this.extension);
  }

  private showLoader(type = 'Export') {
    swal.fire(
      type === 'Import' ? this.translate.instant("Importing") : this.translate.instant("Exporting"),
      this.translate.instant('Please wait as content is loaded and prepared') + '...',
      'info'
    );
    swal.showLoading();
  }
}
