import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Composant de présentation des résultats de recherche
@Component({
  selector: 'app-movie-results',
  template: `
    <div *ngIf="movies !== null">
      <div *ngIf="movies.length === 0" class="empty-state">Aucun résultat</div>
      <div *ngIf="movies.length > 0">
        <div *ngFor="let m of movies" class="movie">
          <img *ngIf="m.poster_path" class="poster" [src]="imageUrl(m.poster_path)" />
          <div>
            <a [routerLink]="['/movie', m.id]">{{m.title}}</a>
            <p>{{m.overview}}</p>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="movies === null">Chargement...</div>
  `
})
export class MovieResultsComponent {
  @Input() movies: any[] | null = null;

  imageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w200${path}`;
  }
}
