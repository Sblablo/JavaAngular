import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from './tmdb.service';

// Full movie detail page

@Component({
  selector: 'app-movie-detail',
  template: `
    @if (movie) {
      <div class="movie-detail">
        <div class="detail-container">
          @if (movie.poster_path) {
            <img class="detail-poster" [src]="imageUrl(movie.poster_path)" />
          }
          <div class="detail-info">
            <h2>{{movie.title}}</h2>
            <div class="info-grid">
              @if (getYear(movie.release_date)) {
                <p><strong>Year:</strong> {{getYear(movie.release_date)}}</p>
              }
              @if (movie.runtime) {
                <p><strong>Duration:</strong> {{movie.runtime}} min</p>
              }
              @if (getGenres(movie.genres)) {
                <p><strong>Genre:</strong> {{getGenres(movie.genres)}}</p>
              }
              @if (movie.original_language) {
                <p><strong>Language:</strong> {{movie.original_language}}</p>
              }
              @if (movie.vote_average) {
                <p><strong>Vote:</strong> {{roundToTenth(movie.vote_average)}}/10</p>
              }
              @if (movie.status) {
                <p><strong>Status:</strong> {{movie.status}}</p>
              }
              @if (movie.budget) {
                <p><strong>Budget:</strong> {{movie.budget ? formatCurrency(movie.budget) : 'N/A'}}</p>
              }
              @if (movie.revenue) {
                <p><strong>Revenue:</strong> {{movie.revenue ? formatCurrency(movie.revenue) : 'N/A'}}</p>
              }
              @if (movie.tagline) {
                <p><strong>Tagline:</strong> {{movie.tagline}}</p>
              }
            </div>
          </div>
        </div>
        <div class="synopsis-section">
          <h3>Synopsis</h3>
          <p>{{movie.overview}}</p>
        </div>
      </div>
    }
    @if (!movie) {
      <div>Loading...</div>
    }
    `,
  styles: [`
    .movie-detail {
        background: white;
        border-radius: 8px;
        padding: 20px;
    }

    .detail-container {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
    }

    .detail-poster {
        width: 300px;
        height: auto;
        flex-shrink: 0;
        border-radius: 8px;
    }

    .detail-info {
        flex: 1;
        min-width: 0;
    }

    .detail-info h2 {
        margin: 0 0 16px 0;
        font-size: 28px;
        color: #333;
    }

    .info-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
    }

    .info-grid p {
        margin: 0;
        font-size: 16px;
        color: #555;
        line-height: 1.6;
    }

    .info-grid strong {
        color: #333;
        font-weight: 600;
    }

    .synopsis-section {
        border-top: 1px solid #ddd;
        padding-top: 20px;
    }

    .synopsis-section h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #333;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .synopsis-section p {
        margin: 0;
        font-size: 14px;
        color: #666;
        line-height: 1.6;
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: any | null = null; // Full movie data once the API response is received
  constructor(private route: ActivatedRoute, private tmdb: TmdbService) {}

  ngOnInit() { // The movie ID is extracted from the URL and used to fetch the movie details
    const id = Number(this.route.snapshot.paramMap.get('id')); // snapshot because the ID won't change while we're on this page
    if (id) {
      this.tmdb.movieDetails(id).subscribe(res => this.movie = res);
    }
  }

  // Extracts the release year from a date string and return null if the date is missing
  getYear(releaseDate: string): number | null {
    if (!releaseDate) return null;
    return new Date(releaseDate).getFullYear();
  }

  // Joins the genres into a comma separated string
  getGenres(genres: any[]): string {
    if (!genres) return '';
    return genres.map((g: any) => g.name).join(', ');
  }

  // Formats a number as a dollar amount with French locale thousands separators
  formatCurrency(num: number): string {
    if (!num) return '0';
    return '$' + num.toLocaleString('fr-FR');
  }

  roundToTenth(num: number): number {
    return Math.round(num * 10) / 10;
  }

  // Builds the full poster URL using size w300, larger than the list thumbnails
  // for a better render on the detail page
  imageUrl(path: string) { return `https://image.tmdb.org/t/p/w300${path}`; }
}
