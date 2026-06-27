import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

// Movie search bar

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

  // Updates the URL query params and notifies the parent component
  doSearch(event: Event) {
    event.preventDefault();
    const query = this.q.trim(); // Trim whitespace so "   " is treated the same as an empty search
    this.router.navigate([], {
      queryParams: { query: query || null },
      queryParamsHandling: 'merge'
    });
    this.search.emit(query); // Notify the parent that a search was triggered
  }
}
