jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMovie, Movie } from '../movie.model';
import { MovieService } from '../service/movie.service';

import { MovieRoutingResolveService } from './movie-routing-resolve.service';

describe('Service Tests', () => {
  describe('Movie routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MovieRoutingResolveService;
    let service: MovieService;
    let resultMovie: IMovie | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MovieRoutingResolveService);
      service = TestBed.inject(MovieService);
      resultMovie = undefined;
    });

    describe('resolve', () => {
      it('should return IMovie returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMovie = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMovie).toEqual({ id: 123 });
      });

      it('should return new IMovie if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMovie = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMovie).toEqual(new Movie());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMovie = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMovie).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
