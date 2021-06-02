import { IAddress } from 'app/entities/address/address.model';

export interface ICustomer {
  id?: number;
  name?: string | null;
  addresses?: IAddress[] | null;
}

export class Customer implements ICustomer {
  constructor(public id?: number, public name?: string | null, public addresses?: IAddress[] | null) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
