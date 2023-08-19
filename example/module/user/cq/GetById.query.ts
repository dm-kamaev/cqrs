import { IGetByIdQuery } from '../type';

export default class GetByIdQuery implements IGetByIdQuery {
  readonly __tag = 'query:user.get-by-id';

  // eslint-disable-next-line no-unused-vars
  constructor(public payload: IGetByIdQuery['payload']) {}
}