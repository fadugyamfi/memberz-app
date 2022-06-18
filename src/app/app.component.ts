import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { OrganisationService } from './shared/services/api/organisation.service';
import { SystemThemeService } from './shared/services/system-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Memberz.Org';

  constructor(
    public systemThemeService: SystemThemeService,
    public router: Router,
    public titleService: Title,
    public organisationService: OrganisationService
  ) {}

  ngOnInit(): void {
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route: ActivatedRoute = this.router.routerState.root;
        let routeTitle = '';
        while (route!.firstChild) {
          route = route.firstChild;
        }
        if (route.snapshot.data['title']) {
          routeTitle = route!.snapshot.data['title'];
        }
        return routeTitle;
      })
    )
    .subscribe((title: string) => {
      const organisation = this.organisationService.getActiveOrganisation();

      if (!title) {
        this.titleService.setTitle(`Memberz.Org`);
        return;
      }

      if( organisation ) {
        title = `${title} - ${organisation.name}`;
      }

      this.titleService.setTitle(`${title} - Memberz.Org`);
    });
  }
}
