import { IGetByNameQuery } from '../type';

export default class GetByNameQuery implements IGetByNameQuery {
  readonly __tag = 'query:product__get_by_name';
  payload: { name: string; } = {} as IGetByNameQuery['payload'];

  constructor(name: string) {
    this.payload.name = name;
  }
}