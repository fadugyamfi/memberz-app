import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private imgWidth: any = 208;
  private pageHeight: any = 295;
  private orientation: String = 'p';
  private unit: String = 'mm';
  private format: String = 'a4';

  constructor() { }

  /**
   *
   * @param data
   * @param name
   * @param position
   */
  generatePdf(data, name: string = 'generate.pdf', position: number = 0) {
    Swal.fire('Exporting PDF', 'Please wait as content is loaded and prepared...', 'info');
    Swal.showLoading();

    html2canvas(data).then(canvas => {
      // setting options
      const imgHeight = canvas.height * this.imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      // exporting
      const pdf = new jspdf(this.orientation, this.unit, this.format);
      pdf.setCreationDate(new Date());
      pdf.addImage(contentDataURL, 'PNG', 0, position, this.imgWidth, imgHeight);
      pdf.save(this.formatName(name));
      Swal.fire({
        type: 'success',
        title: 'PDF Exported',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }

  /**
   *
   * @param name
   */
  formatName(name): string {
    if (name.includes('.pdf')) {
      return name;
    } else {
      return name + '.pdf';
    }
  }
}
