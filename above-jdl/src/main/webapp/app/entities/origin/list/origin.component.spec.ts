import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OriginService } from '../service/origin.service';

import { OriginComponent } from './origin.component';

describe('Component Tests', () => {
  describe('Origin Management Component', () => {
    let comp: OriginComponent;
    let fixture: ComponentFixture<OriginComponent>;
    let service: OriginService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OriginComponent],
      })
        .overrideTemplate(OriginComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OriginComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(OriginService);

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
      expect(comp.origins?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
