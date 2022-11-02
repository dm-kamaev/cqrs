import { ICommandHandler } from '../../index';;
import { ICreateCommand } from './CreateCommand';


export default class CreateHandler implements ICommandHandler<ICreateCommand, number> {
  public readonly __tag = 'command:create';
  test: number;


  // async validate(command: ICreateCommand) {
  //   if (command.name !== 'Vasya') {
  //     throw new Error('Stop');
  //   }
  // }

  async exec(command: ICreateCommand) {
    this.test = Math.random();
    console.log('create', {
      user_id: 123,
      name: command.name,
    });
    return 25;
  }

}
