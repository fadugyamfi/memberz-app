import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { HomeComponent } from './home/home.component';
import { PricingComponent } from './pricing/pricing.component';
import { HeaderComponent } from './header/header.component';
import { FeaturesComponent } from './features/features.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TawkChatModule } from '../../components/tawk-chat/tawk-chat.module';
import { AuthService } from 'src/app/shared/services/api/auth.service';

@NgModule({
    imports: [
        CommonModule,
        AboutRoutingModule,
        NgbModule,
        TawkChatModule,
        HomeComponent,
        PricingComponent,
        HeaderComponent,
        FeaturesComponent,
        FooterComponent,
        CarouselComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent
    ]
})
export class AboutModule implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }
}