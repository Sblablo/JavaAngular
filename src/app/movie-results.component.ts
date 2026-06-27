import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TmdbService } from './tmdb.service';

// Composant de présentation des résultats de recherche
@Component({
    selector: 'app-movie-results',
    template: `
    @if (movies !== null) {
      <div>
        @if (movies.length === 0) {
          <div class="empty-state">Aucun résultat</div>
        }
        @if (movies.length > 0) {
          <div>
            @for (m of movies; track m) {
              <div class="movie">
                @if (m.poster_path) {
                  <img class="poster" [src]="imageUrl(m.poster_path)" />
                }
                <div class="movie-info">
                  <a [routerLink]="['/movie', m.id]" class="movie-title">{{m.title}}</a>
                  <div class="movie-metadata">
                    @if (getYear(m.release_date)) {
                      <p><strong>Year:</strong> {{getYear(m.release_date)}}</p>
                    }
                    @if (movieDurations[m.id]) {
                      <p><strong>Duration:</strong> {{movieDurations[m.id]}} min</p>
                    }
                    @if (movieGenres[m.id]) {
                      <p><strong>Genre:</strong> {{movieGenres[m.id]}}</p>
                    }
                    @if (m.original_language) {
                      <p><strong>Language:</strong> {{m.original_language}}</p>
                    }
                    @if (m.vote_average) {
                      <p><strong>Vote:</strong> {{roundToTenth(m.vote_average)}}/10</p>
                    }
                  </div>
                  <p class="movie-overview">{{m.overview}}</p>
                </div>
              </div>
            }
          </div>
        }
      </div>
    }
    @if (movies === null) {
      <div>Loading...</div>
    }
    `,
    standalone: false
})
export class MovieResultsComponent implements OnInit, OnChanges {
  @Input() movies: any[] | null = null;
  movieDurations: { [key: number]: number } = {};
  movieGenres: { [key: number]: string } = {};

  constructor(private tmdb: TmdbService) {}

  ngOnInit() {
    this.loadMovieDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movies']) {
      this.loadMovieDetails();
    }
  }

  loadMovieDetails() {
    if (!this.movies) return;
    this.movies.forEach(movie => {
      if (movie.id && !this.movieDurations[movie.id]) {
        this.tmdb.movieDetails(movie.id).subscribe(
          res => {
            this.movieDurations[movie.id] = res.runtime || 0;
            this.movieGenres[movie.id] = res.genres?.map((g: any) => g.name).join(', ') || '';
          },
          error => {
            console.error('Erreur lors du chargement des détails:', error);
          }
        );
      }
    });
  }

  roundToTenth(num: number): number {
    return Math.round(num * 10) / 10;
  }

  getYear(releaseDate: string): number | null {
    if (!releaseDate) return null;
    return new Date(releaseDate).getFullYear();
  }

  imageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w200${path}`;
  }
}
