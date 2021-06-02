import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RatingService } from '../service/rating.service';

import { RatingComponent } from './rating.component';

describe('Component Tests', () => {
  describe('Rating Management Component', () => {
    let comp: RatingComponent;
    let fixture: ComponentFixture<RatingComponent>;
    let service: RatingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RatingComponent],
      })
        .overrideTemplate(RatingComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RatingComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RatingService);

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
      expect(comp.ratings?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
