import { ICreateBatchCommand, ICreateBatchHandler } from '../type';

import dbPriceTag from '../db/dbPriceTag';


export default class CreateHandler implements ICreateBatchHandler {
  public readonly __tag = 'command:price_tag__create_batch';

  async exec({ payload }: ICreateBatchCommand) {
    return { ids: payload.map(el => dbPriceTag.create(el)) };
  }
}
