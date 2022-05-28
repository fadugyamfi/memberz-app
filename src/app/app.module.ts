import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SharedModule } from './shared/shared.module';
import { DragulaModule } from 'ng2-dragula';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';

import { AdminGuard } from './shared/guard/admin.guard';
import { SecureInnerPagesGuard } from './shared/guard/SecureInnerPagesGuard.guard';

import { environment } from '../environments/environment';
import { SlydepayModule } from 'slydepay-angular';
import { LoaderComponent } from './shared/components/loader/loader.component';

import { AvatarModule, AvatarSource } from 'ngx-avatar';
const avatarSourcesOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // SharedModule,
    AppRoutingModule,
    HttpClientModule,
    DragulaModule.forRoot(),
    AvatarModule.forRoot({
      sourcePriorityOrder: avatarSourcesOrder
    }),
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    SlydepayModule.forRoot( environment.slydepay )
  ],
  providers: [AdminGuard, SecureInnerPagesGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
