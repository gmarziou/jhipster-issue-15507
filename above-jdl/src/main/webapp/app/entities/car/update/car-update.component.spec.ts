jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CarService } from '../service/car.service';
import { ICar, Car } from '../car.model';
import { IOwner } from 'app/entities/owner/owner.model';
import { OwnerService } from 'app/entities/owner/service/owner.service';

import { CarUpdateComponent } from './car-update.component';

describe('Component Tests', () => {
  describe('Car Management Update Component', () => {
    let comp: CarUpdateComponent;
    let fixture: ComponentFixture<CarUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let carService: CarService;
    let ownerService: OwnerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CarUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CarUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CarUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      carService = TestBed.inject(CarService);
      ownerService = TestBed.inject(OwnerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Owner query and add missing value', () => {
        const car: ICar = { id: 456 };
        const owners: IOwner[] = [{ id: 10909 }];
        car.owners = owners;

        const ownerCollection: IOwner[] = [{ id: 34136 }];
        spyOn(ownerService, 'query').and.returnValue(of(new HttpResponse({ body: ownerCollection })));
        const additionalOwners = [...owners];
        const expectedCollection: IOwner[] = [...additionalOwners, ...ownerCollection];
        spyOn(ownerService, 'addOwnerToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ car });
        comp.ngOnInit();

        expect(ownerService.query).toHaveBeenCalled();
        expect(ownerService.addOwnerToCollectionIfMissing).toHaveBeenCalledWith(ownerCollection, ...additionalOwners);
        expect(comp.ownersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const car: ICar = { id: 456 };
        const owners: IOwner = { id: 91987 };
        car.owners = [owners];

        activatedRoute.data = of({ car });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(car));
        expect(comp.ownersSharedCollection).toContain(owners);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const car = { id: 123 };
        spyOn(carService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ car });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: car }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(carService.update).toHaveBeenCalledWith(car);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const car = new Car();
        spyOn(carService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ car });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: car }));
        saveSubject.complete();

        // THEN
        expect(carService.create).toHaveBeenCalledWith(car);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const car = { id: 123 };
        spyOn(carService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ car });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(carService.update).toHaveBeenCalledWith(car);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackOwnerById', () => {
        it('Should return tracked Owner primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOwnerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedOwner', () => {
        it('Should return option if no Owner is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedOwner(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Owner for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedOwner(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Owner is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedOwner(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
