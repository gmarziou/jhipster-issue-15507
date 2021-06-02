import { IProduct } from 'app/entities/product/product.model';

export interface IOrigin {
  id?: number;
  name?: string | null;
  product?: IProduct | null;
}

export class Origin implements IOrigin {
  constructor(public id?: number, public name?: string | null, public product?: IProduct | null) {}
}

export function getOriginIdentifier(origin: IOrigin): number | undefined {
  return origin.id;
}
