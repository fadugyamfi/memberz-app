import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET, RouterLink } from '@angular/router';

import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { UpperCasePipe } from '@angular/common';
import { BookmarkComponent } from '../bookmark/bookmark.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    imports: [RouterLink, FeatherIconsComponent, BookmarkComponent, UpperCasePipe, TranslateModule]
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs;
  public title: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        const snapshot = this.router.routerState.snapshot;
        const title = route.snapshot.data.title;
        const parent = route.parent.snapshot.data.breadcrumb;
        const grandparent = route.parent.parent ? route.parent.parent.snapshot.data.breadcrumb : null;
        const child = route.snapshot.data.breadcrumb;
        this.breadcrumbs = {};
        this.title = title;
        this.breadcrumbs = {
          grandParentBreadcrumb: grandparent && grandparent !== parent && ['Organisation'].indexOf(grandparent) === -1 ? grandparent : null,
          parentBreadcrumb: parent,
          childBreadcrumb: child
        };
      });
  }

  ngOnInit() {  }

}
