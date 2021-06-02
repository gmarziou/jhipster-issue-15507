jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OriginService } from '../service/origin.service';
import { IOrigin, Origin } from '../origin.model';

import { OriginUpdateComponent } from './origin-update.component';

describe('Component Tests', () => {
  describe('Origin Management Update Component', () => {
    let comp: OriginUpdateComponent;
    let fixture: ComponentFixture<OriginUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let originService: OriginService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OriginUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OriginUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OriginUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      originService = TestBed.inject(OriginService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const origin: IOrigin = { id: 456 };

        activatedRoute.data = of({ origin });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(origin));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const origin = { id: 123 };
        spyOn(originService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ origin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: origin }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(originService.update).toHaveBeenCalledWith(origin);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const origin = new Origin();
        spyOn(originService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ origin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: origin }));
        saveSubject.complete();

        // THEN
        expect(originService.create).toHaveBeenCalledWith(origin);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const origin = { id: 123 };
        spyOn(originService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ origin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(originService.update).toHaveBeenCalledWith(origin);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
