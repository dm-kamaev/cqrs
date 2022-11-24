# CQRS

[![Actions Status](https://github.com/dm-kamaev/cqrs/workflows/Build/badge.svg)](https://github.com/dm-kamaev/cqrs/actions)

Library for realization of CQRS in your applicaton.

```sh
npm i @ignis-web/cqrs -S
```

### Example
```ts
import Bus, { ICommand, IQuery, ICommandHandler, IQueryHandler } from '@ignis-web/cqrs';

interface ICreateCommand extends ICommand<{ __tag: 'command:create'; id: number; name: string }> { };

class CreateCommand implements ICreateCommand {
  public readonly __tag = 'command:create';
  public id: number;
  public name: string;

  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }
}

interface IGetByIdQuery extends IQuery<{ __tag: 'query:get-by-id'; id: number }> { };

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
      id: command.id,
      name: 'John',
    };
  }
}

const bus = new Bus([() => new CreateHandler(), () => new GetByIdHandler()]);

void async function () {
  await bus.exec(new CreateCommand({ id: 123, name: 'John' }));
  // { id: 123, name: 'John' }
  const user = await bus.exec(new GetByIdQuery(123));
}();
```

### Command may return value
Often we need that handler of command return result of operation. For example, id of entity or status of operation. For this you can pass second argument to `ICommandHandler`, it's type of returned value.
```ts
class CreateHandler implements ICommandHandler<ICreateCommand, number> {
  public readonly __tag = 'command:create';

  async exec(command: ICreateCommand) {
    const userId = 1;
    console.log('create', {
      userId,
      name: command.name,
    });
    return userId;
  }

}
```


### Validation
You can use method `validate` for validation of input data in command or query:
```ts
class CreateCommand implements ICreateCommand {
  public readonly __tag = 'command:create';

  constructor(public name: string) {}

  async validate() {
    if (this.name !== 'John') {
      throw new Error('Name must be John');
    }
  }

}
```
The method `validate` is asyncronous and called after `constructor`.

It's also available in handler of command/query. Command or query is passed as the first argument:
```ts
class CreateHandler implements ICommandHandler<ICreateCommand> {
  public readonly __tag = 'command:create';

  async validate(command: ICreateCommand) {
    if (command.name !== 'John') {
      throw new Error('Name must be John');
    }
  }

  async exec(command: ICreateCommand) {
     console.log('create', {
      id: command.id,
      name: command.name,
    });
  }
}
```

### Async build command/query
TypeScript can't support asyncronous constructor for class but sometimes you may be want to execute asyncronous actions for building command/query. The method `build` comes to rescue:
```ts
class CreateCommand implements ICreateCommand {
  public readonly __tag = 'command:create';
  public readonly name: string;

  async build() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.name = 'John';
        resolve();
      }, 5000);
    });
  }
}
```
It's asyncronous and called after `validate`.


### Middlewares
You can use concept of middleware in command/query.
The first variant is to override method `middlewares` which must return array of functions:
```ts
class CreateCommand implements ICreateCommand {
  public readonly __tag = 'command:create';
  public id: number;
  public name: string[];

  constructor({ id, role }: { id: number, role: string[], }) {
    this.id = id;
    this.role = role;
  }

  middlewares() {
    return [this.checkRole.bind(this), this.isUser.bind(this)];
  }

  async checkRole() {
    if (!this.role.includes('admin')) {
      throw new Error('Not enough access rights');
    }
  }

  async isUser() {
    if (!this.id !== 1) {
      throw new Error('Not enough access rights');
    }
  }
}
```

The second variant is to create property `middlewares` which be array of functions:
```ts
class CreateCommand implements ICreateCommand {
  public readonly __tag = 'command:create';
  public id: number;
  public name: string[];

  middlewares = [this.checkRole.bind(this), this.isUser.bind(this)];

  constructor({ id, role }: { id: number, role: string[], }) {
    this.id = id;
    this.role = role;
  }

  async checkRole() {
    if (!this.role.includes('admin')) {
      throw new Error('Not enough access rights');
    }
  }

  async isUser() {
    if (!this.id !== 1) {
      throw new Error('Not enough access rights');
    }
  }
}
```
Middlewares are called before methods `validate` and `build`.
