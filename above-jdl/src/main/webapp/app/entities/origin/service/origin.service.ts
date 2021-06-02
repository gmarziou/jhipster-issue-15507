import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrigin, getOriginIdentifier } from '../origin.model';

export type EntityResponseType = HttpResponse<IOrigin>;
export type EntityArrayResponseType = HttpResponse<IOrigin[]>;

@Injectable({ providedIn: 'root' })
export class OriginService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/origins');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(origin: IOrigin): Observable<EntityResponseType> {
    return this.http.post<IOrigin>(this.resourceUrl, origin, { observe: 'response' });
  }

  update(origin: IOrigin): Observable<EntityResponseType> {
    return this.http.put<IOrigin>(`${this.resourceUrl}/${getOriginIdentifier(origin) as number}`, origin, { observe: 'response' });
  }

  partialUpdate(origin: IOrigin): Observable<EntityResponseType> {
    return this.http.patch<IOrigin>(`${this.resourceUrl}/${getOriginIdentifier(origin) as number}`, origin, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrigin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrigin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOriginToCollectionIfMissing(originCollection: IOrigin[], ...originsToCheck: (IOrigin | null | undefined)[]): IOrigin[] {
    const origins: IOrigin[] = originsToCheck.filter(isPresent);
    if (origins.length > 0) {
      const originCollectionIdentifiers = originCollection.map(originItem => getOriginIdentifier(originItem)!);
      const originsToAdd = origins.filter(originItem => {
        const originIdentifier = getOriginIdentifier(originItem);
        if (originIdentifier == null || originCollectionIdentifiers.includes(originIdentifier)) {
          return false;
        }
        originCollectionIdentifiers.push(originIdentifier);
        return true;
      });
      return [...originsToAdd, ...originCollection];
    }
    return originCollection;
  }
}
