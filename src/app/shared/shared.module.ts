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
import { UiSwitchModule } from 'ngx-ui-switch';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { NgxPrintModule } from 'ngx-print';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ImageCropperModule } from 'ngx-image-cropper';
import { ArchwizardModule } from 'angular-archwizard';

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
import { FinanceWeeklyBreakdownComponent } from './components/charts/finance-weekly-breakdown/finance-weekly-breakdown.component';
import { FinanceCategoryBreakdownComponent } from './components/charts/finance-category-breakdown/finance-category-breakdown.component';
import { FinanceTrendComponent } from './components/charts/finance-trend/finance-trend.component';
import { FinanceTotalsByCategoryComponent } from './components/charts/finance-totals-by-category/finance-totals-by-category.component';
import { ChartsModule } from 'ng2-charts';
import { NoDataAvailableComponent } from './components/forms/no-data-available/no-data-available.component';
import { LoadingRotateDashedComponent } from './components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { PrintLayoutComponent } from './components/layout/print-layout/print-layout.component';
import { PrintFooterComponent } from './components/layout/print-layout/print-footer/print-footer.component';
import { PrintHeaderComponent } from './components/layout/print-layout/print-header/print-header.component';
import { TitleComponent } from './components/title/title.component';
import { SmsSummaryComponent } from './components/charts/sms-summary/sms-summary.component';
import { ViewProfileDirective } from './directives/view-profile.directive';

import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { ProfileSummaryComponent } from './components/profile-view/profile-summary/profile-summary.component';
import { ProfileFamilyComponent } from './components/profile-view/profile-family/profile-family.component';
import { FamilyMemberEditorComponent } from './components/profile-view/profile-family/family-member-editor/family-member-editor.component';
import { ProfileContributionsComponent } from './components/profile-view/profile-contributions/profile-contributions.component';
import { ProfileGroupsComponent } from './components/profile-view/profile-groups/profile-groups.component';
import { ProfileSmsMessagesComponent } from './components/profile-view/profile-sms-messages/profile-sms-messages.component';
import { ProfileSidebarComponent } from './components/profile-view/profile-sidebar/profile-sidebar.component';
import { ProfileHeaderComponent } from './components/profile-view/profile-header/profile-header.component';
import { ProfileAnniversariesComponent } from './components/profile-view/profile-anniversaries/profile-anniversaries.component';
import { ProfileActionsComponent } from './components/profile-view/profile-actions/profile-actions.component';
import { MakeAdminComponent } from './components/profile-view/make-admin/make-admin.component';

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
    SelectPaymentTypeControlComponent,
    FinanceWeeklyBreakdownComponent,
    FinanceCategoryBreakdownComponent,
    FinanceTrendComponent,
    FinanceTotalsByCategoryComponent,
    NoDataAvailableComponent,
    LoadingRotateDashedComponent,
    PrintLayoutComponent,
    PrintFooterComponent,
    PrintHeaderComponent,
    TitleComponent,
    SmsSummaryComponent,
    ViewProfileDirective,
    ProfileViewComponent,
    ProfileSummaryComponent,
    ProfileFamilyComponent,
    FamilyMemberEditorComponent,
    ProfileContributionsComponent,
    ProfileGroupsComponent,
    ProfileSmsMessagesComponent,
    ProfileSidebarComponent,
    ProfileHeaderComponent,
    ProfileAnniversariesComponent,
    ProfileActionsComponent,
    MakeAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DragulaModule.forRoot(),
    NgbModule,
    UiSwitchModule,
    InternationalPhoneNumberModule,
    NgxPrintModule,
    NgxChartsModule,
    ImageCropperModule,
    ChartsModule,
    ArchwizardModule
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
    SelectPaymentTypeControlComponent,
    FinanceWeeklyBreakdownComponent,
    FinanceCategoryBreakdownComponent,
    FinanceTrendComponent,
    FinanceTotalsByCategoryComponent,
    NoDataAvailableComponent,
    LoadingRotateDashedComponent,
    ArchwizardModule,
    SmsSummaryComponent,
    ChartsModule,
    ViewProfileDirective,
    ProfileViewComponent,
    MakeAdminComponent
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
