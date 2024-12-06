import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../header/header.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { FeaturesComponent } from '../features/features.component';
import { PricingComponent } from '../pricing/pricing.component';
import { FooterComponent } from '../footer/footer.component';
import { TawkChatComponent } from '../../../components/tawk-chat/tawk-chat.component';

@Component({
    selector: 'about-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [HeaderComponent, CarouselComponent, FeaturesComponent, PricingComponent, FooterComponent, TawkChatComponent]
})
export class HomeComponent implements OnInit {

  public _environment = environment;

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          if (element) { element.scrollIntoView(true); }
        }
      }
    });
  }

}
