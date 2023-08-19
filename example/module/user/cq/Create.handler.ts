import { ICreateCommand, ICreateHandler } from '../type';

export default class CreateHandler implements ICreateHandler {
  readonly __tag = 'command:user.create';

  async exec({ payload }: ICreateCommand) {}
}