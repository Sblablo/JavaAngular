import { Component } from '@angular/core';

// Composant racine de l'application
@Component({
  selector: 'app-root',
  template: `
    <div class="header"><h1>NotNetflix</h1></div>
    <div class="container">
      <app-search (search)="onSearch($event)"></app-search>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  onSearch(query: string) {
    // navigation handled inside SearchComponent for simplicity
  }
}
