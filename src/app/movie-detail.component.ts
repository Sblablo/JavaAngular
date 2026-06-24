import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from './tmdb.service';

@Component({
  selector: 'app-movie-detail',
  template: `
    <div *ngIf="movie">
      <h2>{{movie.title}}</h2>
      <img *ngIf="movie.poster_path" [src]="imageUrl(movie.poster_path)" />
      <p>{{movie.overview}}</p>
    </div>
    <div *ngIf="!movie">Chargement...</div>
  `
})
export class MovieDetailComponent implements OnInit {
  movie: any | null = null;
  constructor(private route: ActivatedRoute, private tmdb: TmdbService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tmdb.movieDetails(id).subscribe(res => this.movie = res);
    }
  }

  imageUrl(path: string) { return `https://image.tmdb.org/t/p/w300${path}`; }
}
