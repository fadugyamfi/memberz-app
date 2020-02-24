import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

export interface PrintParams {
  url: string;
  options?: {
    title?: string;
    header?: boolean;
    footer?: boolean;
    pageNumbers?: boolean;
  };
  params?: object;
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  public isPrinting = false;
  public printMetaData: any;
  public params = {};

  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * Trigger the print process by passing a set of print parameters
   *
   * Print params
   * - url: The URL of the page to print
   * - options: The options to configure the print out. These include print title, and show/hide header or footer
   * - params: The params to pass to any actions to fetch data from the backend
   *
   * @param data PrintParams
   */
  print(data: PrintParams) {
    this.isPrinting = true;

    Swal.fire(
      'Printing Document',
      'Please wait as content is loaded and prepared...',
      'info'
    );
    Swal.showLoading();

    const path = ['print', ...data.url.split('/')];

    this.setPrintMetaData(data.options || {});
    this.setParams(data.params || {});

    this.router.navigate(['/', { outlets: { print: path } }]);
  }

  /**
   *
   * @param documentName
   * @param documentData
   * @param joinDelimiter
   * @deprecated use print() method instead for better flexibility
   */
  printDocument(
    documentName: string,
    documentData: string[] = null,
    joinDelimiter = ','
  ) {
    this.isPrinting = true;

    Swal.fire(
      'Printing Document',
      'Please wait as content is loaded and prepared...',
      'info'
    );
    Swal.showLoading();

    const path = ['print', ...documentName.split('/')];

    if (documentData) {
      path.push(documentData.join(joinDelimiter));
    }

    this.setPrintMetaData({});
    this.router.navigate(['/', { outlets: { print: path } }]);
  }

  isPrintRoute() {
    return this.route.routeConfig.outlet == 'print';
  }

  onDataReady() {
    Swal.close();

    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null } }]);
    }, 500);
  }

  setPrintMetaData(params) {
    this.printMetaData = Object.assign(
      {
        title: '',
        header: true,
        footer: true,
        pageNumbers: false
      },
      params
    );
  }

  setParams(params) {
    this.params = params;
  }
}
