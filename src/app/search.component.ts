import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TmdbService } from './tmdb.service';

@Component({
  selector: 'app-search',
  template: `
    <form (submit)="doSearch($event)">
      <input [(ngModel)]="q" name="q" placeholder="Rechercher un film..." />
      <button type="submit">Recherche</button>
    </form>
    <div *ngIf="results">
      <div *ngFor="let r of results" class="movie">
        <img *ngIf="r.poster_path" class="poster" [src]="imageUrl(r.poster_path)" />
        <div>
          <a [routerLink]="['/movie', r.id]">{{r.title}}</a>
          <p>{{r.overview}}</p>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent {
  q = '';
  results: any[] | null = null;
  @Output() search = new EventEmitter<string>();
  constructor(private tmdb: TmdbService, private router: Router) {}

  doSearch(event: Event) {
    event.preventDefault();
    if (!this.q) { this.results = null; return; }
    this.tmdb.searchMovies(this.q).subscribe(res => this.results = res.results);
    this.search.emit(this.q);
  }

  imageUrl(path: string) { return `https://image.tmdb.org/t/p/w200${path}`; }
}
