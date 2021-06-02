jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RatingService } from '../service/rating.service';
import { IRating, Rating } from '../rating.model';
import { IMovie } from 'app/entities/movie/movie.model';
import { MovieService } from 'app/entities/movie/service/movie.service';

import { RatingUpdateComponent } from './rating-update.component';

describe('Component Tests', () => {
  describe('Rating Management Update Component', () => {
    let comp: RatingUpdateComponent;
    let fixture: ComponentFixture<RatingUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ratingService: RatingService;
    let movieService: MovieService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RatingUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RatingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RatingUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ratingService = TestBed.inject(RatingService);
      movieService = TestBed.inject(MovieService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Movie query and add missing value', () => {
        const rating: IRating = { id: 456 };
        const movie: IMovie = { id: 61793 };
        rating.movie = movie;

        const movieCollection: IMovie[] = [{ id: 18791 }];
        spyOn(movieService, 'query').and.returnValue(of(new HttpResponse({ body: movieCollection })));
        const additionalMovies = [movie];
        const expectedCollection: IMovie[] = [...additionalMovies, ...movieCollection];
        spyOn(movieService, 'addMovieToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        expect(movieService.query).toHaveBeenCalled();
        expect(movieService.addMovieToCollectionIfMissing).toHaveBeenCalledWith(movieCollection, ...additionalMovies);
        expect(comp.moviesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const rating: IRating = { id: 456 };
        const movie: IMovie = { id: 27246 };
        rating.movie = movie;

        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rating));
        expect(comp.moviesSharedCollection).toContain(movie);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const rating = { id: 123 };
        spyOn(ratingService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rating }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ratingService.update).toHaveBeenCalledWith(rating);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const rating = new Rating();
        spyOn(ratingService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rating }));
        saveSubject.complete();

        // THEN
        expect(ratingService.create).toHaveBeenCalledWith(rating);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const rating = { id: 123 };
        spyOn(ratingService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ratingService.update).toHaveBeenCalledWith(rating);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMovieById', () => {
        it('Should return tracked Movie primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMovieById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
