import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TmdbService } from './tmdb.service';

@Component({
  selector: 'app-movie-list',
  template: `
    <div *ngIf="movies">
      <div *ngFor="let m of movies" class="movie">
        <img *ngIf="m.poster_path" class="poster" [src]="imageUrl(m.poster_path)" />
        <div>
          <a [routerLink]="['/movie', m.id]">{{m.title}}</a>
          <p>{{m.overview}}</p>
        </div>
      </div>
    </div>
    <div *ngIf="!movies">Chargement...</div>
  `
})
export class MovieListComponent implements OnInit {
  movies: any[] | null = null;
  constructor(private tmdb: TmdbService, private router: Router) {}

  ngOnInit() {
    this.tmdb.popularMovies().subscribe(res => this.movies = res.results);
  }

  imageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w200${path}`;
  }
}
