import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-title',
    template: '<span></span>',
    standalone: true
})
export class TitleComponent {
  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private translate: TranslateService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentRoute = this.route.root;
        let title = '';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              title = routes.snapshot.data.title;
              currentRoute = routes;
            }
          });
        } while (currentRoute);
        if (title !== undefined ) {
          this.titleService.setTitle(title + ' | ' + this.translate.instant('Multi-Purpose Membership Management Platform') );
        }
      });
  }
}
