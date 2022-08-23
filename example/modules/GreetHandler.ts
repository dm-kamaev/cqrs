import { ICommandHandler } from '../../index';
import { IGreetCommand } from './GreetCommand';

export default class GreetHandler implements ICommandHandler<IGreetCommand> {
  public readonly __tag = 'command:greet';

  async exec(command: IGreetCommand) {
    console.log('Hello ', {
      // id: command.payload.id,
      id: command.id,
      name: 'Test',
      list: [1, 2, 3, 5, 6]
    });
    // return {
    //   // id: command.payload.id,
    //   id: command.id,
    //   name: 'Test',
    //   list: [1, 2, 3, 5, 6]
    // };
  }

  // async afterExec() {
  //   return new Promise<void>((resolve, reject) => {
  //     setTimeout(() => {
  //       console.log('afterExec');
  //       resolve();
  //     }, 10000);
  //   });
  // }
}
