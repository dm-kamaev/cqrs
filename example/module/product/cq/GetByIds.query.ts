import { IGetByIdsQuery } from '../type';

import { z } from 'zod';


export default class GetByIdsQuery implements IGetByIdsQuery {
  readonly __tag = 'query:product.get-by-ids';
  payload: IGetByIdsQuery['payload']

  constructor(ids: IGetByIdsQuery['payload']) {
    this.payload = z.array(z.number({
      required_error: 'Requiring id of product',
      invalid_type_error: 'Id of product must be number',
    })).parse(ids);
  }

}