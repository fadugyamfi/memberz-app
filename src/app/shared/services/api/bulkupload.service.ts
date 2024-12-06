import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { ExcelService } from '../excel.service';
import { MemberService } from './member.service';
import { Member } from '../../model/api/member';

@Injectable({
  providedIn: 'root',
})
export class BulkUploadService extends APIService<Member> {
  public memberHeaders = [
    'Category Name',
    'Membership ID',
    'Title',
    'Surname',
    'Other Names',
    'Mobile Number',
    'Email',
    'Place of Work',
    'Occupation',
    'Marital Status',
    'Gender',
    'Date Of Birth',
    'Address',
    'Nationality',
  ];

  public categoryHeaders = [
    'Category Name',
    'Parent Category Name',
    'Description',
    'Auto Generate IDs',
    'ID Prefix',
    'ID Suffix',
    'Starting ID',
  ];
  public excelData: { data: any[][] | null, headers: any | null} | null = { data: null, headers: null };
  public isValid = false;
  private headersValidations = [];

  constructor(
    http: HttpClient,
    protected events: EventsService,
    protected storage: StorageService,
    protected excelService: ExcelService,
    protected memberService: MemberService
  ) {
    super(http, events, storage);
    this.url = '/bulk-uploads';
  }

  getModuleHeader(type) {
    const modules = {
      category: this.categoryHeaders,
      member: this.memberHeaders,
    };
    return modules[type];
  }

  importMembershipTemplate(evt) {
    // wire up file reader
    const target: DataTransfer =  evt.target as DataTransfer;
    if (target.files.length !== 1) {
      console.log('Cannot use multiple files');
      return;
    }

    this.headersValidations = [];
    this.excelService.import(target.files[0], this.memberHeaders)
      .subscribe(excelImport => {
        console.log(excelImport);

        if( this.excelData ) {
          this.excelData.data = excelImport.data;
          this.excelData.headers = excelImport.headers;
        }
        this.isValid = this.isImportedDataValid(excelImport.headers, 'member'); // TODO: validate headers
      });
  }

  private isImportedDataValid(headers: any[] = [], module = 'member') {
    const moduleHeaders = this.getModuleHeader(module);
    if (headers.length !== moduleHeaders.length) {
      return false;
    }

    for (let i = 0; i < moduleHeaders.length; i++) {
      if ( moduleHeaders[i] !== headers[i] ) {
        return false;
      }
    }

    return true;
  }

  uploadImportedMemberships() {
    if( !this.excelData ) return;
    
    this.excelData.data?.forEach(attributes => {
      if ( !Array.isArray(attributes) ) {
        const member = new Member(attributes);
        console.log(member);
        // this.memberService.create(member);
      }
    });
  }
}
