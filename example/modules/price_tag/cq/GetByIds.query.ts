import { IGetByIdsQuery } from '../type';

export default class GetByIdsQuery implements IGetByIdsQuery {
  readonly __tag = 'query:price_tag__get_by_ids';

  constructor(public payload: IGetByIdsQuery['payload']) {}
}