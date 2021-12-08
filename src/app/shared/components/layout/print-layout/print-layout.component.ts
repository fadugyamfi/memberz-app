import { Component, OnInit } from '@angular/core';
import { PrintService } from "../../../services/print.service";

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss']
})
export class PrintLayoutComponent implements OnInit {

  constructor(
    public printService: PrintService
  ) { }

  ngOnInit(): void {
  }

}
