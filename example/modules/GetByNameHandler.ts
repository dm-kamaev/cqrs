import { IQueryHandler } from '../../index';
import { IGetByNameQuery } from './GetByNameQuery';

export default class GetByNameHandler implements IQueryHandler<IGetByNameQuery> {
  public readonly __tag = 'query:get-by-name';

  async exec(command: IGetByNameQuery) {

    return {
      // id: command.payload.id,
      children: [12,3,5,5]
    };
  }
}

