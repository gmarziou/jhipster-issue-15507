import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrigin, Origin } from '../origin.model';
import { OriginService } from '../service/origin.service';

@Injectable({ providedIn: 'root' })
export class OriginRoutingResolveService implements Resolve<IOrigin> {
  constructor(protected service: OriginService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrigin> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((origin: HttpResponse<Origin>) => {
          if (origin.body) {
            return of(origin.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Origin());
  }
}
