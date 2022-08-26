// type name of command/query
type ActionName = string;

// Base interface for command/query
interface IAction {
  // eslint-disable-next-line no-unused-vars
  middlewares?: Array<(...arg: any) => Promise<any>> | (() => Array<(...arg: any) => Promise<any>>);
  validate?: () => Promise<any>;
  build?: () => Promise<any>;
}

// Base interface for handler
interface IH<CommandOrQuery> {
  // eslint-disable-next-line no-use-before-define
  bus?: IBus;
  // eslint-disable-next-line no-unused-vars
  validate?: (command: CommandOrQuery) => Promise<any>;
  afterExec?: () => Promise<void>;
}

// Interface for command
interface IC extends IAction {
  readonly __tag: `command:${ActionName}`;
}

// Interface for query
interface IQ extends IAction {
  readonly __tag: `query:${ActionName}`;
}

export type ICommand<T> = T & IC;
export type IQuery<T> = T & IQ;

export interface ICommandHandler<Command extends ICommand<any> = ICommand<any>, Output = void> extends IH<Command> {
  readonly __tag: `command:${ActionName}`;
  // eslint-disable-next-line no-unused-vars
  exec: (command: Command) => Promise<Output>;
}

export interface IQueryHandler<Command extends ICommand<any> = ICommand<any>> extends IH<Command> {
  readonly __tag: `query:${ActionName}`;
  // eslint-disable-next-line no-unused-vars
  exec: (command: Command) => Promise<any>;
}

type IHandler<T = ICommand<any>> = ICommandHandler<T, any> | IQueryHandler<T>;

type Result<RegisteredHandlers extends IHandler[], Command extends ICommand<any>> = ReturnType<Extract<RegisteredHandlers[number], { exec: (cmd: Command) => any }>['exec']>;

export interface IBus<RegisteredHandlers extends IHandler[] = ICommandHandler<any>[]> {
  exec<CommandOrQuery extends IC | IQ = any>(
    // eslint-disable-next-line no-unused-vars
    input: CommandOrQuery,
  ): Promise<Result<RegisteredHandlers, CommandOrQuery>>
}

// export class CommandBus<TRegisteredCommandHandlers extends ICommandHandler[] = ICommandHandler<any>[]> {
export default class Bus<RegisteredHandlers extends IHandler[] = ICommandHandler<any>[]> implements IBus<RegisteredHandlers> {
  private readonly _handlers: Record<string, RegisteredHandlers[number]>;

  constructor(handlers: RegisteredHandlers) {
    this._handlers = {};

    handlers.forEach(handler => {
      const tag = handler.__tag;
      if (this._handlers[tag]) {
        throw new HandlerDuplicateError(`Handler already exist with name ${tag}`);
      }
      handler.bus = this;
      this._handlers[tag] = handler;
    });
  }
  // TCommand extends ICommand<any> = any
  async exec<CommandOrQuery extends IC | IQ = any>(
    input: CommandOrQuery,
  ): Promise<Result<RegisteredHandlers, CommandOrQuery>> {
    const [type, name] = input.__tag.split(':');
    const handler = this._handlers[input.__tag];
    if (!handler) {
      if (isType(type)) {
        this._commandOrQueryNotFound(type, name);
      } else {
        throw new Error(`Invalid type: ${type}`);
      }
    }

    if (input.middlewares) {
      const middlewares = input.middlewares instanceof Function ? input.middlewares() : input.middlewares;
      for await (const middleware of middlewares) {
        await middleware();
      }
    }

    if (input.validate) {
      await input.validate();
    }

    if (input.build) {
      await input.build();
    }

    if (handler.validate) {
      await handler.validate(input);
    }

    const result = await handler.exec(input);

    if (handler.afterExec) {
      await handler.afterExec();
    }

    return result;
  }

  private _commandOrQueryNotFound(type: 'command' | 'query', name: string) {
    if (type === 'command') {
      throw new CommandNotFoundError(`Command: ${name} is not found.`);
    } else {
      throw new QueryNotFoundError(`Query: ${name} is not found.`);
    }
  }
}

function isType(input: string): input is 'command' | 'query' {
  return (input === 'command' || input === 'query');
}

export class CommandNotFoundError extends Error {

}

export class QueryNotFoundError extends Error {

}

export class HandlerDuplicateError extends Error {

}
