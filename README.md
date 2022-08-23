# CQRS

[![Actions Status](https://github.com/dm-kamaev/cqrs/workflows/Build/badge.svg)](https://github.com/dm-kamaev/cqrs/actions)

Library for realization CQRS in your applicaton.

Example:
```ts
import Bus, { ICommand, IQuery, ICommandHandler, IQueryHandler } from '@ignis-web/cqrs';

interface ICreateCommand extends ICommand<{ name: string }> { };

class CreateCommand implements ICreateCommand {
  public readonly __tag = 'command:create';
  public id: number;
  public name: string;

  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }
}

interface IGetByIdQuery extends IQuery<{ id: number }> { };

class GetByIdQuery implements IGetByIdQuery {
  public readonly __tag = 'query:get-by-id';
  public id: number;
  constructor(id: number) {
    this.id = id;
  }
}


class CreateHandler implements ICommandHandler<ICreateCommand> {
  public readonly __tag = 'command:create';


  async exec(command: ICreateCommand) {
    console.log('create', {
      id: command.id,
      name: command.name,
    });
  }
}

class GetByIdHandler implements IQueryHandler<IGetByIdQuery> {
  public readonly __tag = 'query:get-by-id';

  async exec(command: IGetByIdQuery) {
    return {
      id: 123,
      name: 'John',
    };
  }
}

const bus = new Bus([ new CreateHandler(), new GetByIdHandler() ]);

await bus.exec(new CreateCommand({ id: 123, name: 'John' }));
const user = await bus.exec(new GetByIdHandler(123)); // { id: 123, name: 'John' }
```