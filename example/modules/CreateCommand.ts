import { ICommand } from '../../index';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICreateCommand extends ICommand<{ name: string }> { };

export default class CreateCommand implements ICreateCommand {
  public readonly __tag = 'command:create';
  public name: string;

  // middlewares = [this.check_role.bind(this), this.check_type.bind(this)];

  constructor() {
    this.name = 'Vasya';
  }

  // async check_role() {
  //   if (this.name === 'John') {
  //     throw new Error('Stop!!!');
  //   }
  //   console.log('check_role');
  // }

  // async check_type() {
  //   console.log('check type');
  // }

  // middlewares() {
  //   return [this.check_role.bind(this), this.check_type.bind(this)];
  // }

  // async validate() {
  //   if (this.name !== 'Vasya') {
  //     throw new Error('Stop');
  //   }
  // }

  // async build() {
  //   return new Promise<void>((resolve, reject) => {
  //     setTimeout(() => {
  //       console.log('Build');
  //       this.name = 'John';
  //       resolve();
  //     }, 5000);
  //   });
  // }
}
