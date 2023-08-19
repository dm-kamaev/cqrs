import { ICreateCommand } from '../type';

export default class CreateCommand implements ICreateCommand {
  readonly __tag = 'command:user.create';

  // eslint-disable-next-line no-unused-vars
  constructor(public payload: ICreateCommand['payload']) {}
}