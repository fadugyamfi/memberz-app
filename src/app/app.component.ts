import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SystemThemeService } from './shared/services/system-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Memberz.Org';

  constructor(public systemThemeService: SystemThemeService) {}
}
