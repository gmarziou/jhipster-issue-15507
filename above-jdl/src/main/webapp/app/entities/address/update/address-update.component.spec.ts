jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AddressService } from '../service/address.service';
import { IAddress, Address } from '../address.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { AddressUpdateComponent } from './address-update.component';

describe('Component Tests', () => {
  describe('Address Management Update Component', () => {
    let comp: AddressUpdateComponent;
    let fixture: ComponentFixture<AddressUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let addressService: AddressService;
    let customerService: CustomerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AddressUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AddressUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AddressUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      addressService = TestBed.inject(AddressService);
      customerService = TestBed.inject(CustomerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Customer query and add missing value', () => {
        const address: IAddress = { id: 456 };
        const customer: ICustomer = { id: 83541 };
        address.customer = customer;

        const customerCollection: ICustomer[] = [{ id: 57201 }];
        spyOn(customerService, 'query').and.returnValue(of(new HttpResponse({ body: customerCollection })));
        const additionalCustomers = [customer];
        const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
        spyOn(customerService, 'addCustomerToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(customerService.query).toHaveBeenCalled();
        expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
        expect(comp.customersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const address: IAddress = { id: 456 };
        const customer: ICustomer = { id: 9112 };
        address.customer = customer;

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(address));
        expect(comp.customersSharedCollection).toContain(customer);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const address = { id: 123 };
        spyOn(addressService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(addressService.update).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const address = new Address();
        spyOn(addressService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(addressService.create).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const address = { id: 123 };
        spyOn(addressService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(addressService.update).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCustomerById', () => {
        it('Should return tracked Customer primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCustomerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
