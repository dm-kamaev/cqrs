import { ICommandHandler, IBus } from '../../index';;
import { ICreateCommand } from './CreateCommand';
import GetByIdQuery from './GetByIdQuery';
import GetByIdHandler from './GetByIdHandler';


export default class CreateHandler implements ICommandHandler<ICreateCommand> {
  public readonly __tag = 'command:create';
  public bus: IBus<GetByIdHandler[]>;

  // async validate(command: ICreateCommand) {
  //   if (command.name !== 'Vasya') {
  //     throw new Error('Stop');
  //   }
  // }

  async exec(command: ICreateCommand) {
    const result = await this.bus.exec(new GetByIdQuery());
    console.log('CreateHandler', {
      user_id: 123,
      name: command.name,
    }, result);
  }

}
