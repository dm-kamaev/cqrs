
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

export interface IBus<HashModule extends Record<string, Record<string, { action: (...arg: any[]) => Action<any>, handler: Handler<any, any> }>> = Record<string, Record<string, any>>> {
  readonly action: ExtractActions<HashModule>;
  exec<TCommand extends Action<any> = any>(action: TCommand): Promise<ResultOf<ExtractHandlers<HashModule>, TCommand>>
}

type ResultOf<TRegisteredCommandHandlers extends Handler<any, any>, TCommand extends Action<any>> = Awaited<
  ReturnType<
    ReturnType<
      Extract<TRegisteredCommandHandlers, (...arg: any[]) => { exec: (cmd: TCommand) => Promise<any> }>
    >['exec']
  >>;

type ExtractHandlers<HashModule extends Record<string, Record<string, { action: (...arg: any[]) => Action<any>, handler: Handler<any, any> }>>> =
  HashModule extends Record<string, Record<string, infer R>> ?
    R extends { action: (...arg: any[]) => Action<any>, handler: Handler<any, any> } ? R['handler'] : never
  : never;

type ExtractActions<HashModule extends Record<string, Record<string, { action: (...arg: any[]) => Action<any>, handler: Handler<any, any> }>>> = {
  [K in keyof HashModule]: {
    [SUBK in keyof HashModule[K]]: HashModule[K][SUBK]['action']
  }
}

export type ResultOfAction<THashModule extends Record<string, Record<string, { action: (...arg: any[]) => Action<any>, handler: Handler<any, any> }>>, TAction extends Action<any> = any> = Promise<
  ResultOf<ExtractHandlers<THashModule>, TAction>
>

export default class Bus<
  HashModule extends Record<string, Record<string, { action: (...arg: any[]) => Action<any>, handler: Handler<any, any> }>> = Record<string, Record<string, any>>
> implements IBus<HashModule> {
  action: ExtractActions<HashModule> = {} as ExtractActions<HashModule>;
  private readonly _fabricHandlers: Record<string, Handler<any, any>>;

  constructor(hashModule: HashModule) {
    this._fabricHandlers = {};

    (Object.entries(hashModule) as Array<[keyof HashModule, HashModule[keyof HashModule]]>).forEach(([ moduleName, hashAction ]) => {
      if (!this.action[moduleName]) {
        this.action[moduleName] = {} as ExtractActions<HashModule>[keyof ExtractActions<HashModule>];
      }
      (Object.entries(hashAction) as Array<[keyof HashModule[keyof HashModule], { action: (...arg: any[]) => Action<any>, handler: Handler<any, any> }]>).forEach(([ actionName, actionAndHandler ]) => {
        const handler = actionAndHandler.handler();
        this.action[moduleName][actionName] = actionAndHandler.action;
        const tag = handler.__tag;
        if (this._fabricHandlers[tag]) {
          throw new HandlerDuplicateError(`Handler already exist with name ${tag}`);
        }

        this._fabricHandlers[tag] = actionAndHandler.handler;
      });
    });

  }

  async exec<TAction extends Action<any> = any>(action: TAction): Promise<ResultOf<ExtractHandlers<HashModule>, TAction>> {
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
