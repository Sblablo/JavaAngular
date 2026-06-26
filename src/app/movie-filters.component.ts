import { Component, EventEmitter, Input, Output } from '@angular/core';

// Composant de filtrage des films
@Component({
  selector: 'app-movie-filters',
  templateUrl: './movie-filters.component.html'
})
export class MovieFiltersComponent {
  @Input() filters: any = {};
  @Input() genres: any[] = [];
  @Input() selectedGenres: number[] = [];

  @Output() filtersChange = new EventEmitter<any>();
  @Output() selectedGenresChange = new EventEmitter<number[]>();
  @Output() resetFilters = new EventEmitter<void>();

  // Met à jour les filtres, émet l'événement filtersChange
  onFiltersChange() {
    this.filtersChange.emit({ ...this.filters });
  }

  // Ajoute ou supprime un genre sélectionné, émet l'événement selectedGenresChange
  toggleGenre(genreId: number) {
    const index = this.selectedGenres.indexOf(genreId);
    if (index >= 0) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(genreId);
    }

    this.selectedGenresChange.emit([...this.selectedGenres]);
  }

  // Réinitialise les filtres, émet l'événement resetFilters
  reset() {
    this.resetFilters.emit();
  }
}
