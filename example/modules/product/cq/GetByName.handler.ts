import { IGetByNameQuery, IGetByNameHandler } from '../type';

import { IBus } from '../../../typeBus';

import dbProduct from '../db/dbProduct';

export default class GetByNameHandler implements IGetByNameHandler {
  public readonly __tag = 'query:product__get_by_name';

  constructor(private bus: IBus) {

  }

  async exec({ payload }: IGetByNameQuery) {
    const product = dbProduct.getByName(payload.name);
    const price_tags = await this.bus.exec(this.bus.action.price_tag.getByIds({ ids: product.price_tag_ids }));
    return {
      id: product.id,
      name: product.name,
      price_tags,
    };
  }
}
