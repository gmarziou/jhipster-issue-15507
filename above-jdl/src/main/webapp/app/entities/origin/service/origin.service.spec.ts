import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrigin, Origin } from '../origin.model';

import { OriginService } from './origin.service';

describe('Service Tests', () => {
  describe('Origin Service', () => {
    let service: OriginService;
    let httpMock: HttpTestingController;
    let elemDefault: IOrigin;
    let expectedResult: IOrigin | IOrigin[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(OriginService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Origin', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Origin()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Origin', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Origin', () => {
        const patchObject = Object.assign({}, new Origin());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Origin', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Origin', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addOriginToCollectionIfMissing', () => {
        it('should add a Origin to an empty array', () => {
          const origin: IOrigin = { id: 123 };
          expectedResult = service.addOriginToCollectionIfMissing([], origin);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(origin);
        });

        it('should not add a Origin to an array that contains it', () => {
          const origin: IOrigin = { id: 123 };
          const originCollection: IOrigin[] = [
            {
              ...origin,
            },
            { id: 456 },
          ];
          expectedResult = service.addOriginToCollectionIfMissing(originCollection, origin);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Origin to an array that doesn't contain it", () => {
          const origin: IOrigin = { id: 123 };
          const originCollection: IOrigin[] = [{ id: 456 }];
          expectedResult = service.addOriginToCollectionIfMissing(originCollection, origin);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(origin);
        });

        it('should add only unique Origin to an array', () => {
          const originArray: IOrigin[] = [{ id: 123 }, { id: 456 }, { id: 22223 }];
          const originCollection: IOrigin[] = [{ id: 123 }];
          expectedResult = service.addOriginToCollectionIfMissing(originCollection, ...originArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const origin: IOrigin = { id: 123 };
          const origin2: IOrigin = { id: 456 };
          expectedResult = service.addOriginToCollectionIfMissing([], origin, origin2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(origin);
          expect(expectedResult).toContain(origin2);
        });

        it('should accept null and undefined values', () => {
          const origin: IOrigin = { id: 123 };
          expectedResult = service.addOriginToCollectionIfMissing([], null, origin, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(origin);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
