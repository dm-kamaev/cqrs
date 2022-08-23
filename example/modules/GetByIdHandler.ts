import { IQueryHandler } from '../../index';
import { IGetByIdQuery } from './GetByIdQuery';

export default class GetByIdHandler implements IQueryHandler<IGetByIdQuery> {
  public readonly __tag = 'query:get-by-id';

  async exec(command: IGetByIdQuery) {
    return {
      // id: command.payload.id,
      id: command.id,
      name: 'Test',
      list: [1, 2, 3, 5, 6]
    };
  }
}
