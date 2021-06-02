jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MovieService } from '../service/movie.service';
import { IMovie, Movie } from '../movie.model';

import { MovieUpdateComponent } from './movie-update.component';

describe('Component Tests', () => {
  describe('Movie Management Update Component', () => {
    let comp: MovieUpdateComponent;
    let fixture: ComponentFixture<MovieUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let movieService: MovieService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MovieUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MovieUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MovieUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      movieService = TestBed.inject(MovieService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const movie: IMovie = { id: 456 };

        activatedRoute.data = of({ movie });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(movie));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const movie = { id: 123 };
        spyOn(movieService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ movie });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: movie }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(movieService.update).toHaveBeenCalledWith(movie);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const movie = new Movie();
        spyOn(movieService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ movie });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: movie }));
        saveSubject.complete();

        // THEN
        expect(movieService.create).toHaveBeenCalledWith(movie);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const movie = { id: 123 };
        spyOn(movieService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ movie });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(movieService.update).toHaveBeenCalledWith(movie);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
