
import { IToBookCommand, IToBookHandler } from '../type';

import dbProduct from '../db/dbProduct';

export default class ToBookHandler implements IToBookHandler {
  readonly __tag = 'command:product.to-book';

  async exec({ payload: { id, quantity } }: IToBookCommand) {
    const product = dbProduct.getById(id);

    if (!product) {
      throw new Error('Not found product');
    }
    const wantedQuantity = quantity;
    let notEnough = true;
    while (product.quantity !== 0 && quantity !== 0) {
      product.quantity--;
      quantity--;
      notEnough = false;
    }

    let quantityBooked = wantedQuantity - quantity;
    if (notEnough) {
      quantityBooked = 0;
    }

    dbProduct.update({ id }, { quantity: product.quantity });

    return { quantityBooked }
  }
}