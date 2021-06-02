import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMovie, getMovieIdentifier } from '../movie.model';

export type EntityResponseType = HttpResponse<IMovie>;
export type EntityArrayResponseType = HttpResponse<IMovie[]>;

@Injectable({ providedIn: 'root' })
export class MovieService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/movies');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(movie: IMovie): Observable<EntityResponseType> {
    return this.http.post<IMovie>(this.resourceUrl, movie, { observe: 'response' });
  }

  update(movie: IMovie): Observable<EntityResponseType> {
    return this.http.put<IMovie>(`${this.resourceUrl}/${getMovieIdentifier(movie) as number}`, movie, { observe: 'response' });
  }

  partialUpdate(movie: IMovie): Observable<EntityResponseType> {
    return this.http.patch<IMovie>(`${this.resourceUrl}/${getMovieIdentifier(movie) as number}`, movie, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMovie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMovie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMovieToCollectionIfMissing(movieCollection: IMovie[], ...moviesToCheck: (IMovie | null | undefined)[]): IMovie[] {
    const movies: IMovie[] = moviesToCheck.filter(isPresent);
    if (movies.length > 0) {
      const movieCollectionIdentifiers = movieCollection.map(movieItem => getMovieIdentifier(movieItem)!);
      const moviesToAdd = movies.filter(movieItem => {
        const movieIdentifier = getMovieIdentifier(movieItem);
        if (movieIdentifier == null || movieCollectionIdentifiers.includes(movieIdentifier)) {
          return false;
        }
        movieCollectionIdentifiers.push(movieIdentifier);
        return true;
      });
      return [...moviesToAdd, ...movieCollection];
    }
    return movieCollection;
  }
}
