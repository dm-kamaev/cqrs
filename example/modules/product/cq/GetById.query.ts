import { IGetByIdQuery } from '../type';

export default class GetByIdQuery implements IGetByIdQuery {
  readonly __tag = 'query:product__get_by_id';
  payload: { id: number; } = {} as IGetByIdQuery['payload'];

  constructor(id: number) {
    this.payload.id = id;
  }
}