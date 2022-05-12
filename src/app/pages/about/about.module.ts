import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { HomeComponent } from './home/home.component';
import { PricingComponent } from './pricing/pricing.component';
import { HeaderComponent } from './header/header.component';
import { FeaturesComponent } from './features/features.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    HomeComponent,
    PricingComponent,
    HeaderComponent,
    FeaturesComponent,
    FooterComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    NgbModule
  ]
})
export class AboutModule { }
