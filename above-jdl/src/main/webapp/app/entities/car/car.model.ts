import { IOwner } from 'app/entities/owner/owner.model';

export interface ICar {
  id?: number;
  name?: string | null;
  owners?: IOwner[] | null;
}

export class Car implements ICar {
  constructor(public id?: number, public name?: string | null, public owners?: IOwner[] | null) {}
}

export function getCarIdentifier(car: ICar): number | undefined {
  return car.id;
}
