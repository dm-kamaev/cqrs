import { IQuery } from '../../index';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGetByIdQuery extends IQuery<{ id: number; __tag: 'query:get-by-id' }> { };

export default class GetByIdQuery implements IGetByIdQuery {
  public readonly __tag = 'query:get-by-id';
  public id: number;
  constructor() {
    this.id = 1234;
  }
}
