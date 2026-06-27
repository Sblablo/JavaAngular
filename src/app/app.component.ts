import { Component } from '@angular/core';

// AppComponent : Root componant that acts as the main shell of the application
// It holds the global layout: the header, the search bar (SearchComponent), 
// and the <router-outlet> which renders the correct component based on the current URL

@Component({
    selector: 'app-root',
    template: `
    <div class="header"><h1>NotNetflix</h1></div>
    <div class="container">
      <app-search (search)="onSearch($event)"></app-search>
      <router-outlet></router-outlet>
    </div>
  `,
    standalone: false
})

export class AppComponent {
  onSearch(query: string) {
    // navigation handled inside SearchComponent for simplicity
  }
}
