import { IOrigin } from 'app/entities/origin/origin.model';

export interface IProduct {
  id?: number;
  name?: string | null;
  origin?: IOrigin | null;
}

export class Product implements IProduct {
  constructor(public id?: number, public name?: string | null, public origin?: IOrigin | null) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
