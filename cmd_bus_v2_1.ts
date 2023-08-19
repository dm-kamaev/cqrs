
type ActionName = `${'query' | 'command'}:${string}`;

interface BaseAction {
  // eslint-disable-next-line no-unused-vars
  middlewares?: Array<(...arg: any) => Promise<any>> | (() => Array<(...arg: any) => Promise<any>>);
  validate?: () => Promise<any>;
  build?: () => Promise<any>;
}

interface Action<Payload> extends BaseAction {
  readonly __tag: ActionName;
  payload: Payload;
}

export interface IQuery<Name extends string, Payload> extends Action<Payload> {
  readonly __tag: `query:${Name}`;
}

export interface ICommand<Name extends string, Payload> extends Action<Payload> {
  readonly __tag: `command:${Name}`;
}

interface BaseHandler<Action> {
  // eslint-disable-next-line no-unused-vars
  validate?: (action: Action) => Promise<any>;
  afterExec?: () => Promise<void>;
}

interface ActionHandler<TAction extends Action<any> = Action<any>, Output = void> extends BaseHandler<TAction> {
  readonly __tag: ActionName;
  exec: (action: TAction) => Promise<Output>;
}

export interface IQueryHandler<TAction extends Action<any> = Action<any>, Output = void> extends ActionHandler<TAction, Output> {
  readonly __tag: `${TAction['__tag']}`;
  exec: (action: TAction) => Promise<Output>;
}

export interface ICommandHandler<TAction extends Action<any> = Action<any>, Output = void> extends ActionHandler<TAction, Output> {
  readonly __tag: `${TAction['__tag']}`;
  exec: (action: TAction) => Promise<Output>;
}

type Handler<A extends Action<any>, B> = () => ActionHandler<A, B>;


export interface IBus<TRegisteredCommandHandlers extends Handler<any, any>[] = Handler<any, any>[], HashAction extends Record<string, Record<string, (...arg: any[]) => Action<any> >> = any> {
  readonly action: HashAction;
  exec<TCommand extends Action<any> = any>(action: TCommand): Promise<ResultOf<TRegisteredCommandHandlers, TCommand>>
}


export type ResultOf<TRegisteredCommandHandlers extends Handler<any, any>[], TCommand extends Action<any>> =
  ReturnType<
    ReturnType<
      Extract<TRegisteredCommandHandlers[number], (...arg: any[]) => { exec: (cmd: TCommand) => any }>
    >['exec']
  >;

// export default class Bus<RegisteredHandlers extends ActionHandler<any, any>[] = ActionHandler<any, any>[]> implements IBus<RegisteredHandlers> {
export default class Bus<
  RegisteredHandlers extends Handler<any, any>[] = Handler<any, any>[],
  HashAction extends Record<string, Record<string, (...arg: any[]) => Action<any>>> = Record<string, Record<string, any>>
> implements IBus<RegisteredHandlers, HashAction> {
  private readonly _fabricHandlers: Record<string, RegisteredHandlers[number]>;

  constructor(public readonly action: HashAction, handlers: RegisteredHandlers) {
    this._fabricHandlers = {};

    handlers.forEach(fabric => {
      const handler = fabric();
      const tag = handler.__tag;
      if (this._fabricHandlers[tag]) {
        throw new HandlerDuplicateError(`Handler already exist with name ${tag}`);
      }

      this._fabricHandlers[tag] = fabric;
    });
  }

  async exec<TAction extends Action<any> = any>(action: TAction): Promise<ResultOf<RegisteredHandlers, TAction>> {
    const fabric = this._fabricHandlers[action.__tag];
    if (!fabric) {
      const [type, name] = action.__tag.split(':');
      if (isType(type)) {
        this._commandOrQueryNotFound(type, name);
      } else {
        throw new Error(`Invalid type: ${type}`);
      }
    }

    if (action.middlewares) {
      const middlewares = action.middlewares instanceof Function ? action.middlewares() : action.middlewares;
      for await (const middleware of middlewares) {
        await middleware();
      }
    }

    if (action.validate) {
      await action.validate();
    }

    if (action.build) {
      await action.build();
    }

    const handler = fabric();
    if (handler.validate) {
      await handler.validate(action);
    }

    const result = await handler.exec(action);

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
