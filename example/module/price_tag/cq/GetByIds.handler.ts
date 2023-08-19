import { IGetByIdsQuery, IGetByIdsHandler } from '../type';

import dbPriceTag from '../db/dbPriceTag';


export default class GetByIdHandler implements IGetByIdsHandler {
  readonly __tag = 'query:price_tag__get_by_ids';

  // constructor(private bus: IBus) {}

  async exec({ payload }: IGetByIdsQuery) {
    return dbPriceTag.getByIds(payload.ids);
  }
}
