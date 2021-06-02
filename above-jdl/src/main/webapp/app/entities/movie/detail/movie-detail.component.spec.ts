import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MovieDetailComponent } from './movie-detail.component';

describe('Component Tests', () => {
  describe('Movie Management Detail Component', () => {
    let comp: MovieDetailComponent;
    let fixture: ComponentFixture<MovieDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MovieDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ movie: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MovieDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MovieDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load movie on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.movie).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
