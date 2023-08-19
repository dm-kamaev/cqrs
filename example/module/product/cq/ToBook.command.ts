import { IToBookCommand } from '../type';

import { z } from 'zod';
import dbProduct from '../db/dbProduct';

export default class ToBookCommand implements IToBookCommand {
  readonly __tag = 'command:product.to-book';
  payload: IToBookCommand['payload']

  // eslint-disable-next-line no-unused-vars
  constructor(toBook: IToBookCommand['payload']) {
    this.payload = z.object({
      id: z.number({
        required_error: 'Requiring id of product',
        invalid_type_error: 'Id of product must be number',
      }),
      quantity: z.number({
        required_error: 'Requiring quantity of product',
        invalid_type_error: 'Quantity of product must be number',
      })
    }).parse(toBook);
  }

  async validate() {
    const product = dbProduct.getById(this.payload.id);
    if (!product) {
      throw new Error(`Not found product with id = ${this.payload.id}`);
    }
  }
}