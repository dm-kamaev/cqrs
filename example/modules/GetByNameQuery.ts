import { IQuery } from '../../index';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGetByNameQuery extends IQuery<{ id: number; __tag: 'query:get-by-name' }> { };

export default class GetByNameQuery implements IGetByNameQuery {
  public readonly __tag = 'query:get-by-name';
  public id: number;
  constructor() {
    this.id = 1234;
  }
}
