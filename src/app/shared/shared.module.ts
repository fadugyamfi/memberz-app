import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContentLayoutComponent } from './components/layout/content-layout/content-layout.component';
import { FullLayoutComponent } from './components/layout/full-layout/full-layout.component';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { BookmarkComponent } from './components/bookmark/bookmark.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomizerComponent } from './components/customizer/customizer.component';
import { DragulaModule } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { UiSwitchModule } from 'ngx-ui-switch';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { NgxPrintModule } from 'ngx-print';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import 'hammerjs';
import 'mousetrap';

import { ImageCropperModule } from 'ngx-image-cropper';

// services
import { NavService } from './services/nav.service';
import { ChatService } from './services/chat.service';
import { CustomizerService } from './services/customizer.service';
import { ExcelService } from './services/excel.service';

// Directives
import { ToggleFullscreenDirective } from './directives/fullscreen.directive';
import { PortalLayoutComponent } from './components/layout/portal-layout/portal-layout.component';
import { OrganisationLayoutComponent } from './components/layout/organisation-layout/organisation-layout.component';
import { RequestErrorHandler } from './services/interceptors/request-error-handler.service';
import { RequestInterceptor } from './services/interceptors/request-interceptor.service';
import { OrganisationSidebarComponent } from './components/organisation-sidebar/organisation-sidebar.component';
import { OrganisationInterceptor } from './services/interceptors/organisation-interceptor.service';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ImagePreloadDirective } from './directives/image-preload.directive';
import { SubscriptionStatusComponent } from './components/subscription-status/subscription-status.component';
import { MemberControlComponent } from './components/forms/member-control/member-control.component';
import { SmsMessengerComponent } from './components/messaging/sms-messenger/sms-messenger.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { SelectMonthControlComponent } from './components/forms/select-month-control/select-month-control.component';
import { SelectYearControlComponent } from './components/forms/select-year-control/select-year-control.component';
import { SelectBankControlComponent } from './components/forms/select-bank-control/select-bank-control.component';
import { SelectCurrencyControlComponent } from './components/forms/select-currency-control/select-currency-control.component';
import { SelectPaymentTypeControlComponent } from './components/forms/select-payment-type-control/select-payment-type-control.component';

@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    BookmarkComponent,
    RightSidebarComponent,
    ContentLayoutComponent,
    FullLayoutComponent,
    FeatherIconsComponent,
    ToggleFullscreenDirective,
    ImagePreloadDirective,
    BreadcrumbComponent,
    CustomizerComponent,
    PortalLayoutComponent,
    OrganisationLayoutComponent,
    OrganisationSidebarComponent,
    PaginationComponent,
    SubscriptionStatusComponent,
    MemberControlComponent,
    SmsMessengerComponent,
    InvoiceComponent,
    ImageCropperComponent,
    SelectMonthControlComponent,
    SelectYearControlComponent,
    SelectBankControlComponent,
    SelectCurrencyControlComponent,
    SelectPaymentTypeControlComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DragulaModule.forRoot(),
    NgbModule,
    GalleryModule.forRoot(),
    UiSwitchModule,
    InternationalPhoneNumberModule,
    NgxPrintModule,
    NgxChartsModule,
    ImageCropperModule
  ],
  exports: [
    LoaderComponent,
    FeatherIconsComponent,
    PaginationComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    ImagePreloadDirective,
    InternationalPhoneNumberModule,
    SubscriptionStatusComponent,
    NgbModule,
    NgxPrintModule,
    MemberControlComponent,
    SmsMessengerComponent,
    InvoiceComponent,
    NgxChartsModule,
    ImageCropperModule,
    ImageCropperComponent,
    SelectMonthControlComponent,
    SelectYearControlComponent,
    SelectBankControlComponent,
    SelectCurrencyControlComponent,
    SelectPaymentTypeControlComponent
  ],
  providers: [
    NavService,
    ChatService,
    CustomizerService,
    ExcelService,

    // error handling
    RequestErrorHandler,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },

    // appending organisation_id to requests
    { provide: HTTP_INTERCEPTORS, useClass: OrganisationInterceptor, multi: true },
  ]
})
export class SharedModule { }
