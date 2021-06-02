jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOrigin, Origin } from '../origin.model';
import { OriginService } from '../service/origin.service';

import { OriginRoutingResolveService } from './origin-routing-resolve.service';

describe('Service Tests', () => {
  describe('Origin routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: OriginRoutingResolveService;
    let service: OriginService;
    let resultOrigin: IOrigin | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(OriginRoutingResolveService);
      service = TestBed.inject(OriginService);
      resultOrigin = undefined;
    });

    describe('resolve', () => {
      it('should return IOrigin returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrigin = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOrigin).toEqual({ id: 123 });
      });

      it('should return new IOrigin if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrigin = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultOrigin).toEqual(new Origin());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOrigin = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOrigin).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
