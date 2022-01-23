import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemThemeService {

  private drakThemeMatcher;

  constructor() {
    this.drakThemeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    this.drakThemeMatcher.addEventListener('change', (event) => {
      this.updateTheme( event.matches );
    });

    setTimeout(() => this.matchSystemTheme(), 1000);
  }

  matchSystemTheme() {
    this.updateTheme(this.drakThemeMatcher.matches);
  }

  useDarkTheme() {
    const classList = document.querySelector('body').classList;
    classList.add('dark-only');
    classList.remove('default');
  }

  useDefaultTheme() {
    const classList = document.querySelector('body').classList;
    classList.add('default');
    classList.remove('dark-only');
  }

  updateTheme(systemIsInDarkMode) {
    if( systemIsInDarkMode ) {
      this.useDarkTheme();
    } else {
      this.useDefaultTheme();
    }
  }
}
