import { ICreateCommand, ICreateHandler } from '../type';

import dbProduct from '../db/dbProduct';


export default class CreateHandler implements ICreateHandler {
  public readonly __tag = 'command:product__create';

  async exec({ payload }: ICreateCommand) {
    return { id: dbProduct.create({ name: payload.name, price_tag_ids: payload.price_tag_ids }) };
  }
}
