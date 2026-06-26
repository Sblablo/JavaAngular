import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from './tmdb.service';

// Composant de détail d'un film
@Component({
  selector: 'app-movie-detail',
  template: `
    <div *ngIf="movie" class="movie-detail">
      <div class="detail-container">
        <img *ngIf="movie.poster_path" class="detail-poster" [src]="imageUrl(movie.poster_path)" />
        <div class="detail-info">
          <h2>{{movie.title}}</h2>
          <div class="info-grid">
            <p *ngIf="getYear(movie.release_date)"><strong>Année:</strong> {{getYear(movie.release_date)}}</p>
            <p *ngIf="movie.runtime"><strong>Durée:</strong> {{movie.runtime}} min</p>
            <p *ngIf="getGenres(movie.genres)"><strong>Genre:</strong> {{getGenres(movie.genres)}}</p>
            <p *ngIf="movie.original_language"><strong>Langue:</strong> {{movie.original_language}}</p>
            <p *ngIf="movie.vote_average"><strong>Note:</strong> {{roundToTenth(movie.vote_average)}}/10</p>
            <p *ngIf="movie.status"><strong>Statut:</strong> {{movie.status}}</p>
            <p *ngIf="movie.budget"><strong>Budget:</strong> {{movie.budget ? formatCurrency(movie.budget) : 'N/A'}}</p>
            <p *ngIf="movie.revenue"><strong>Revenu:</strong> {{movie.revenue ? formatCurrency(movie.revenue) : 'N/A'}}</p>
            <p *ngIf="movie.tagline"><strong>Tagline:</strong> {{movie.tagline}}</p>
          </div>
        </div>
      </div>
      <div class="synopsis-section">
        <h3>Synopsis</h3>
        <p>{{movie.overview}}</p>
      </div>
    </div>
    <div *ngIf="!movie">Chargement...</div>
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
  movie: any | null = null;
  constructor(private route: ActivatedRoute, private tmdb: TmdbService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tmdb.movieDetails(id).subscribe(res => this.movie = res);
    }
  }

  getYear(releaseDate: string): number | null {
    if (!releaseDate) return null;
    return new Date(releaseDate).getFullYear();
  }

  getGenres(genres: any[]): string {
    if (!genres) return '';
    return genres.map((g: any) => g.name).join(', ');
  }

  formatCurrency(num: number): string {
    if (!num) return '0';
    return '$' + num.toLocaleString('fr-FR');
  }

  roundToTenth(num: number): number {
    return Math.round(num * 10) / 10;
  }

  imageUrl(path: string) { return `https://image.tmdb.org/t/p/w300${path}`; }
}
