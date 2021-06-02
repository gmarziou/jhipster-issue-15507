jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOwner, Owner } from '../owner.model';
import { OwnerService } from '../service/owner.service';

import { OwnerRoutingResolveService } from './owner-routing-resolve.service';

describe('Service Tests', () => {
  describe('Owner routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: OwnerRoutingResolveService;
    let service: OwnerService;
    let resultOwner: IOwner | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(OwnerRoutingResolveService);
      service = TestBed.inject(OwnerService);
      resultOwner = undefined;
    });

    describe('resolve', () => {
      it('should return IOwner returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOwner = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOwner).toEqual({ id: 123 });
      });

      it('should return new IOwner if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOwner = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultOwner).toEqual(new Owner());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultOwner = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultOwner).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
