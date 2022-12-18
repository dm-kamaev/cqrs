
type ActionName = `${'query' | 'command'}:${string}`;

interface BaseAction {
  // eslint-disable-next-line no-unused-vars
  middlewares?: Array<(...arg: any) => Promise<any>> | (() => Array<(...arg: any) => Promise<any>>);
  validate?: () => Promise<any>;
  build?: () => Promise<any>;
}

export interface Action<T> extends BaseAction {
  __tag: ActionName;
  payload: T;
}

interface BaseHandler<Action> {
  // eslint-disable-next-line no-unused-vars
  validate?: (action: Action) => Promise<any>;
  afterExec?: () => Promise<void>;
}

export interface ActionHandler<T extends Action<any> = Action<any>, Output = void> extends BaseHandler<T> {
  __tag: ActionName;
  exec: (action: T) => Promise<Output>;
}

// type Handler<A extends Action<any>, B> = ActionHandler<A, B>;
type Handler<A extends Action<any>, B> = () => ActionHandler<A, B>;

// export interface IBus<TRegisteredCommandHandlers extends ActionHandler<any, any>[] = ActionHandler<any, any>[]> {
export interface IBus<TRegisteredCommandHandlers extends Handler<any, any>[] = Handler<any, any>[], HashAction extends Record<string, Record<string, (...arg: any[]) => Action<any> >> = any> {
  readonly action: HashAction;
  exec<TCommand extends Action<any> = any>(action: TCommand): ResultOf<TRegisteredCommandHandlers, TCommand>
}

// type ResultOf<TRegisteredCommandHandlers extends ActionHandler[], TCommand extends Action<any>> = Promise<
// type ResultOf<TRegisteredCommandHandlers extends Handler<any, any>[], TCommand extends Action<any>> = Promise<
//   ReturnType<
//     Extract<TRegisteredCommandHandlers[number], { exec: (cmd: TCommand) => any }>['exec']
//   >
// >;

type ResultOf<TRegisteredCommandHandlers extends Handler<any, any>[], TCommand extends Action<any>> = Promise<
  ReturnType<
    ReturnType<
      Extract<TRegisteredCommandHandlers[number], (...arg: any[]) => { exec: (cmd: TCommand) => any }>
    >['exec']
  >
>;

// export default class Bus<RegisteredHandlers extends ActionHandler<any, any>[] = ActionHandler<any, any>[]> implements IBus<RegisteredHandlers> {
export default class Bus<
  RegisteredHandlers extends Handler<any, any>[] = Handler<any, any>[],
  HashAction extends Record<string, Record<string, (...arg: any[]) => Action<any>>> = Record<string, Record<string, any>>
> implements IBus<RegisteredHandlers, HashAction> {
  private readonly _fabricHandlers: Record<string, RegisteredHandlers[number]>;

  constructor(handlers: RegisteredHandlers, public readonly action: HashAction) {
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

  async exec<TAction extends Action<any> = any>(action: TAction): ResultOf<RegisteredHandlers, TAction> {
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
