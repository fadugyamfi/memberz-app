import { Component, OnInit } from '@angular/core';
import { PrintService } from "../../../services/print.service";
import { NgIf, TitleCasePipe } from '@angular/common';
import { PrintHeaderComponent } from './print-header/print-header.component';
import { RouterOutlet } from '@angular/router';
import { LoadingRotateDashedComponent } from '../../forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { TitleComponent } from '../../title/title.component';
import { PrintFooterComponent } from './print-footer/print-footer.component';

@Component({
    selector: 'app-print-layout',
    templateUrl: './print-layout.component.html',
    styleUrls: ['./print-layout.component.scss'],
    standalone: true,
    imports: [NgIf, PrintHeaderComponent, RouterOutlet, LoadingRotateDashedComponent, TitleComponent, PrintFooterComponent, TitleCasePipe]
})
export class PrintLayoutComponent implements OnInit {

  constructor(
    public printService: PrintService
  ) { }

  ngOnInit(): void {
  }

}
