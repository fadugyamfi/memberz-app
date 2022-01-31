import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { SlydepayComponent } from './slydepay.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SlydepayConfig } from './slydepay.models';
import { SlydePayConfigInterceptor } from './slydepay.interceptor';
import { SlydepayMockComponent } from './slydepay-mock.component';

const routes: Routes = [
  { path: 'slydepay-mock', component: SlydepayMockComponent }
];
@NgModule({
  declarations: [
    SlydepayComponent
  ],
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    SlydepayComponent,
    RouterModule
  ]
})
export class SlydepayModule {
  static forRoot(config: SlydepayConfig): ModuleWithProviders<SlydepayModule> {
    return {
      ngModule: SlydepayModule,
      providers: [
        {
          provide: 'config',
          useValue: config
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SlydePayConfigInterceptor,
          multi: true
        }
      ]
    };
  }
 }
