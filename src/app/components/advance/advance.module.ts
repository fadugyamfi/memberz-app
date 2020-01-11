import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { NgModule } from "@angular/core";
import { ScrollableComponent } from "./scrollable/scrollable.component";
import { NgxToastrComponent } from "./ngx-toastr/ngx-toastr.component";
import { SweetAlertComponent } from "./sweet-alert/sweet-alert.component";
import { RangeSliderComponent } from "./range-slider/range-slider.component";
import { DragDropComponent } from "./drag-drop/drag-drop.component";
import { UploadComponent } from "./upload/upload.component";
import { StickyComponent } from "./sticky/sticky.component";
import { ImageCropComponent } from "./image-crop/image-crop.component";
import { OwlCarouselComponent } from "./owl-carousel/owl-carousel.component";
import { TourComponent, HintModule } from "angular-custom-tour";
import { NgxDropzoneComponent } from "./ngx-dropzone/ngx-dropzone.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { AdvanceRoutingModule } from "./advance-routing.module";
import { Ng5SliderModule } from "ng5-slider";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageCropperModule } from "./image-crop/image-cropper/image-cropper.module";
import { DragulaModule } from "ng2-dragula";
import { FileUploadModule } from "ng2-file-upload";
import { CarouselModule } from "ngx-owl-carousel-o";

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFilesize: 50,
  url: 'https://httpbin.org/post',
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
  wheelPropagation: false
};

@NgModule({
  declarations: [
    ScrollableComponent, 
    NgxToastrComponent, 
    SweetAlertComponent, 
    RangeSliderComponent, 
    DragDropComponent, 
    UploadComponent, 
    StickyComponent, 
    ImageCropComponent, 
    OwlCarouselComponent, 
    TourComponent, 
    NgxDropzoneComponent
  ],
  imports: [
    CommonModule,
    AdvanceRoutingModule,
    Ng5SliderModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    DragulaModule.forRoot(),
    FileUploadModule,
    CarouselModule,
    HintModule.forRoot(),
    DropzoneModule,
    PerfectScrollbarModule,
  ],
  providers: [
    { provide: DROPZONE_CONFIG, useValue: DEFAULT_DROPZONE_CONFIG },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
})
export class AdvanceModule { }
