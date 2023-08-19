import { IGetByIdQuery } from '../type';

import { z } from 'zod';
import dbOrder from '../db/dbOrder';

export default class GetByIdQuery implements IGetByIdQuery {
  readonly __tag = 'query:order.get-by-id';
  public payload: IGetByIdQuery['payload'];

  constructor(id: IGetByIdQuery['payload']) {
    this.payload = z.number({
      required_error: 'Requiring id of order',
      invalid_type_error: 'Id of order must be number',
    }).parse(id);
  }

  async validate() {
    const order = dbOrder.getById(this.payload);

    if (!order) {
      throw new Error(`Not found order with id = ${this.payload}`);
    }
  }

}