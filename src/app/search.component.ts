import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  template: `
    <form (submit)="doSearch($event)" class="search-form">
      <input [(ngModel)]="q" name="q" placeholder="Search for a movie" />
      <button type="submit">Search</button>
    </form>
  `
})
export class SearchComponent {
  q = '';
  @Output() search = new EventEmitter<string>();
  constructor(private router: Router) {}

  doSearch(event: Event) {
    event.preventDefault();
    const query = this.q.trim();
    this.router.navigate([], {
      queryParams: { query: query || null },
      queryParamsHandling: 'merge'
    });
    this.search.emit(query);
  }
}
