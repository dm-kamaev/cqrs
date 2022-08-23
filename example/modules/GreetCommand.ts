import { ICommand } from '../../index';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGreetCommand extends ICommand<{ id: number }> { };

export default class GreetCommand implements IGreetCommand {
  public readonly __tag = 'command:greet';
  public id: number;

  constructor() {
    this.id = 343;
  }
}
