import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMovie, Movie } from '../movie.model';

import { MovieService } from './movie.service';

describe('Service Tests', () => {
  describe('Movie Service', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;
    let elemDefault: IMovie;
    let expectedResult: IMovie | IMovie[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MovieService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Movie', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Movie()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Movie', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Movie', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Movie()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Movie', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Movie', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMovieToCollectionIfMissing', () => {
        it('should add a Movie to an empty array', () => {
          const movie: IMovie = { id: 123 };
          expectedResult = service.addMovieToCollectionIfMissing([], movie);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(movie);
        });

        it('should not add a Movie to an array that contains it', () => {
          const movie: IMovie = { id: 123 };
          const movieCollection: IMovie[] = [
            {
              ...movie,
            },
            { id: 456 },
          ];
          expectedResult = service.addMovieToCollectionIfMissing(movieCollection, movie);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Movie to an array that doesn't contain it", () => {
          const movie: IMovie = { id: 123 };
          const movieCollection: IMovie[] = [{ id: 456 }];
          expectedResult = service.addMovieToCollectionIfMissing(movieCollection, movie);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(movie);
        });

        it('should add only unique Movie to an array', () => {
          const movieArray: IMovie[] = [{ id: 123 }, { id: 456 }, { id: 61336 }];
          const movieCollection: IMovie[] = [{ id: 123 }];
          expectedResult = service.addMovieToCollectionIfMissing(movieCollection, ...movieArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const movie: IMovie = { id: 123 };
          const movie2: IMovie = { id: 456 };
          expectedResult = service.addMovieToCollectionIfMissing([], movie, movie2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(movie);
          expect(expectedResult).toContain(movie2);
        });

        it('should accept null and undefined values', () => {
          const movie: IMovie = { id: 123 };
          expectedResult = service.addMovieToCollectionIfMissing([], null, movie, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(movie);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
