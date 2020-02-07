import { NgModule, ModuleWithProviders } from '@angular/core';
import { SlydepayComponent } from './slydepay.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SlydepayConfig } from './slydepay.models';
import { SlydePayConfigInterceptor } from './slydepay.interceptor';

@NgModule({
  declarations: [
    SlydepayComponent
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    SlydepayComponent
  ]
})
export class SlydepayModule {
  static forRoot(config: SlydepayConfig): ModuleWithProviders {
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
