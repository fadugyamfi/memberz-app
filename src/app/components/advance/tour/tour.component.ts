import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HintService } from 'angular-custom-tour'

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
  providers: [HintService],
  encapsulation: ViewEncapsulation.None

})

export class TourComponent implements OnInit {

  public url: any;
  public serviceInit: any;

  constructor(public hintService: HintService) { }

  ngOnInit() { }

  startTour() {
    this.hintService.initialize();
  }

  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }
}
