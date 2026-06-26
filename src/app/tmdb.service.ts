import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TmdbService {
  private readonly apiKey = '5d2572ebb9ed67c316d3a3e5601e5e15';
  private readonly readAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDI1NzJlYmI5ZWQ2N2MzMTZkM2EzZTU2MDFlNWUxNSIsIm5iZiI6MTc4MjMxOTEzMS4zNjgsInN1YiI6IjZhM2MwODFiMGNhYzMyZmVmZjY2YjEwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m7J9FUIDtiVrszVvcWkpZd47qxi5_-kvjc69Kd7SzqM';
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.readAccessToken}`,
      'Content-Type': 'application/json;charset=utf-8'
    });
  }

  popularMovies(page = 1): Observable<any> {
    const url = `${this.baseUrl}/movie/popular`;
    const params = new HttpParams().set('page', String(page)).set('api_key', this.apiKey);
    return this.http.get(url, { headers: this.authHeaders(), params });
  }

  movieDetails(id: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${id}`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get(url, { headers: this.authHeaders(), params });
  }

  movieCredits(id: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${id}/credits`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get(url, { headers: this.authHeaders(), params });
  }

  searchMovies(query: string, page = 1, filters: any = {}): Observable<any> {
    const url = `${this.baseUrl}/search/movie`;
    let params = new HttpParams()
      .set('query', query)
      .set('page', String(page))
      .set('api_key', this.apiKey);

    if (filters['with_genres']) {
      params = params.set('with_genres', filters['with_genres']);
    }

    if (filters['primary_release_date.gte']) {
      params = params.set('primary_release_date.gte', filters['primary_release_date.gte']);
    }

    if (filters['primary_release_date.lte']) {
      params = params.set('primary_release_date.lte', filters['primary_release_date.lte']);
    }

    if (filters['vote_average.gte']) {
      params = params.set('vote_average.gte', filters['vote_average.gte']);
    }

    if (filters['vote_average.lte']) {
      params = params.set('vote_average.lte', filters['vote_average.lte']);
    }

    if (filters.with_people) {
      params = params.set('with_people', filters.with_people);
    }

    return this.http.get(url, { headers: this.authHeaders(), params });
  }

  searchPeople(query: string, page = 1): Observable<any> {
    const url = `${this.baseUrl}/search/person`;
    const params = new HttpParams()
      .set('query', query)
      .set('page', String(page))
      .set('api_key', this.apiKey);
    return this.http.get(url, { headers: this.authHeaders(), params });
  }

  discoverMovies(filters: any = {}, page = 1): Observable<any> {
    const url = `${this.baseUrl}/discover/movie`;
    let params = new HttpParams()
      .set('page', String(page))
      .set('api_key', this.apiKey);

    if (filters['with_genres']) {
      params = params.set('with_genres', filters['with_genres']);
    }

    if (filters['primary_release_date.gte']) {
      params = params.set('primary_release_date.gte', filters['primary_release_date.gte']);
    }

    if (filters['primary_release_date.lte']) {
      params = params.set('primary_release_date.lte', filters['primary_release_date.lte']);
    }

    if (filters['vote_average.gte']) {
      params = params.set('vote_average.gte', filters['vote_average.gte']);
    }

    if (filters['vote_average.lte']) {
      params = params.set('vote_average.lte', filters['vote_average.lte']);
    }

    if (filters.with_people) {
      params = params.set('with_people', filters.with_people);
    }

    return this.http.get(url, { headers: this.authHeaders(), params });
  }
}
