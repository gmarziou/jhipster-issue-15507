import { ICustomer } from 'app/entities/customer/customer.model';

export interface IAddress {
  id?: number;
  name?: string | null;
  customer?: ICustomer | null;
}

export class Address implements IAddress {
  constructor(public id?: number, public name?: string | null, public customer?: ICustomer | null) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
