import dbProduct from '../db/dbProduct';
import { IGetByIdsQuery, IGetByIdsHandler } from '../type';

export default class GetByIdsHandler implements IGetByIdsHandler {
  readonly __tag = 'query:product.get-by-ids';

  async exec({ payload: ids }: IGetByIdsQuery) {
    return dbProduct.getByIds(ids);
  }
}