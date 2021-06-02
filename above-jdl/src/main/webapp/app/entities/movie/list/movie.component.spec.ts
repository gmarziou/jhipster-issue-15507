import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MovieService } from '../service/movie.service';

import { MovieComponent } from './movie.component';

describe('Component Tests', () => {
  describe('Movie Management Component', () => {
    let comp: MovieComponent;
    let fixture: ComponentFixture<MovieComponent>;
    let service: MovieService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MovieComponent],
      })
        .overrideTemplate(MovieComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MovieComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MovieService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.movies?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
