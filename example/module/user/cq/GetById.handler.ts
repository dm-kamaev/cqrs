import { IGetByIdQuery, IGetByIdHandler } from '../type';

export default class GetByIdHandler implements IGetByIdHandler {
  readonly __tag = 'query:user.get-by-id';

  async exec({ payload }: IGetByIdQuery) {}
}