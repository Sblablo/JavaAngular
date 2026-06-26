import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TmdbService } from './tmdb.service';

// Composant de logique transmettant les filtres et résultats
@Component({
  selector: 'app-movie-list',
  template: `
    <app-movie-filters
      [filters]="filters"
      [genres]="genres"
      [selectedGenres]="selectedGenres"
      (filtersChange)="onFiltersChange($event)"
      (selectedGenresChange)="onSelectedGenresChange($event)"
      (resetFilters)="resetFilters()"
    ></app-movie-filters>

    <app-movie-results [movies]="movies"></app-movie-results>
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
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Familial' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science-fiction' },
    { id: 10770, name: 'Television film' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ];

  constructor(private tmdb: TmdbService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.currentQuery = params.get('query')?.trim() ?? '';
      this.loadMovies();
    });
  }

  // Applique les filtre, et appel la recharge de la liste de films
  onFiltersChange(nextFilters: any) {
    this.filters = nextFilters;
    this.applyFilters();
  }

  // Applique les genres sélectionnés et recharge la liste de films
  onSelectedGenresChange(nextGenres: number[]) {
    this.selectedGenres = nextGenres;
    this.applyFilters();
  }

  // Recharge la liste des films avec les filtres sélectionnés
  applyFilters() {
    this.loadMovies();
  }

  // Remet les filtres à 0
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

  // Recharge la liste des films
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

  // Exécute la recherche de films
  private executeLoad(queryFilters: any) {
    const query = this.currentQuery;
    if (query) {
      this.hasSearched = true;
      this.tmdb.searchMovies(query, 1).subscribe(res => {
        const results: { id: number }[] = res.results ?? [];
        const directorName = (this.filters.with_people || '').trim();

        if (directorName) {
          const creditRequests = results.map((movie: any) => this.tmdb.movieCredits(movie.id));
          forkJoin(creditRequests).subscribe(creditResponses => {
            const filteredResults = results.filter((movie: any, index: number) => {
              const crew = creditResponses[index]?.crew || [];
              return crew.some((person: any) =>
                person.job === 'Director' && person.name?.toLowerCase() === directorName.toLowerCase()
              );
            });
            this.movies = this.applyFiltersAndSort(filteredResults, queryFilters);
          });
          return;
        }

        this.movies = this.applyFiltersAndSort(results, queryFilters);
      });
      return;
    }

    this.hasSearched = false;
    this.tmdb.discoverMovies(queryFilters).subscribe(res => {
      this.movies = this.applyFiltersAndSort(res.results || [], queryFilters);
    });
  }

  // Applique les filtres et le tri sur les résultats de films
  private applyFiltersAndSort(results: any[], queryFilters: any) {
    let filteredResults = results.slice();

    if (this.selectedGenres.length > 0) {
      filteredResults = filteredResults.filter((item: any) =>
        item.genre_ids?.some((genreId: number) => this.selectedGenres.includes(genreId))
      );
    }

    const minDate = (queryFilters['primary_release_date.gte'] || '').toString();
    if (minDate) {
      filteredResults = filteredResults.filter((item: any) => !item.release_date || item.release_date >= minDate);
    }

    const maxDate = (queryFilters['primary_release_date.lte'] || '').toString();
    if (maxDate) {
      filteredResults = filteredResults.filter((item: any) => !item.release_date || item.release_date <= maxDate);
    }

    const minVote = (queryFilters['vote_average.gte'] || '').toString();
    if (minVote) {
      filteredResults = filteredResults.filter((item: any) => Number(item.vote_average ?? 0) >= Number(minVote));
    }

    const maxVote = (queryFilters['vote_average.lte'] || '').toString();
    if (maxVote) {
      filteredResults = filteredResults.filter((item: any) => Number(item.vote_average ?? 0) <= Number(maxVote));
    }

    return this.applySort(filteredResults);
  }

  // Applique le tri sur les résultats de films
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
}
