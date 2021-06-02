import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OriginDetailComponent } from './origin-detail.component';

describe('Component Tests', () => {
  describe('Origin Management Detail Component', () => {
    let comp: OriginDetailComponent;
    let fixture: ComponentFixture<OriginDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OriginDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ origin: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(OriginDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OriginDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load origin on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.origin).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
