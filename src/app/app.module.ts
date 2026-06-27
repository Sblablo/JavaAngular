import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list.component';
import { MovieDetailComponent } from './movie-detail.component';
import { SearchComponent } from './search.component';
import { MovieFiltersComponent } from './movie-filters.component';
import { MovieResultsComponent } from './movie-results.component';
import { TmdbService } from './tmdb.service';


// Application routes :
// '/' : popular movies list (home page)
// '/movie/:id' : detailed movie page, with the movie id as a URL parameter

const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movie/:id', component: MovieDetailComponent }
];

// AppModule : root module of the Angular app
// It's where all components are declared and external modules are imported

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieDetailComponent,
    SearchComponent,
    MovieFiltersComponent,
    MovieResultsComponent
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [TmdbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
