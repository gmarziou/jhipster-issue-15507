import { ICar } from 'app/entities/car/car.model';

export interface IOwner {
  id?: number;
  name?: string | null;
  cars?: ICar[] | null;
}

export class Owner implements IOwner {
  constructor(public id?: number, public name?: string | null, public cars?: ICar[] | null) {}
}

export function getOwnerIdentifier(owner: IOwner): number | undefined {
  return owner.id;
}
