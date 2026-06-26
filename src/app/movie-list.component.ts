import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from './tmdb.service';

@Component({
  selector: 'app-movie-list',
  template: `
    <form (ngSubmit)="applyFilters()" class="filters-form">
      <div class="filters-grid">
        <label class="filter-group">
          <span>Tri</span>
          <select [(ngModel)]="filters.sort_by" name="sortBy">
            <option value="popularity.desc">Popularité ↓</option>
            <option value="popularity.asc">Popularité ↑</option>
            <option value="release_date.desc">Date de sortie ↓</option>
            <option value="release_date.asc">Date de sortie ↑</option>
            <option value="vote_average.desc">Note ↓</option>
            <option value="vote_average.asc">Note ↑</option>
          </select>
        </label>

        <label class="filter-group">
          <span>Date de sortie min</span>
          <input type="date" [(ngModel)]="filters['primary_release_date.gte']" name="releaseDateGte" />
        </label>

        <label class="filter-group">
          <span>Date de sortie max</span>
          <input type="date" [(ngModel)]="filters['primary_release_date.lte']" name="releaseDateLte" />
        </label>

        <label class="filter-group">
          <span>Note min</span>
          <input type="number" min="0" max="10" step="0.1" [(ngModel)]="filters['vote_average.gte']" name="voteAverageGte" placeholder="0.0" />
        </label>

        <label class="filter-group">
          <span>Note max</span>
          <input type="number" min="0" max="10" step="0.1" [(ngModel)]="filters['vote_average.lte']" name="voteAverageLte" placeholder="10.0" />
        </label>

        <label class="filter-group">
          <span>Réalisateur</span>
          <input [(ngModel)]="filters.with_people" name="withPeople" placeholder="Ex. Christopher Nolan" />
        </label>
      </div>

      <div class="genre-list">
        <label *ngFor="let genre of genres" class="genre-chip">
          <input type="checkbox" [checked]="selectedGenres.includes(genre.id)" (change)="toggleGenre(genre.id)" />
          <span>{{ genre.name }}</span>
        </label>
      </div>

      <div class="filter-actions">
        <button type="submit">Appliquer</button>
        <button type="button" (click)="resetFilters()">Réinitialiser</button>
      </div>
    </form>

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
export class MovieListComponent implements OnInit {
  movies: any[] | null = null;
  hasSearched = false;
  filters: any = {
    sort_by: 'popularity.desc',
    'primary_release_date.gte': '',
    'primary_release_date.lte': '',
    'vote_average.gte': '',
    'vote_average.lte': '',
    with_people: ''
  };
  selectedGenres: number[] = [];
  currentQuery = '';
  genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Aventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comédie' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentaire' },
    { id: 18, name: 'Drame' },
    { id: 10751, name: 'Familial' },
    { id: 14, name: 'Fantastique' },
    { id: 36, name: 'Histoire' },
    { id: 27, name: 'Horreur' },
    { id: 10402, name: 'Musique' },
    { id: 9648, name: 'Mystère' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science-fiction' },
    { id: 10770, name: 'Téléfilm' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'Guerre' },
    { id: 37, name: 'Western' }
  ];

  constructor(private tmdb: TmdbService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.currentQuery = params.get('query')?.trim() ?? '';
      this.loadMovies();
    });
  }

  applyFilters() {
    this.loadMovies();
  }

  resetFilters() {
    this.filters = {
      sort_by: 'popularity.desc',
      'primary_release_date.gte': '',
      'primary_release_date.lte': '',
      'vote_average.gte': '',
      'vote_average.lte': '',
      with_people: ''
    };
    this.selectedGenres = [];
    this.loadMovies();
  }

  toggleGenre(genreId: number) {
    const index = this.selectedGenres.indexOf(genreId);
    if (index >= 0) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(genreId);
    }
  }

  private loadMovies() {
    const queryFilters: any = { ...this.filters };
    if (this.selectedGenres.length > 0) {
      queryFilters.with_genres = this.selectedGenres.join(',');
    }

    const directorName = (this.filters.with_people || '').trim();
    if (directorName) {
      this.tmdb.searchPeople(directorName).subscribe(res => {
        const person = res.results?.[0];
        queryFilters.with_people = person?.id ? String(person.id) : '';
        this.executeLoad(queryFilters);
      });
      return;
    }

    this.executeLoad(queryFilters);
  }

  private executeLoad(queryFilters: any) {
    const query = this.currentQuery;
    if (query) {
      this.hasSearched = true;
      this.tmdb.searchMovies(query, 1, queryFilters).subscribe(res => {
        this.movies = this.applySort(res.results || []);
      });
      return;
    }

    this.hasSearched = false;
    this.tmdb.discoverMovies(queryFilters).subscribe(res => {
      this.movies = this.applySort(res.results || []);
    });
  }

  private applySort(results: any[]) {
    const sortBy = this.filters.sort_by || 'popularity.desc';
    const [field, direction] = sortBy.split('.');
    const isAsc = direction === 'asc';

    return results.slice().sort((a, b) => {
      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);
      if (valueA < valueB) {
        return isAsc ? -1 : 1;
      }
      if (valueA > valueB) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
  }

  private getSortValue(item: any, field: string): number {
    if (field === 'release_date') {
      const value = item.release_date || '1900-01-01';
      return new Date(value).getTime();
    }
    return Number(item[field] ?? 0);
  }

  imageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w200${path}`;
  }
}
